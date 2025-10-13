import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { id } = req.query

  try {
    if (req.method === 'GET') {
      const template = await prisma.certificateTemplate.findUnique({
        where: { id: id }
      })
      if (!template) {
        return res.status(404).json({ error: 'Template não encontrado' })
      }
      res.status(200).json(template)
    }

    if (req.method === 'PUT') {
      const template = await prisma.certificateTemplate.update({
        where: { id: id },
        data: req.body
      })
      res.status(200).json(template)
    }

    if (req.method === 'DELETE') {
      await prisma.certificateTemplate.delete({
        where: { id: id }
      })
      res.status(204).end()
    }
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Erro no servidor', details: error.message })
  } finally {
    await prisma.$disconnect()
  }
}