import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadSectionProps {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  pptFile: File | null;
  setPptFile: (file: File | null) => void;
  excelFile: File | null;
  setExcelFile: (file: File | null) => void;
}

export const FileUploadSection = ({
  pdfFile,
  setPdfFile,
  pptFile,
  setPptFile,
  excelFile,
  setExcelFile,
}: FileUploadSectionProps) => {
  const { toast } = useToast();

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
    acceptedTypes: string[]
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension && acceptedTypes.includes(fileExtension)) {
        setter(file);
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
          <Label htmlFor="pdf-upload">📄 Modelo PDF</Label>
          <div className="flex gap-2">
            <Input
              id="pdf-upload"
              type="text"
              readOnly
              value={pdfFile?.name || "Nenhum arquivo selecionado"}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("pdf-file-input")?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Procurar
            </Button>
            <input
              id="pdf-file-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e, setPdfFile, ["pdf"])}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ppt-upload">📊 Modelo PowerPoint</Label>
          <div className="flex gap-2">
            <Input
              id="ppt-upload"
              type="text"
              readOnly
              value={pptFile?.name || "Nenhum arquivo selecionado"}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("ppt-file-input")?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Procurar
            </Button>
            <input
              id="ppt-file-input"
              type="file"
              accept=".pptx,.ppt"
              className="hidden"
              onChange={(e) => handleFileSelect(e, setPptFile, ["pptx", "ppt"])}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excel-upload">👥 Lista Funcionários Excel</Label>
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
              Procurar
            </Button>
            <input
              id="excel-file-input"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => handleFileSelect(e, setExcelFile, ["xlsx", "xls"])}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
