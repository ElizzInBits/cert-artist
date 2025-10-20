import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { Responsible } from "@/types/certificate";

interface EditResponsibleDialogProps {
  responsible: Responsible;
  onSave: (responsible: Responsible) => void;
  onCancel: () => void;
}

export const EditResponsibleDialog = ({ responsible, onSave, onCancel }: EditResponsibleDialogProps) => {
  const [name, setName] = useState(responsible.nome);
  const [credential, setCredential] = useState(responsible.registro || "");
  const [signature, setSignature] = useState<File | null>(responsible.assinatura || null);
  const { toast } = useToast();

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome do responsável.",
        variant: "destructive",
      });
      return;
    }

    onSave({ 
      nome: name, 
      registro: credential || undefined, 
      assinatura: signature || undefined 
    });
    
    toast({
      title: "Responsável atualizado",
      description: name,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (validTypes.includes(file.type)) {
        setSignature(file);
      } else {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Aceito apenas PNG ou JPG",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>✏️ Editar Responsável Técnico</DialogTitle>
          <DialogDescription>
            Altere os dados do responsável técnico.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-responsible-name">Nome do Responsável *</Label>
            <Input
              id="edit-responsible-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-responsible-credential">Registro/Credencial</Label>
            <Input
              id="edit-responsible-credential"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="Ex: CRQ 12345"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-responsible-signature">Assinatura</Label>
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
                onClick={() => document.getElementById("edit-signature-file-input")?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <input
                id="edit-signature-file-input"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Formato: PNG ou JPG (fundo transparente recomendado)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};