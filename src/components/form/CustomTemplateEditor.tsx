import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Table as TableIcon, Undo, Redo, Save, Download, X,
  Highlighter, Image as ImageIcon, Link as LinkIcon, Type, Palette, Strikethrough,
  Code, Quote, Minus, FileText
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useCallback } from 'react';

interface CustomTemplateEditorProps {
  onClose: () => void;
  onSave: (content: string, name: string) => void;
}

export const CustomTemplateEditor = ({ onClose, onSave }: CustomTemplateEditorProps) => {
  const [templateName, setTemplateName] = useState('Novo Template');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TextStyle,
      Color,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({ multicolor: true }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Comece a digitar seu template personalizado...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[600px] p-12',
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('URL da imagem:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const handleSave = () => {
    const content = editor.getHTML();
    onSave(content, templateName);
  };

  const handleDownload = () => {
    const content = editor.getHTML();
    const blob = new Blob([`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${templateName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          table { border-collapse: collapse; width: 100%; }
          table td, table th { border: 1px solid #ddd; padding: 8px; }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName}.html`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 z-50 flex flex-col">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="max-w-xs font-semibold text-lg border-none shadow-none focus-visible:ring-0"
                placeholder="Nome do template"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Salvar
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Baixar
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 p-3 rounded-xl shadow-inner border">
            {/* Fonte */}
            <Select
              value={editor.getAttributes('textStyle').fontFamily || 'Arial'}
              onValueChange={(value) => editor.chain().focus().setFontFamily(value).run()}
            >
              <SelectTrigger className="w-36 h-9 text-xs bg-white dark:bg-slate-800 shadow-sm">
                <SelectValue placeholder="Fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
                <SelectItem value="Tahoma">Tahoma</SelectItem>
                <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
              </SelectContent>
            </Select>

            {/* Tamanho */}
            <Select
              onValueChange={(value) => {
                const level = parseInt(value);
                if (level === 0) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
                }
              }}
            >
              <SelectTrigger className="w-28 h-9 text-xs bg-white dark:bg-slate-800 shadow-sm">
                <SelectValue placeholder="Tamanho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Normal</SelectItem>
                <SelectItem value="1">Título 1</SelectItem>
                <SelectItem value="2">Título 2</SelectItem>
                <SelectItem value="3">Título 3</SelectItem>
                <SelectItem value="4">Título 4</SelectItem>
                <SelectItem value="5">Título 5</SelectItem>
                <SelectItem value="6">Título 6</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-7 mx-1" />

            {/* Formatação Básica */}
            <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm">
              <Button
                variant={editor.isActive('bold') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Negrito (Ctrl+B)"
                className="h-8 w-8 p-0"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant={editor.isActive('italic') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Itálico (Ctrl+I)"
                className="h-8 w-8 p-0"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant={editor.isActive('underline') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Sublinhado (Ctrl+U)"
                className="h-8 w-8 p-0"
              >
                <UnderlineIcon className="w-4 h-4" />
              </Button>
              <Button
                variant={editor.isActive('strike') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Tachado"
                className="h-8 w-8 p-0"
              >
                <Strikethrough className="w-4 h-4" />
              </Button>
              <Button
                variant={editor.isActive('code') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleCode().run()}
                title="Código"
                className="h-8 w-8 p-0"
              >
                <Code className="w-4 h-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-7 mx-1" />

            {/* Cor do Texto */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" title="Cor do texto">
                  <Type className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="grid grid-cols-8 gap-1">
                  {['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff',
                    '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666',
                    '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00',
                    '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00'].map(color => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().setColor(color).run()}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Destacar */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={editor.isActive('highlight') ? 'secondary' : 'ghost'} 
                  size="sm"
                  title="Destacar texto"
                >
                  <Highlighter className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="grid grid-cols-6 gap-1">
                  {['#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ff6600', '#ff0000'].map(color => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => editor.chain().focus().unsetHighlight().run()}
                >
                  Remover
                </Button>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="h-6" />

            {/* Alinhamento */}
            <Button
              variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              title="Alinhar à esquerda"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              title="Centralizar"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              title="Alinhar à direita"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'justify' }) ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              title="Justificar"
            >
              <AlignJustify className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Listas */}
            <Button
              variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Lista com marcadores"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Lista numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Citação e Linha */}
            <Button
              variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="Citação"
            >
              <Quote className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Linha horizontal"
            >
              <Minus className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Imagem e Link */}
            <Button
              variant="ghost"
              size="sm"
              onClick={addImage}
              title="Inserir imagem"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive('link') ? 'secondary' : 'ghost'}
              size="sm"
              onClick={setLink}
              title="Inserir link"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Tabela */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className="relative"
              >
                <TableIcon className="w-4 h-4" />
              </Button>
              <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-popover border rounded-lg shadow-lg p-3 z-50 min-w-[280px]">
                <div className="text-xs font-medium mb-3 px-1">Inserir Tabela</div>
                <div className="grid grid-cols-10 gap-0.5 mb-3">
                  {Array.from({ length: 100 }, (_, i) => {
                    const row = Math.floor(i / 10) + 1;
                    const col = (i % 10) + 1;
                    return (
                      <div
                        key={i}
                        className="w-5 h-5 border border-gray-300 hover:bg-primary/30 cursor-pointer transition-colors"
                        onClick={() => {
                          editor.chain().focus().insertTable({ rows: row, cols: col, withHeaderRow: false }).run();
                        }}
                        title={`${row}x${col}`}
                      />
                    );
                  })}
                </div>
                <div className="text-xs text-muted-foreground text-center">Clique para selecionar tamanho</div>
              </div>
            </div>
            
            {editor.isActive('table') && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded">
                  <span className="text-xs font-medium mr-1">Tabela:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    title="Adicionar coluna à esquerda"
                    className="h-7 px-2"
                  >
                    <span className="text-xs">+Col ←</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    title="Adicionar coluna à direita"
                    className="h-7 px-2"
                  >
                    <span className="text-xs">+Col →</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                    title="Adicionar linha acima"
                    className="h-7 px-2"
                  >
                    <span className="text-xs">+Lin ↑</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    title="Adicionar linha abaixo"
                    className="h-7 px-2"
                  >
                    <span className="text-xs">+Lin ↓</span>
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    title="Excluir coluna"
                    className="h-7 px-2 text-destructive hover:text-destructive"
                  >
                    <span className="text-xs">-Col</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    title="Excluir linha"
                    className="h-7 px-2 text-destructive hover:text-destructive"
                  >
                    <span className="text-xs">-Lin</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().mergeCells().run()}
                    title="Mesclar células"
                    className="h-7 px-2"
                    disabled={!editor.can().mergeCells()}
                  >
                    <span className="text-xs">Mesclar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().splitCell().run()}
                    title="Dividir célula"
                    className="h-7 px-2"
                    disabled={!editor.can().splitCell()}
                  >
                    <span className="text-xs">Dividir</span>
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                    title="Alternar linha de cabeçalho"
                    className="h-7 px-2"
                  >
                    <span className="text-xs">Cabeçalho</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    title="Excluir tabela"
                    className="h-7 px-2 text-destructive hover:text-destructive"
                  >
                    <span className="text-xs font-semibold">Excluir Tabela</span>
                  </Button>
                </div>
              </>
            )}

            <Separator orientation="vertical" className="h-6" />

            {/* Desfazer/Refazer */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="container mx-auto py-8">
          <div className="bg-white shadow-lg rounded-lg min-h-[800px]">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};
