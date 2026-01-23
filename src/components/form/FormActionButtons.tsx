import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFormStore } from "@/hooks/useFormStore";
import { Download, Eye, Trash2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FormActionButtons = () => {
  const { selectedTemplate, responses, clearAll } = useFormStore();
  const navigate = useNavigate();

  const handleCreateEditableForm = () => {
    // Gerar ID único para o formulário
    const formId = `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // Abrir em nova aba
    window.open(`/form-editor/${formId}`, '_blank');
  };

  const handlePreview = () => {
    // TODO: Implementar preview dos formulários
    console.log('Preview formulários');
  };

  const handleGenerate = () => {
    // TODO: Implementar geração dos formulários
    console.log('Gerar formulários');
  };

  const handleClear = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
      clearAll();
    }
  };

  const canGenerate = selectedTemplate && responses.length > 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={handleCreateEditableForm}
            disabled={!selectedTemplate}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Criar Formulário Editável
          </Button>

          <Button
            onClick={handlePreview}
            variant="outline"
            disabled={!selectedTemplate}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Visualizar
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Gerar Formulários
          </Button>

          <Button
            onClick={handleClear}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Tudo
          </Button>
        </div>

        {!selectedTemplate && (
          <p className="text-center text-sm text-muted-foreground mt-3">
            Selecione um template para começar
          </p>
        )}
      </CardContent>
    </Card>
  );
};