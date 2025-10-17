import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createInterface } from 'readline';

const prisma = new PrismaClient();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

async function changeAdminPassword() {
  try {
    console.log('🔐 Alteração de Senha do Administrador\n');

    const newPassword = await new Promise<string>((resolve) => {
      rl.question('Digite a nova senha: ', (answer) => {
        resolve(answer);
      });
    });

    if (newPassword.length < 6) {
      console.log('❌ A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.adminUser.update({
      where: { username: 'admin' },
      data: { password: hashedPassword }
    });

    console.log('✅ Senha alterada com sucesso!');
    console.log('🔒 Use a nova senha para fazer login');

  } catch (error) {
    console.error('❌ Erro ao alterar senha:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

changeAdminPassword();