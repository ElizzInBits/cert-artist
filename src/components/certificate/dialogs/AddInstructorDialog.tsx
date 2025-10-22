import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { validateImageFile } from "@/utils/imageProcessor";

import { Instructor } from "@/types/certificate";

interface AddInstructorDialogProps {
  children: React.ReactNode;
  onAdd: (instructor: Instructor, shouldSave?: boolean) => void;
}

export const AddInstructorDialog = ({ children, onAdd }: AddInstructorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [credential, setCredential] = useState("");
  const [signature, setSignature] = useState<File | null>(null);
  const [shouldSave, setShouldSave] = useState(false);
  const [imageValidation, setImageValidation] = useState<{ valid: boolean; error?: string; quality?: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleAdd = () => {
    if (!name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome do instrutor.",
        variant: "destructive",
      });
      return;
    }

    onAdd({ nome: name, registro: credential || undefined, assinatura: signature || undefined }, shouldSave);
    setName("");
    setCredential("");
    setSignature(null);
    setImageValidation(null);
    setShouldSave(false);
    setOpen(false);
    
    toast({
      title: "Instrutor adicionado",
      description: name,
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      // Validar arquivo
      const validation = validateImageFile(file);
      
      if (!validation.valid) {
        setImageValidation({ valid: false, error: validation.error });
        toast({
          title: "Arquivo inválido",
          description: validation.error,
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Analisar qualidade da imagem
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        const totalPixels = img.width * img.height;
        let quality: string;
        
        if (totalPixels > 100000) quality = 'high';
        else if (totalPixels > 25000) quality = 'medium';
        else quality = 'low';
        
        setImageValidation({ 
          valid: true, 
          quality,
          error: quality === 'low' ? 'Imagem pequena - pode afetar a qualidade final' : undefined
        });
        
        setSignature(file);
        setIsProcessing(false);
        
        if (quality === 'high') {
          toast({
            title: "Imagem de alta qualidade",
            description: `${img.width}x${img.height}px - Ótima para certificados`,
          });
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setImageValidation({ valid: false, error: 'Erro ao carregar imagem' });
        setIsProcessing(false);
      };
      
      img.src = objectUrl;
      
    } catch (error) {
      setImageValidation({ valid: false, error: 'Erro ao processar arquivo' });
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>👨‍🏫 Adicionar Instrutor</DialogTitle>
          <DialogDescription>
            Preencha os dados do instrutor do curso.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="instructor-name">Nome do Instrutor *</Label>
            <Input
              id="instructor-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructor-credential">Registro/Credencial</Label>
            <Input
              id="instructor-credential"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="Ex: CREA 12345"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructor-signature">Assinatura (Opcional)</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                readOnly
                value={signature?.name || "Nenhum arquivo selecionado"}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                disabled={isProcessing}
                onClick={() => document.getElementById("instructor-signature-file-input")?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processando...' : 'Upload'}
              </Button>
              <input
                id="instructor-signature-file-input"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
            
            {/* Feedback de validação */}
            {imageValidation && (
              <div className="flex items-center gap-2 mt-2">
                {imageValidation.valid ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <Badge 
                      className={
                        imageValidation.quality === 'high' ? 'bg-green-100 text-green-800' :
                        imageValidation.quality === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-orange-100 text-orange-800'
                      }
                    >
                      {imageValidation.quality === 'high' ? 'Alta Qualidade' :
                       imageValidation.quality === 'medium' ? 'Qualidade Média' :
                       'Baixa Qualidade'}
                    </Badge>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">{imageValidation.error}</span>
                  </>
                )}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Formato: PNG, JPG ou WebP (fundo transparente recomendado)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="save-instructor"
              checked={shouldSave}
              onChange={(e) => setShouldSave(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="save-instructor" className="text-sm text-muted-foreground">
              Salvar na biblioteca para uso futuro
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAdd}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
