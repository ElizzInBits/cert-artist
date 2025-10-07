import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileOutput } from "lucide-react";

export const OutputFormatSection = () => {
  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileOutput className="w-5 h-5 text-primary" />
          Formato de Saída
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue="pdf" className="flex gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pdf" id="pdf" />
            <Label htmlFor="pdf" className="cursor-pointer font-normal">
              📄 PDF
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="powerpoint" id="powerpoint" />
            <Label htmlFor="powerpoint" className="cursor-pointer font-normal">
              📊 PowerPoint (Editável)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both" className="cursor-pointer font-normal">
              📋 Ambos (PDF + PowerPoint)
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
