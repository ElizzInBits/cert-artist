# Deploy no Vercel - Guia Completo

## 1. Configurar Banco de Dados

### Opção A: Vercel Postgres (Recomendado)
1. No dashboard do Vercel, vá em **Storage** → **Create Database**
2. Escolha **Postgres**
3. Copie a `DATABASE_URL` gerada

### Opção B: Supabase (Gratuito)
1. Acesse [supabase.com](https://supabase.com)
2. Crie um projeto
3. Vá em **Settings** → **Database**
4. Copie a **Connection String**

## 2. Configurar Variáveis no Vercel

No dashboard do Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   ```
   DATABASE_URL=sua_connection_string_aqui
   ```

## 3. Deploy e Configuração Inicial

### Primeira vez:
```bash
# 1. Push para GitHub
git add .
git commit -m "feat: sistema de auth com banco"
git push

# 2. Conectar no Vercel
# - Importe o repositório no dashboard do Vercel
# - Configure a DATABASE_URL
# - Deploy automático

# 3. Executar seed (uma vez só)
# No terminal local com DATABASE_URL de produção:
DATABASE_URL="sua_url_de_producao" npm run db:seed
```

### Ou via Vercel CLI:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Executar seed na produção
vercel env pull .env.local
npm run db:seed
```

## 4. Comandos Úteis

```bash
# Aplicar migrações na produção
DATABASE_URL="url_producao" npx prisma migrate deploy

# Ver dados na produção
DATABASE_URL="url_producao" npx prisma studio

# Reset completo (cuidado!)
DATABASE_URL="url_producao" npx prisma migrate reset
```

## 5. Troubleshooting

### Erro "PrismaClient is unable to connect"
- Verifique se DATABASE_URL está configurada no Vercel
- Teste a conexão localmente primeiro

### Erro "Table doesn't exist"
- Execute as migrações: `prisma migrate deploy`
- Execute o seed: `npm run db:seed`

### Build falha no Vercel
- Verifique se `postinstall` está no package.json
- Confirme que todas as dependências estão instaladas