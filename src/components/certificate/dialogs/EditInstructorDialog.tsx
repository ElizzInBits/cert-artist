import { useState, useEffect } from "react";
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
import { Instructor } from "@/types/certificate";

interface EditInstructorDialogProps {
  instructor: Instructor;
  onSave: (instructor: Instructor) => void;
  onCancel: () => void;
}

export const EditInstructorDialog = ({ instructor, onSave, onCancel }: EditInstructorDialogProps) => {
  const [name, setName] = useState(instructor.nome);
  const [credential, setCredential] = useState(instructor.registro || "");
  const { toast } = useToast();

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome do instrutor.",
        variant: "destructive",
      });
      return;
    }

    onSave({ nome: name, registro: credential || undefined });
    
    toast({
      title: "Instrutor atualizado",
      description: name,
    });
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>✏️ Editar Instrutor</DialogTitle>
          <DialogDescription>
            Altere os dados do instrutor.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-instructor-name">Nome do Instrutor *</Label>
            <Input
              id="edit-instructor-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-instructor-credential">Registro/Credencial</Label>
            <Input
              id="edit-instructor-credential"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="Ex: CREA 12345"
            />
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