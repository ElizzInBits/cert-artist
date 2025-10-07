import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Rocket, Target, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ActionButtons = () => {
  const { toast } = useToast();

  const handlePreview = () => {
    toast({
      title: "Gerando preview...",
      description: "Aguarde enquanto preparamos a visualização.",
    });
  };

  const handleGenerateAll = () => {
    toast({
      title: "Gerando certificados...",
      description: "Processando todos os funcionários da planilha.",
    });
  };

  const handleGenerateSelected = () => {
    toast({
      title: "Seleção de funcionários",
      description: "Selecione os funcionários para gerar certificados.",
    });
  };

  const handleClear = () => {
    toast({
      title: "Formulário limpo",
      description: "Todos os campos foram resetados.",
    });
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={handlePreview}
            className="gap-2 min-w-[200px]"
          >
            <Eye className="w-5 h-5" />
            👁️ VISUALIZAR
          </Button>

          <Button
            size="lg"
            onClick={handleGenerateAll}
            className="gap-2 min-w-[200px] bg-gradient-accent hover:opacity-90"
          >
            <Rocket className="w-5 h-5" />
            🚀 GERAR TODOS
          </Button>

          <Button
            size="lg"
            onClick={handleGenerateSelected}
            className="gap-2 min-w-[200px]"
          >
            <Target className="w-5 h-5" />
            🎯 GERAR SELECIONADOS
          </Button>

          <Button
            size="lg"
            variant="destructive"
            onClick={handleClear}
            className="gap-2 min-w-[200px]"
          >
            <Trash2 className="w-5 h-5" />
            🗑️ LIMPAR
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
