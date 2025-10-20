# Sistema de Biblioteca de Pessoas

## Visão Geral

O sistema agora permite salvar instrutores e responsáveis técnicos no banco de dados PostgreSQL, incluindo suas assinaturas digitais. Isso elimina a necessidade de recriar essas informações a cada geração de certificado.

## Funcionalidades

### 🎯 Principais Recursos

- **Persistência no Banco**: Instrutores e responsáveis são salvos no PostgreSQL
- **Assinaturas Digitais**: Suporte completo a upload e armazenamento de assinaturas
- **Reutilização**: Pessoas salvas podem ser reutilizadas em múltiplos certificados
- **Histórico de Uso**: Controle de quando cada pessoa foi usada pela última vez
- **Busca e Filtros**: Interface intuitiva para encontrar pessoas salvas

### 📊 Estrutura do Banco

```sql
-- Tabela de Instrutores
CREATE TABLE instructors (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  registro TEXT,
  assinatura TEXT, -- Base64 da imagem
  mimeType TEXT,   -- Tipo da imagem (image/png, image/jpeg)
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  lastUsed TIMESTAMP DEFAULT now()
);

-- Tabela de Responsáveis
CREATE TABLE responsibles (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  registro TEXT,
  assinatura TEXT, -- Base64 da imagem
  mimeType TEXT,   -- Tipo da imagem (image/png, image/jpeg)
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  lastUsed TIMESTAMP DEFAULT now()
);
```

## Como Usar

### 1. Acessar a Biblioteca

Na seção "Equipe" do gerador de certificados:
- Clique no botão **"Salvos"** para acessar pessoas do banco de dados
- Clique no botão **"Local"** para acessar pessoas do localStorage (funcionalidade anterior)

### 2. Adicionar Pessoas

```typescript
// Exemplo de uso do hook
const { addInstructor, addResponsible } = usePeopleDatabase();

// Adicionar instrutor
await addInstructor({
  nome: "João Silva",
  registro: "CREA 123456",
  assinatura: file // File object da assinatura
});

// Adicionar responsável
await addResponsible({
  nome: "Maria Santos", 
  registro: "CRQ 789012",
  assinatura: file // File object da assinatura
});
```

### 3. Usar em Certificados

Quando uma pessoa salva é selecionada:
- Seus dados são automaticamente preenchidos
- A assinatura é convertida de base64 para File object
- O registro de "último uso" é atualizado

## Arquivos Principais

### Serviços
- `src/lib/peopleService.ts` - Operações CRUD no banco
- `src/hooks/usePeopleDatabase.ts` - Hook React para gerenciar estado

### Componentes
- `src/components/certificate/dialogs/SavedPeopleDialog.tsx` - Interface principal
- `src/components/certificate/PeopleManagement.tsx` - Componente de exemplo
- `src/components/certificate/TeamSection.tsx` - Integração com gerador

### Banco de Dados
- `prisma/schema.prisma` - Schema atualizado
- `prisma/migrations/` - Migração para criar tabelas

## Vantagens

### ✅ Benefícios

1. **Eficiência**: Não precisa recriar dados a cada certificado
2. **Consistência**: Informações padronizadas e sempre atualizadas
3. **Assinaturas Persistentes**: Upload uma vez, use sempre
4. **Histórico**: Controle de uso e frequência
5. **Backup**: Dados seguros no banco PostgreSQL
6. **Compartilhamento**: Múltiplos usuários podem usar as mesmas pessoas

### 🔄 Migração do Sistema Anterior

O sistema anterior (localStorage) continua funcionando:
- Botão **"Local"** acessa dados do localStorage
- Botão **"Salvos"** acessa dados do banco
- Migração gradual conforme necessário

## Exemplo de Uso Completo

```typescript
import { usePeopleDatabase } from '@/hooks/usePeopleDatabase';

function MeuComponente() {
  const {
    instructors,
    responsibles,
    addInstructor,
    addResponsible,
    getInstructorForCertificate,
    getResponsibleForCertificate
  } = usePeopleDatabase();

  // Adicionar novo instrutor
  const handleAddInstructor = async (data) => {
    await addInstructor({
      nome: data.nome,
      registro: data.registro,
      assinatura: data.signatureFile
    });
  };

  // Usar instrutor em certificado
  const handleUseInstructor = (instructor) => {
    const certificateData = getInstructorForCertificate(instructor);
    // certificateData agora tem formato compatível com gerador
  };

  return (
    <div>
      {instructors.map(instructor => (
        <div key={instructor.id}>
          <span>{instructor.nome}</span>
          <button onClick={() => handleUseInstructor(instructor)}>
            Usar
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Considerações Técnicas

### 🔒 Segurança
- Assinaturas são armazenadas como base64 no banco
- Validação de tipos MIME para imagens
- Soft delete (isActive = false) em vez de exclusão física

### 📈 Performance
- Índices automáticos nas chaves primárias
- Ordenação por lastUsed para acesso rápido aos mais usados
- Lazy loading dos dados quando necessário

### 🔧 Manutenção
- Logs detalhados para debugging
- Tratamento de erros com toast notifications
- Fallback para localStorage em caso de falha no banco