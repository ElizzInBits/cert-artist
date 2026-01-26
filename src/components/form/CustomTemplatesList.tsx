import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormTemplate } from "@/types/form";
import { FileText, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CustomTemplatesListProps {
  onSelectTemplate: (template: FormTemplate) => void;
  selectedTemplateId?: string;
}

export const CustomTemplatesList = ({ onSelectTemplate, selectedTemplateId }: CustomTemplatesListProps) => {
  const [customTemplates, setCustomTemplates] = useState<FormTemplate[]>([]);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadCustomTemplates();
  }, []);

  const loadCustomTemplates = () => {
    const saved = localStorage.getItem('customTemplates');
    if (saved) {
      setCustomTemplates(JSON.parse(saved));
    }
  };

  const handleDelete = (templateId: string) => {
    const updated = customTemplates.filter(t => t.id !== templateId);
    localStorage.setItem('customTemplates', JSON.stringify(updated));
    setCustomTemplates(updated);
    setTemplateToDelete(null);
  };

  if (customTemplates.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4" />
            Templates Personalizados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {customTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                selectedTemplateId === template.id ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1" onClick={() => onSelectTemplate(template)}>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{template.nome}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {template.tipo}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{template.descricao}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTemplateToDelete(template.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <AlertDialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir template?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O template será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => templateToDelete && handleDelete(templateToDelete)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
