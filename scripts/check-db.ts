import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkAndSetupDatabase() {
  try {
    console.log('🔍 Verificando conexão com o banco de dados...');
    
    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida');

    // Verificar se a tabela existe
    try {
      const userCount = await prisma.adminUser.count();
      console.log(`📊 Usuários admin encontrados: ${userCount}`);

      if (userCount === 0) {
        console.log('👤 Criando usuário admin padrão...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await prisma.adminUser.create({
          data: {
            username: 'admin',
            password: hashedPassword,
          },
        });
        
        console.log('✅ Usuário admin criado com sucesso!');
        console.log('📝 Credenciais: admin / admin123');
      } else {
        console.log('✅ Usuário admin já existe');
      }

    } catch (tableError) {
      console.error('❌ Erro ao acessar tabela admin_users:', tableError);
      console.log('💡 Execute: npm run db:migrate para criar as tabelas');
    }

  } catch (connectionError) {
    console.error('❌ Erro de conexão com banco:', connectionError);
    console.log('💡 Verifique se DATABASE_URL está configurada corretamente');
    console.log('💡 Para desenvolvimento local, use: npm run db:migrate');
  } finally {
    await prisma.$disconnect();
  }
}

checkAndSetupDatabase();