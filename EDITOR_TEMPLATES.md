# Editor de Templates Personalizado

## Funcionalidades Implementadas

O sistema agora possui um editor de templates personalizado completo, similar ao Word/Google Docs, com as seguintes funcionalidades:

### 🎨 Formatação de Texto
- **Negrito, Itálico, Sublinhado**
- **Títulos** (H1, H2, H3)
- **Alinhamento** (Esquerda, Centro, Direita)
- **Fontes** (Arial, Times New Roman, Courier New, Georgia, Verdana)

### 📋 Listas e Tabelas
- **Listas com marcadores**
- **Listas numeradas**
- **Tabelas** com redimensionamento de colunas
- Células com cabeçalho

### 🔧 Ferramentas de Edição
- **Desfazer/Refazer** (Undo/Redo)
- **Salvar** template no sistema
- **Baixar** como arquivo HTML

## Como Usar

### 1. Criar um Novo Template Personalizado

1. Na aba de **Formulários**, localize a seção "Templates de Formulário"
2. Clique no botão **"Criar Template Personalizado"**
3. Uma nova janela em tela cheia será aberta com o editor

### 2. Editar o Template

Use a barra de ferramentas no topo para:
- Alterar o nome do template (campo no canto superior esquerdo)
- Formatar texto (negrito, itálico, sublinhado)
- Adicionar títulos e parágrafos
- Inserir tabelas (clique no ícone de tabela)
- Criar listas
- Alinhar texto

### 3. Inserir Tabelas

1. Clique no ícone de **tabela** na barra de ferramentas
2. Uma tabela 3x3 será inserida automaticamente
3. Clique nas células para editar o conteúdo
4. Arraste as bordas para redimensionar colunas

### 4. Salvar o Template

1. Clique no botão **"Salvar"** no canto superior direito
2. O template será salvo e aparecerá na lista "Templates Personalizados"
3. Você pode selecionar o template salvo para usar na geração de formulários

### 5. Baixar como HTML

1. Clique no botão **"Baixar"**
2. Um arquivo HTML será baixado com o conteúdo do template
3. Este arquivo pode ser aberto em qualquer navegador

### 6. Gerenciar Templates Salvos

- Os templates personalizados aparecem na seção **"Templates Personalizados"**
- Clique em um template para selecioná-lo
- Use o ícone de **lixeira** para excluir um template

## Tecnologias Utilizadas

- **TipTap**: Editor WYSIWYG moderno e extensível
- **React**: Framework de interface
- **Tailwind CSS**: Estilização
- **LocalStorage**: Armazenamento dos templates

## Estrutura de Arquivos

```
src/components/form/
├── CustomTemplateEditor.tsx      # Editor principal
├── CustomTemplatesList.tsx       # Lista de templates salvos
├── FormTemplateManager.tsx       # Gerenciador de templates
└── editor-styles.css             # Estilos do editor
```

## Próximas Melhorias Possíveis

- [ ] Adicionar mais opções de fontes
- [ ] Suporte a imagens
- [ ] Exportar para PDF
- [ ] Importar templates existentes
- [ ] Colaboração em tempo real
- [ ] Histórico de versões
