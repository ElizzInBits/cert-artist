import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Pen } from "lucide-react";
import { useCertificateStore } from "@/hooks/useCertificateStore";

export const SignatureConfigSection = () => {
  const { signatureConfig, setSignatureConfig } = useCertificateStore();

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pen className="w-5 h-5 text-primary" />
          Configurações de Assinatura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>📏 Largura Máx</Label>
              <span className="text-sm font-medium bg-muted px-2 py-1 rounded">{signatureConfig.width}px</span>
            </div>
            <Slider
              value={[signatureConfig.width]}
              onValueChange={([value]) => {
                console.log('Setting width to:', value);
                setSignatureConfig({ width: value });
              }}
              min={30}
              max={400}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>📐 Altura Máx</Label>
              <span className="text-sm font-medium bg-muted px-2 py-1 rounded">{signatureConfig.height}px</span>
            </div>
            <Slider
              value={[signatureConfig.height]}
              onValueChange={([value]) => {
                console.log('Setting height to:', value);
                setSignatureConfig({ height: value });
              }}
              min={15}
              max={200}
              step={5}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>📍 Posição Vertical</Label>
            <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
              {signatureConfig.offsetY > 0 ? '+' : ''}{signatureConfig.offsetY}px
            </span>
          </div>
          <Slider
            value={[signatureConfig.offsetY]}
            onValueChange={([value]) => {
              console.log('Setting offsetY to:', value);
              setSignatureConfig({ offsetY: value });
            }}
            min={-600}
            max={600}
            step={10}
            className="w-full"
          />
        </div>
        

      </CardContent>
    </Card>
  );
};
