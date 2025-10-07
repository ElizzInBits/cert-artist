import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Pen } from "lucide-react";

export const SignatureConfigSection = () => {
  const [width, setWidth] = useState([150]);
  const [height, setHeight] = useState([100]);
  const [positionY, setPositionY] = useState([10]);

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pen className="w-5 h-5 text-primary" />
          Configurações de Assinatura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>📏 Largura</Label>
            <span className="text-sm font-medium">{width[0]}px</span>
          </div>
          <Slider
            value={width}
            onValueChange={setWidth}
            min={50}
            max={300}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>📐 Altura</Label>
            <span className="text-sm font-medium">{height[0]}px</span>
          </div>
          <Slider
            value={height}
            onValueChange={setHeight}
            min={30}
            max={200}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>📍 Posição Y</Label>
            <span className="text-sm font-medium">{positionY[0]}</span>
          </div>
          <Slider
            value={positionY}
            onValueChange={setPositionY}
            min={-50}
            max={50}
            step={1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
