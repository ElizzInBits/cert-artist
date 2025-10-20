import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pen, RotateCcw, Move, Maximize2, Settings2 } from "lucide-react";
import { useCertificateStore } from "@/hooks/useCertificateStore";
import { useToast } from "@/hooks/use-toast";

const presetSizes = {
  small: { width: 80, height: 40 },
  medium: { width: 120, height: 60 },
  large: { width: 160, height: 80 },
  xlarge: { width: 200, height: 100 }
};

const positionPresets = {
  top: -200,
  center: 0,
  bottom: 200
};

export const SignatureConfigSection = () => {
  const { signatureConfig, setSignatureConfig } = useCertificateStore();
  const { toast } = useToast();

  const handlePresetSize = (preset: keyof typeof presetSizes) => {
    const size = presetSizes[preset];
    setSignatureConfig({ width: size.width, height: size.height });
    toast({
      title: "Tamanho aplicado",
      description: `Assinatura configurada para ${preset} (${size.width}x${size.height}px)`
    });
  };

  const handlePositionPreset = (preset: keyof typeof positionPresets) => {
    const position = positionPresets[preset];
    setSignatureConfig({ offsetY: position });
    toast({
      title: "Posição aplicada",
      description: `Assinatura movida para ${preset}`
    });
  };

  const handleReset = () => {
    setSignatureConfig({ width: 120, height: 60, offsetY: 0 });
    toast({
      title: "Configurações resetadas",
      description: "Assinatura restaurada ao padrão"
    });
  };

  const handleCustomValue = (field: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setSignatureConfig({ [field]: numValue });
    }
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pen className="w-5 h-5 text-primary" />
          Configurações de Assinatura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Presets Rápidos */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Presets Rápidos</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tamanhos</Label>
              <div className="grid grid-cols-2 gap-1">
                <Button size="sm" variant="outline" onClick={() => handlePresetSize('small')} className="text-xs">
                  Pequeno
                </Button>
                <Button size="sm" variant="outline" onClick={() => handlePresetSize('medium')} className="text-xs">
                  Médio
                </Button>
                <Button size="sm" variant="outline" onClick={() => handlePresetSize('large')} className="text-xs">
                  Grande
                </Button>
                <Button size="sm" variant="outline" onClick={() => handlePresetSize('xlarge')} className="text-xs">
                  Extra
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Posições</Label>
              <div className="grid grid-cols-3 gap-1">
                <Button size="sm" variant="outline" onClick={() => handlePositionPreset('top')} className="text-xs">
                  Topo
                </Button>
                <Button size="sm" variant="outline" onClick={() => handlePositionPreset('center')} className="text-xs">
                  Centro
                </Button>
                <Button size="sm" variant="outline" onClick={() => handlePositionPreset('bottom')} className="text-xs">
                  Base
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Configurações Detalhadas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Dimensões Personalizadas</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Largura</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={signatureConfig.width}
                    onChange={(e) => handleCustomValue('width', e.target.value)}
                    className="w-16 h-7 text-xs"
                    min={30}
                    max={400}
                  />
                  <span className="text-xs text-muted-foreground">px</span>
                </div>
              </div>
              <Slider
                value={[signatureConfig.width]}
                onValueChange={([value]) => setSignatureConfig({ width: value })}
                min={30}
                max={400}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Altura</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={signatureConfig.height}
                    onChange={(e) => handleCustomValue('height', e.target.value)}
                    className="w-16 h-7 text-xs"
                    min={15}
                    max={200}
                  />
                  <span className="text-xs text-muted-foreground">px</span>
                </div>
              </div>
              <Slider
                value={[signatureConfig.height]}
                onValueChange={([value]) => setSignatureConfig({ height: value })}
                min={15}
                max={200}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Posicionamento Vertical</Label>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Deslocamento Y</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={signatureConfig.offsetY}
                  onChange={(e) => handleCustomValue('offsetY', e.target.value)}
                  className="w-16 h-7 text-xs"
                  min={-600}
                  max={600}
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
            </div>
            <Slider
              value={[signatureConfig.offsetY]}
              onValueChange={([value]) => setSignatureConfig({ offsetY: value })}
              min={-600}
              max={600}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>↑ Mais alto</span>
              <span>Centro</span>
              <span>Mais baixo ↓</span>
            </div>
          </div>
        </div>

        {/* Preview e Reset */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Preview: {signatureConfig.width}×{signatureConfig.height}px
            {signatureConfig.offsetY !== 0 && (
              <span className="ml-2">
                ({signatureConfig.offsetY > 0 ? '+' : ''}{signatureConfig.offsetY}px)
              </span>
            )}
          </div>
          <Button onClick={handleReset} variant="outline" size="sm" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};