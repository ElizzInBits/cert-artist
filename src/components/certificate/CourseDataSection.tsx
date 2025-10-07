import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

export const CourseDataSection = () => {
  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Dados do Curso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="empresa">🏢 Empresa</Label>
          <Input id="empresa" placeholder="Nome da empresa" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="curso">📚 Curso</Label>
          <Input id="curso" placeholder="Nome do curso" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="modalidade">🎯 Modalidade</Label>
            <Input id="modalidade" placeholder="Ex: Presencial" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">📋 Tipo</Label>
            <Input id="tipo" placeholder="Ex: Treinamento" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="carga-horaria">⏱️ Carga Horária</Label>
            <Input id="carga-horaria" placeholder="Ex: 40h" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodo">📅 Período</Label>
            <Input id="periodo" placeholder="Ex: 01/01/2024 a 31/01/2024" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aproveitamento">📈 Aproveitamento</Label>
          <Input id="aproveitamento" placeholder="Ex: 95%" />
        </div>
      </CardContent>
    </Card>
  );
};
