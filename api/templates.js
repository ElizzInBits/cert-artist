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

  try {
    if (req.method === 'GET') {
      const templates = await prisma.certificateTemplate.findMany({
        orderBy: { updatedAt: 'desc' }
      })
      res.status(200).json(templates)
    }

    if (req.method === 'POST') {
      const template = await prisma.certificateTemplate.create({
        data: req.body
      })
      res.status(201).json(template)
    }
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Erro no servidor', details: error.message })
  } finally {
    await prisma.$disconnect()
  }
}