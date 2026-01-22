import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormStore } from "@/hooks/useFormStore";
import { FileText } from "lucide-react";

export const FormDataSection = () => {
  const { formData, setFormData } = useFormStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Dados do Formulário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título do Formulário</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => setFormData({ titulo: e.target.value })}
            placeholder="Ex: Formulário de Avaliação"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            value={formData.empresa}
            onChange={(e) => setFormData({ empresa: e.target.value })}
            placeholder="Nome da empresa"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Formulário</Label>
          <Select value={formData.tipo} onValueChange={(value: 'padrao' | 'personalizado') => setFormData({ tipo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="padrao">Padrão</SelectItem>
              <SelectItem value="personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ descricao: e.target.value })}
            placeholder="Descrição do formulário..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};