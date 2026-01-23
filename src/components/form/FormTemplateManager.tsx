import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFormStore } from "@/hooks/useFormStore";
import { FormTemplate } from "@/types/form";
import { Layout, Plus } from "lucide-react";
import React from "react";

// Templates padrão
const defaultTemplates: FormTemplate[] = [
  {
    id: 'avaliacao-atividades-criticas',
    nome: 'Avaliação de Atividades Críticas',
    descricao: 'Formulário pré-formatado - apenas preencha os dados',
    tipo: 'padrao',
    campos: [
      // Campos que o usuário preenche via Excel/planilha
      { id: 'nome', label: 'Nome', type: 'text', required: true },
      { id: 'pn', label: 'PN', type: 'text', required: false },
      { id: 'cargo', label: 'Cargo', type: 'text', required: true },
      { id: 'setor', label: 'Setor', type: 'text', required: false },
      { id: 'observacao', label: 'Observação', type: 'textarea', required: false },
      { id: 'peso', label: 'PESO', type: 'text', required: false },
      { id: 'altura', label: 'ALTURA', type: 'text', required: false },
      { id: 'imc', label: 'IMC', type: 'text', required: false },
      { id: 'pa', label: 'PA', type: 'text', required: false },
      { id: 'fc', label: 'FC', type: 'text', required: false },
      { id: 'fr', label: 'FR', type: 'text', required: false },
    ],
    configuracao: {
      fontConfig: { titulo: 16, campos: 10, labels: 11, conteudo: 10 },
      layoutConfig: { margens: { top: 40, bottom: 40, left: 40, right: 40 }, espacamento: 8 }
    }
  }
];

export const FormTemplateManager = () => {
  const { selectedTemplate, setSelectedTemplate } = useFormStore();

  // Selecionar automaticamente o template ao carregar
  React.useEffect(() => {
    if (!selectedTemplate && defaultTemplates.length > 0) {
      setSelectedTemplate(defaultTemplates[0]);
    }
  }, [selectedTemplate, setSelectedTemplate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="w-5 h-5" />
          Templates de Formulário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="p-4 border rounded-lg cursor-pointer transition-colors border-primary bg-primary/5"
          onClick={() => setSelectedTemplate(defaultTemplates[0])}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium">{defaultTemplates[0].nome}</h3>
            <Badge variant="default">{defaultTemplates[0].tipo}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{defaultTemplates[0].descricao}</p>
          <p className="text-xs text-muted-foreground">
            {defaultTemplates[0].campos.length} campos
          </p>
        </div>
        
        <Button variant="outline" className="w-full mt-4">
          <Plus className="w-4 h-4 mr-2" />
          Criar Template Personalizado
        </Button>
      </CardContent>
    </Card>
  );
};