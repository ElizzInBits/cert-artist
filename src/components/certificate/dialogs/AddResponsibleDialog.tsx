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
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface AddResponsibleDialogProps {
  children: React.ReactNode;
  onAdd: (responsible: { name: string; credential?: string; signature?: File }) => void;
}

export const AddResponsibleDialog = ({ children, onAdd }: AddResponsibleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [credential, setCredential] = useState("");
  const [signature, setSignature] = useState<File | null>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    if (!name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome do responsável.",
        variant: "destructive",
      });
      return;
    }

    if (!signature) {
      toast({
        title: "Assinatura obrigatória",
        description: "Por favor, selecione uma imagem da assinatura.",
        variant: "destructive",
      });
      return;
    }

    onAdd({ name, credential: credential || undefined, signature });
    setName("");
    setCredential("");
    setSignature(null);
    setOpen(false);
    
    toast({
      title: "Responsável adicionado",
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>👨‍💼 Adicionar Responsável Técnico</DialogTitle>
          <DialogDescription>
            Preencha os dados do responsável técnico e faça upload da assinatura.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="responsible-name">Nome do Responsável *</Label>
            <Input
              id="responsible-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsible-credential">Registro/Credencial</Label>
            <Input
              id="responsible-credential"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="Ex: CRQ 12345"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsible-signature">Assinatura *</Label>
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
                onClick={() => document.getElementById("signature-file-input")?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <input
                id="signature-file-input"
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAdd}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
