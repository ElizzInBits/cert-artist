import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCertificateStore } from "@/hooks/useCertificateStore";
import { readExcelFile } from "@/utils/excelReader";
import { SpreadsheetEditor } from "./SpreadsheetEditor";

interface FileUploadSectionProps {
  excelFile: File | null;
  setExcelFile: (file: File | null) => void;
}

export const FileUploadSection = ({
  excelFile,
  setExcelFile,
}: FileUploadSectionProps) => {
  const { toast } = useToast();
  const { setExcelFile: setStoreExcelFile, setEmployees } = useCertificateStore();

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
    acceptedTypes: string[],
    fileType?: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension && acceptedTypes.includes(fileExtension)) {
        setter(file);
        
        if (fileType === 'excel') {
          try {
            console.log('Processando arquivo Excel:', file.name);
            setStoreExcelFile(file);
            const employees = await readExcelFile(file);
            console.log('Funcionários processados:', employees);
            console.log('Salvando no store:', employees.length, 'funcionários');
            setEmployees(employees);
            console.log('Store atualizado');
            toast({
              title: "Planilha carregada",
              description: `${file.name} - ${employees.length} funcionários encontrados`,
            });
            return;
          } catch (error) {
            console.error('Erro ao processar Excel:', error);
            toast({
              title: "Erro ao processar planilha",
              description: error instanceof Error ? error.message : "Erro desconhecido",
              variant: "destructive",
            });
            return;
          }
        }
        
        toast({
          title: "Arquivo carregado",
          description: file.name,
        });
      } else {
        toast({
          title: "Tipo de arquivo inválido",
          description: `Aceito apenas: ${acceptedTypes.join(", ")}`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Arquivos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-accent font-medium">
            📄 Modelos PDF: Pré-configurados
          </Label>
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              📄 <strong>Modelo Base</strong>: Certificado de 2 páginas (padrão)<br/>
              📋 <strong>Modelo Base-2</strong>: Certificado de 3 páginas (com observações)<br/>

            </p>
          </div>
        </div>



        <div className="space-y-2">
          <Label htmlFor="excel-upload">👥 Lista Funcionários</Label>
          <div className="flex gap-2">
            <Input
              id="excel-upload"
              type="text"
              readOnly
              value={excelFile?.name || "Nenhum arquivo selecionado"}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("excel-file-input")?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <SpreadsheetEditor />
            <input
              id="excel-file-input"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => handleFileSelect(e, setExcelFile, ["xlsx", "xls"], "excel")}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Faça upload de uma planilha Excel ou crie uma nova usando o editor integrado
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
