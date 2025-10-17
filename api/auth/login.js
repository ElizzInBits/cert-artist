import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Buscar usuário no banco
    const user = await prisma.adminUser.findUnique({
      where: { username }
    });

    if (!user) {
      // Fallback: credenciais padrão
      if (username === 'admin' && password === 'admin123') {
        return res.status(200).json({ success: true });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  } catch (error) {
    console.error('Auth error:', error);
    
    // Fallback em caso de erro
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
      return res.status(200).json({ success: true });
    }
    
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}