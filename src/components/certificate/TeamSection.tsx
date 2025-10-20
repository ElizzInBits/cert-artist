import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trash2, Edit, Database } from "lucide-react";
import { EditInstructorDialog } from "./dialogs/EditInstructorDialog";
import { EditResponsibleDialog } from "./dialogs/EditResponsibleDialog";
import { SavedPeopleDialog } from "./dialogs/SavedPeopleDialog";
import { useCertificateStore } from "@/hooks/useCertificateStore";
import { useState } from "react";
import { Instructor, Responsible } from "@/types/certificate";

export const TeamSection = () => {
  const { 
    instructors, 
    responsibles, 
    addInstructor, 
    removeInstructor, 
    addResponsible, 
    removeResponsible 
  } = useCertificateStore();
  

  const [editingInstructor, setEditingInstructor] = useState<{ index: number; data: Instructor } | null>(null);
  const [editingResponsible, setEditingResponsible] = useState<{ index: number; data: Responsible } | null>(null);
  const [showSavedPeopleDialog, setShowSavedPeopleDialog] = useState(false);

  const handleAddInstructor = (instructor: Instructor) => {
    addInstructor(instructor);
  };

  const handleAddResponsible = (responsible: Responsible) => {
    addResponsible(responsible);
  };

  const handleEditInstructor = (index: number, instructor: Instructor) => {
    // Atualizar no store (substituir o instrutor no índice)
    const newInstructors = [...instructors];
    newInstructors[index] = instructor;
    // Como não temos updateInstructor no store, vamos remover e adicionar
    removeInstructor(index);
    setTimeout(() => {
      // Inserir na posição correta
      const currentInstructors = useCertificateStore.getState().instructors;
      const updatedInstructors = [
        ...currentInstructors.slice(0, index),
        instructor,
        ...currentInstructors.slice(index)
      ];
      // Limpar e recriar a lista
      while (useCertificateStore.getState().instructors.length > 0) {
        removeInstructor(0);
      }
      updatedInstructors.forEach(inst => addInstructor(inst));
    }, 0);
    setEditingInstructor(null);
  };

  const handleEditResponsible = (index: number, responsible: Responsible) => {
    // Similar ao instrutor
    removeResponsible(index);
    setTimeout(() => {
      const currentResponsibles = useCertificateStore.getState().responsibles;
      const updatedResponsibles = [
        ...currentResponsibles.slice(0, index),
        responsible,
        ...currentResponsibles.slice(index)
      ];
      while (useCertificateStore.getState().responsibles.length > 0) {
        removeResponsible(0);
      }
      updatedResponsibles.forEach(resp => addResponsible(resp));
    }, 0);
    setEditingResponsible(null);
  };



  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Equipe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instrutores */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">👨🏫 Instrutores</h3>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowSavedPeopleDialog(true)}
              >
                <Database className="w-4 h-4 mr-1" />
                Biblioteca
              </Button>
            </div>
          </div>
          <div className="border rounded-lg min-h-[120px] max-h-[120px] overflow-y-auto p-2 space-y-1">
            {instructors.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum instrutor adicionado
              </p>
            ) : (
              instructors.map((instructor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{instructor.nome}</p>
                    {instructor.registro && (
                      <p className="text-xs text-muted-foreground">{instructor.registro}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingInstructor({ index, data: instructor })}
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeInstructor(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Responsáveis Técnicos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">👨💼 Responsáveis Técnicos</h3>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowSavedPeopleDialog(true)}
              >
                <Database className="w-4 h-4 mr-1" />
                Biblioteca
              </Button>
            </div>
          </div>
          <div className="border rounded-lg min-h-[120px] max-h-[120px] overflow-y-auto p-2 space-y-1">
            {responsibles.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum responsável adicionado
              </p>
            ) : (
              responsibles.map((responsible, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{responsible.nome}</p>
                    {responsible.registro && (
                      <p className="text-xs text-muted-foreground">{responsible.registro}</p>
                    )}
                    {responsible.assinatura && (
                      <p className="text-xs text-green-600">✓ Com assinatura</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingResponsible({ index, data: responsible })}
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeResponsible(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Diálogos de Edição */}
        {editingInstructor && (
          <EditInstructorDialog
            instructor={editingInstructor.data}
            onSave={(instructor) => handleEditInstructor(editingInstructor.index, instructor)}
            onCancel={() => setEditingInstructor(null)}
          />
        )}

        {editingResponsible && (
          <EditResponsibleDialog
            responsible={editingResponsible.data}
            onSave={(responsible) => handleEditResponsible(editingResponsible.index, responsible)}
            onCancel={() => setEditingResponsible(null)}
          />
        )}

        {/* Diálogo de Pessoas Salvas no Banco */}
        <SavedPeopleDialog
          open={showSavedPeopleDialog}
          onOpenChange={setShowSavedPeopleDialog}
          onSelectInstructor={(instructor) => handleAddInstructor(instructor)}
          onSelectResponsible={(responsible) => handleAddResponsible(responsible)}
        />
      </CardContent>
    </Card>
  );
};