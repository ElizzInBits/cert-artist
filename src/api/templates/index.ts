import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const templates = await prisma.certificateTemplate.findMany({
        orderBy: { updatedAt: 'desc' }
      })
      res.status(200).json(templates)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar templates' })
    }
  }

  if (req.method === 'POST') {
    try {
      const template = await prisma.certificateTemplate.create({
        data: req.body
      })
      res.status(201).json(template)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar template' })
    }
  }
}