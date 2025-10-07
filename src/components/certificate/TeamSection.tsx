import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Trash2 } from "lucide-react";
import { AddInstructorDialog } from "./dialogs/AddInstructorDialog";
import { AddResponsibleDialog } from "./dialogs/AddResponsibleDialog";

export const TeamSection = () => {
  const [instructors, setInstructors] = useState<Array<{ name: string; credential?: string }>>([]);
  const [responsibles, setResponsibles] = useState<Array<{ name: string; credential?: string; signature?: File }>>([]);

  const removeInstructor = (index: number) => {
    setInstructors(instructors.filter((_, i) => i !== index));
  };

  const removeResponsible = (index: number) => {
    setResponsibles(responsibles.filter((_, i) => i !== index));
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
            <h3 className="text-sm font-semibold">👨‍🏫 Instrutores</h3>
            <AddInstructorDialog onAdd={(instructor) => setInstructors([...instructors, instructor])}>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </AddInstructorDialog>
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
                    <p className="text-sm font-medium">{instructor.name}</p>
                    {instructor.credential && (
                      <p className="text-xs text-muted-foreground">{instructor.credential}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeInstructor(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Responsáveis Técnicos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">👨‍💼 Responsáveis Técnicos</h3>
            <AddResponsibleDialog onAdd={(responsible) => setResponsibles([...responsibles, responsible])}>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </AddResponsibleDialog>
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
                    <p className="text-sm font-medium">{responsible.name}</p>
                    {responsible.credential && (
                      <p className="text-xs text-muted-foreground">{responsible.credential}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeResponsible(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
