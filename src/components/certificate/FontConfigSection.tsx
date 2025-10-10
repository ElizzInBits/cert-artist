import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Type, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCertificateStore } from "@/hooks/useCertificateStore";

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
  const { fontConfig, setFontConfig } = useCertificateStore();
  const { toast } = useToast();

  const handleReset = () => {
    setFontConfig({
      nome: 16,
      campos: 12,
      conformidade: 10,
      conteudo: 12,
      instrutores: 12,
      responsaveis: 12,
      aproveitamento: 12,
      observacoes: 12,
      cpf: 12,
      nome_curso: 12
    });
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
        <div className="grid grid-cols-2 gap-6">
          {/* Página 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="font-semibold text-sm text-blue-700">Página 1 - Dados Principais</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  Nome Aluno
                  <span className="text-muted-foreground">({fontConfig.nome}px)</span>
                </Label>
                <Input
                  type="number"
                  min={8}
                  max={24}
                  value={fontConfig.nome}
                  onChange={(e) => setFontConfig({ nome: parseInt(e.target.value) })}
                  className="h-8"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  CPF
                  <span className="text-muted-foreground">({fontConfig.cpf}px)</span>
                </Label>
                <Input
                  type="number"
                  min={8}
                  max={16}
                  value={fontConfig.cpf}
                  onChange={(e) => setFontConfig({ cpf: parseInt(e.target.value) })}
                  className="h-8"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  Nome Curso
                  <span className="text-muted-foreground">({fontConfig.nome_curso}px)</span>
                </Label>
                <Input
                  type="number"
                  min={8}
                  max={18}
                  value={fontConfig.nome_curso}
                  onChange={(e) => setFontConfig({ nome_curso: parseInt(e.target.value) })}
                  className="h-8"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  Campos
                  <span className="text-muted-foreground">({fontConfig.campos}px)</span>
                </Label>
                <Input
                  type="number"
                  min={8}
                  max={18}
                  value={fontConfig.campos}
                  onChange={(e) => setFontConfig({ campos: parseInt(e.target.value) })}
                  className="h-8"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  Conformidade
                  <span className="text-muted-foreground">({fontConfig.conformidade}px)</span>
                </Label>
                <Input
                  type="number"
                  min={8}
                  max={16}
                  value={fontConfig.conformidade}
                  onChange={(e) => setFontConfig({ conformidade: parseInt(e.target.value) })}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          {/* Página 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h3 className="font-semibold text-sm text-green-700">Página 2 - Conteúdo e Equipe</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  Conteúdo
                  <span className="text-muted-foreground">({fontConfig.conteudo}px)</span>
                </Label>
                <Input
                  type="number"
                  min={8}
                  max={16}
                  value={fontConfig.conteudo}
                  onChange={(e) => setFontConfig({ conteudo: parseInt(e.target.value) })}
                  className="h-8"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  Instrutores
                  <span className="text-muted-foreground">({fontConfig.instrutores}px)</span>
                </Label>
                <Input
                  type="number"
                  min={8}
                  max={16}
                  value={fontConfig.instrutores}
                  onChange={(e) => setFontConfig({ instrutores: parseInt(e.target.value) })}
                  className="h-8"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  Responsáveis
                  <span className="text-muted-foreground">({fontConfig.responsaveis}px)</span>
                </Label>
                <Input
                  type="number"
                  min={8}
                  max={16}
                  value={fontConfig.responsaveis}
                  onChange={(e) => setFontConfig({ responsaveis: parseInt(e.target.value) })}
                  className="h-8"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  Aproveitamento
                  <span className="text-muted-foreground">({fontConfig.aproveitamento}px)</span>
                </Label>
                <Input
                  type="number"
                  min={8}
                  max={16}
                  value={fontConfig.aproveitamento}
                  onChange={(e) => setFontConfig({ aproveitamento: parseInt(e.target.value) })}
                  className="h-8"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  Observações
                  <span className="text-muted-foreground">({fontConfig.observacoes}px)</span>
                </Label>
                <Input
                  type="number"
                  min={8}
                  max={16}
                  value={fontConfig.observacoes}
                  onChange={(e) => setFontConfig({ observacoes: parseInt(e.target.value) })}
                  className="h-8"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-4 border-t">

          <Button onClick={handleReset} variant="outline" className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50">
            <RotateCcw className="w-4 h-4" />
            Restaurar Padrão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
