# Sistema de Segurança - Gerador de Certificados

## Implementação de Login Administrativo

### Funcionalidades Implementadas

1. **Autenticação Segura**
   - Login com usuário e senha armazenados no banco de dados
   - Senhas criptografadas com bcrypt (hash + salt)
   - Usuário padrão: `admin` | Senha padrão: `admin123`
   - Interface de login responsiva e intuitiva

2. **Proteção de Rotas**
   - Todas as páginas principais protegidas por autenticação
   - Redirecionamento automático para login se não autenticado

3. **Gerenciamento de Sessão**
   - Sessão armazenada no sessionStorage
   - Timeout automático de 8 horas
   - Botão de logout no header da aplicação

4. **Banco de Dados**
   - Credenciais armazenadas de forma segura no PostgreSQL
   - Modelo AdminUser no Prisma
   - Script de seed para criar usuário inicial

### Arquivos Criados/Modificados

- `src/contexts/AuthContext.tsx` - Contexto de autenticação
- `src/pages/Login.tsx` - Página de login com usuário e senha
- `src/components/ProtectedRoute.tsx` - Componente de proteção de rotas
- `src/lib/auth.ts` - Utilitários de autenticação e hash
- `src/config/auth.ts` - Configurações de autenticação
- `prisma/schema.prisma` - Modelo AdminUser
- `prisma/seed.ts` - Script para criar usuário inicial
- `src/App.tsx` - Integração do sistema de auth
- `src/pages/Index.tsx` - Adição do botão de logout

### Como Usar

1. **Primeira vez**: Execute `npm run db:seed` para criar o usuário admin
2. **Login**: Use `admin` / `admin123`
3. **Trocar senha**: Use a função `changePassword` na lib/auth.ts

### Configuração do Banco

1. Configure sua `DATABASE_URL` no arquivo `.env`
2. Execute as migrações: `npm run db:migrate`
3. Execute o seed: `npm run db:seed`
4. Gere o cliente: `npm run db:generate`

### Segurança

- Senhas criptografadas com bcrypt (salt + hash)
- Credenciais armazenadas no banco de dados
- Sessão expira automaticamente em 8 horas
- Logout limpa completamente a sessão
- Interface protegida contra acesso não autorizado
- Verificação assíncrona no banco de dados