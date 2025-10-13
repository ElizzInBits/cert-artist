let PrismaClient
try {
  PrismaClient = require('@prisma/client').PrismaClient
} catch (error) {
  console.error('Failed to import Prisma:', error)
}

let prisma
if (PrismaClient) {
  try {
    prisma = new PrismaClient()
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Check if Prisma is available
  if (!prisma) {
    console.error('Prisma client not available')
    res.status(500).json({ error: 'Database not available' })
    return
  }

  try {
    if (req.method === 'GET') {
      console.log('Fetching templates...')
      const templates = await prisma.certificateTemplate.findMany({
        orderBy: { updatedAt: 'desc' }
      })
      console.log(`Found ${templates.length} templates`)
      res.status(200).json(templates)
    }

    if (req.method === 'POST') {
      console.log('Creating template:', req.body)
      const template = await prisma.certificateTemplate.create({
        data: req.body
      })
      console.log('Template created:', template.id)
      res.status(201).json(template)
    }
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ 
      error: 'Erro no servidor', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  } finally {
    if (prisma) {
      try {
        await prisma.$disconnect()
      } catch (error) {
        console.error('Error disconnecting Prisma:', error)
      }
    }
  }
}