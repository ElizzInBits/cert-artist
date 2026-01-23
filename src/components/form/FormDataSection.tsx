import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useFormStore } from "@/hooks/useFormStore";
import { Upload } from "lucide-react";

export const FormDataSection = () => {
  const { excelFile, setExcelFile } = useFormStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFile(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Dados dos Formulários
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="excel-file">Arquivo Excel com Dados</Label>
          <input
            type="file"
            id="excel-file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          />
          {excelFile && (
            <p className="text-sm text-green-600">
              ✓ Arquivo carregado: {excelFile.name}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Faça upload de um arquivo Excel com os dados para preenchimento dos formulários
          </p>
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-xs font-semibold mb-2">Colunas esperadas no Excel:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Nome</li>
              <li>• PN (opcional)</li>
              <li>• Cargo</li>
              <li>• Setor (opcional)</li>
              <li>• Peso, Altura, IMC, PA, FC, FR (opcionais)</li>
              <li>• Observacao (opcional)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};