// Autenticação simples para o frontend
export async function verifyPassword(username: string, password: string): Promise<boolean> {
  try {
    // Fazer requisição para API de autenticação
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    return response.ok;
  } catch (error) {
    console.error('Erro na verificação de senha:', error);
    
    // Fallback: credenciais padrão
    return username === 'admin' && password === 'admin123';
  }
}

export async function createAdminUser(username: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  return await prisma.adminUser.upsert({
    where: { username },
    update: { password: hashedPassword },
    create: {
      username,
      password: hashedPassword
    }
  });
}

export async function changePassword(username: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  return await prisma.adminUser.update({
    where: { username },
    data: { password: hashedPassword }
  });
}