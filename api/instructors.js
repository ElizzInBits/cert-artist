import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { activeOnly = 'true' } = req.query;
      const instructors = await prisma.instructor.findMany({
        where: activeOnly === 'true' ? { isActive: true } : undefined,
        orderBy: { lastUsed: 'desc' },
      });
      return res.json(instructors);
    }

    if (req.method === 'POST') {
      const { nome, registro, assinatura, mimeType } = req.body;
      const instructor = await prisma.instructor.create({
        data: { nome, registro, assinatura, mimeType },
      });
      return res.json(instructor);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}