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

import { Instructor } from "@/types/certificate";

interface AddInstructorDialogProps {
  children: React.ReactNode;
  onAdd: (instructor: Instructor) => void;
}

export const AddInstructorDialog = ({ children, onAdd }: AddInstructorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [credential, setCredential] = useState("");
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

    onAdd({ nome: name, registro: credential || undefined });
    setName("");
    setCredential("");
    setOpen(false);
    
    toast({
      title: "Instrutor adicionado",
      description: name,
    });
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
