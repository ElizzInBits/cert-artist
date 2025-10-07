import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText } from "lucide-react";
import { useState } from "react";

export const DetailsSection = () => {
  const [includeObservations, setIncludeObservations] = useState(false);

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Detalhes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="conformidade">📜 Conformidade</Label>
          <Textarea
            id="conformidade"
            placeholder="Texto de conformidade do certificado..."
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conteudo">📝 Conteúdo Programático</Label>
          <Textarea
            id="conteudo"
            placeholder="Descreva o conteúdo programático do curso..."
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="add-observations"
            checked={includeObservations}
            onCheckedChange={(checked) => setIncludeObservations(checked as boolean)}
          />
          <Label
            htmlFor="add-observations"
            className="text-sm font-medium cursor-pointer"
          >
            ☑️ Adicionar Observações (3ª página)
          </Label>
        </div>

        {includeObservations && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="observacoes">💬 Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações adicionais..."
              className="min-h-[80px] resize-none"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
