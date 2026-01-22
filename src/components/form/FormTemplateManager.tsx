import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFormStore } from "@/hooks/useFormStore";
import { FormTemplate } from "@/types/form";
import { Layout, Plus } from "lucide-react";

// Templates padrão temporários - você pode personalizar depois
const defaultTemplates: FormTemplate[] = [
  {
    id: 'avaliacao-padrao',
    nome: 'Avaliação Padrão',
    descricao: 'Formulário básico de avaliação',
    tipo: 'padrao',
    campos: [
      { id: 'nome', label: 'Nome Completo', type: 'text', required: true },
      { id: 'email', label: 'E-mail', type: 'text', required: true },
      { id: 'avaliacao', label: 'Avaliação', type: 'select', required: true, options: ['Excelente', 'Bom', 'Regular', 'Ruim'] }
    ],
    configuracao: {
      fontConfig: { titulo: 18, campos: 12, labels: 14, conteudo: 12 },
      layoutConfig: { margens: { top: 50, bottom: 50, left: 50, right: 50 }, espacamento: 15 }
    }
  },
  {
    id: 'feedback-padrao',
    nome: 'Feedback Padrão',
    descricao: 'Formulário de feedback básico',
    tipo: 'padrao',
    campos: [
      { id: 'nome', label: 'Nome', type: 'text', required: true },
      { id: 'comentarios', label: 'Comentários', type: 'textarea', required: false }
    ],
    configuracao: {
      fontConfig: { titulo: 18, campos: 12, labels: 14, conteudo: 12 },
      layoutConfig: { margens: { top: 50, bottom: 50, left: 50, right: 50 }, espacamento: 15 }
    }
  }
];

export const FormTemplateManager = () => {
  const { selectedTemplate, setSelectedTemplate } = useFormStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="w-5 h-5" />
          Templates de Formulário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {defaultTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTemplate?.id === template.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{template.nome}</h3>
                <Badge variant={template.tipo === 'padrao' ? 'default' : 'secondary'}>
                  {template.tipo}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{template.descricao}</p>
              <p className="text-xs text-muted-foreground">
                {template.campos.length} campos
              </p>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Criar Template Personalizado
        </Button>
      </CardContent>
    </Card>
  );
};