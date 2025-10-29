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
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg" data-orientation="vertical" aria-describedby="edit-instructor-dialog-description">
        <DialogHeader>
          <DialogTitle>✏️ Editar Instrutor</DialogTitle>
          <DialogDescription id="edit-instructor-dialog-description">
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
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};