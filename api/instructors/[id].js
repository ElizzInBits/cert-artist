import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'PUT') {
      const updateData = { ...req.body, lastUsed: new Date() };
      const instructor = await prisma.instructor.update({
        where: { id },
        data: updateData,
      });
      return res.json(instructor);
    }

    if (req.method === 'DELETE') {
      await prisma.instructor.update({
        where: { id },
        data: { isActive: false },
      });
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}