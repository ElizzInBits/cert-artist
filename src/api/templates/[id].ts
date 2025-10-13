import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const template = await prisma.certificateTemplate.findUnique({
        where: { id: id as string }
      })
      if (!template) {
        return res.status(404).json({ error: 'Template não encontrado' })
      }
      res.status(200).json(template)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar template' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const template = await prisma.certificateTemplate.update({
        where: { id: id as string },
        data: req.body
      })
      res.status(200).json(template)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar template' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.certificateTemplate.delete({
        where: { id: id as string }
      })
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar template' })
    }
  }
}