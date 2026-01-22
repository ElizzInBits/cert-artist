import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useFormStore } from "@/hooks/useFormStore";
import { Type } from "lucide-react";

export const FormFontConfigSection = () => {
  const { formConfig, setFormConfig } = useFormStore();

  const updateFontSize = (field: keyof typeof formConfig.fontConfig, value: number) => {
    setFormConfig({
      fontConfig: {
        ...formConfig.fontConfig,
        [field]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          Configuração de Fontes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Título ({formConfig.fontConfig.titulo}px)</Label>
          <Slider
            value={[formConfig.fontConfig.titulo]}
            onValueChange={([value]) => updateFontSize('titulo', value)}
            min={12}
            max={32}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Labels dos Campos ({formConfig.fontConfig.labels}px)</Label>
          <Slider
            value={[formConfig.fontConfig.labels]}
            onValueChange={([value]) => updateFontSize('labels', value)}
            min={8}
            max={24}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Campos ({formConfig.fontConfig.campos}px)</Label>
          <Slider
            value={[formConfig.fontConfig.campos]}
            onValueChange={([value]) => updateFontSize('campos', value)}
            min={8}
            max={20}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Conteúdo ({formConfig.fontConfig.conteudo}px)</Label>
          <Slider
            value={[formConfig.fontConfig.conteudo]}
            onValueChange={([value]) => updateFontSize('conteudo', value)}
            min={8}
            max={18}
            step={1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};