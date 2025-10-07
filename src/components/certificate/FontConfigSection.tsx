import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Type, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultFontSizes = {
  nomeAluno: 16,
  cpf: 12,
  nomeCurso: 12,
  campos: 12,
  conformidade: 10,
  conteudo: 12,
  instrutores: 12,
  responsaveis: 12,
  aproveitamento: 12,
  observacoes: 12,
};

export const FontConfigSection = () => {
  const [fontSizes, setFontSizes] = useState(defaultFontSizes);
  const { toast } = useToast();

  const handleApply = () => {
    toast({
      title: "Configurações aplicadas",
      description: "Tamanhos de fonte atualizados com sucesso!",
    });
  };

  const handleReset = () => {
    setFontSizes(defaultFontSizes);
    toast({
      title: "Configurações resetadas",
      description: "Tamanhos de fonte restaurados ao padrão.",
    });
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5 text-primary" />
          Configurações de Fonte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Página 1 */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold text-sm">Página 1 - Dados Principais</h3>
            
            <div className="space-y-2">
              <Label className="text-xs">Nome Aluno</Label>
              <Input
                type="number"
                min={8}
                max={24}
                value={fontSizes.nomeAluno}
                onChange={(e) => setFontSizes({ ...fontSizes, nomeAluno: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">CPF</Label>
              <Input
                type="number"
                min={8}
                max={16}
                value={fontSizes.cpf}
                onChange={(e) => setFontSizes({ ...fontSizes, cpf: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Nome Curso</Label>
              <Input
                type="number"
                min={8}
                max={18}
                value={fontSizes.nomeCurso}
                onChange={(e) => setFontSizes({ ...fontSizes, nomeCurso: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Campos</Label>
              <Input
                type="number"
                min={8}
                max={18}
                value={fontSizes.campos}
                onChange={(e) => setFontSizes({ ...fontSizes, campos: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Conformidade</Label>
              <Input
                type="number"
                min={8}
                max={16}
                value={fontSizes.conformidade}
                onChange={(e) => setFontSizes({ ...fontSizes, conformidade: parseInt(e.target.value) })}
              />
            </div>
          </div>

          {/* Página 2 */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold text-sm">Página 2 - Conteúdo e Equipe</h3>
            
            <div className="space-y-2">
              <Label className="text-xs">Conteúdo</Label>
              <Input
                type="number"
                min={8}
                max={16}
                value={fontSizes.conteudo}
                onChange={(e) => setFontSizes({ ...fontSizes, conteudo: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Instrutores</Label>
              <Input
                type="number"
                min={8}
                max={16}
                value={fontSizes.instrutores}
                onChange={(e) => setFontSizes({ ...fontSizes, instrutores: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Responsáveis</Label>
              <Input
                type="number"
                min={8}
                max={16}
                value={fontSizes.responsaveis}
                onChange={(e) => setFontSizes({ ...fontSizes, responsaveis: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Aproveitamento</Label>
              <Input
                type="number"
                min={8}
                max={16}
                value={fontSizes.aproveitamento}
                onChange={(e) => setFontSizes({ ...fontSizes, aproveitamento: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Observações</Label>
              <Input
                type="number"
                min={8}
                max={16}
                value={fontSizes.observacoes}
                onChange={(e) => setFontSizes({ ...fontSizes, observacoes: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={handleApply} className="gap-2">
            <Save className="w-4 h-4" />
            💾 Aplicar
          </Button>
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            🔄 Resetar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
