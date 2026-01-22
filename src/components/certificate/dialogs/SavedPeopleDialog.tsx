import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePeopleDatabase } from '@/hooks/usePeopleDatabase';
import { SavedInstructor, SavedResponsible, InstructorData, ResponsibleData } from '@/lib/peopleService';
import { Instructor, Responsible } from '@/types/certificate';
import { EditInstructorDialog } from './EditInstructorDialog';
import { EditResponsibleDialog } from './EditResponsibleDialog';
import { Trash2, Edit, Plus, User, FileSignature, Clock } from 'lucide-react';

interface SavedPeopleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectInstructor?: (instructor: Instructor) => void;
  onSelectResponsible?: (responsible: Responsible) => void;
}

export const SavedPeopleDialog = ({ 
  open, 
  onOpenChange, 
  onSelectInstructor, 
  onSelectResponsible 
}: SavedPeopleDialogProps) => {
  const {
    instructors,
    responsibles,
    loading,
    addInstructor,
    editInstructor,
    removeInstructor,
    useInstructor,
    addResponsible,
    editResponsible,
    removeResponsible,
    useResponsible,
    getInstructorForCertificate,
    getResponsibleForCertificate
  } = usePeopleDatabase();

  const [activeTab, setActiveTab] = useState('instructors');
  const [editingInstructor, setEditingInstructor] = useState<SavedInstructor | null>(null);
  const [editingResponsible, setEditingResponsible] = useState<SavedResponsible | null>(null);
  const [newInstructor, setNewInstructor] = useState<InstructorData>({ nome: '' });
  const [newResponsible, setNewResponsible] = useState<ResponsibleData>({ nome: '' });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleSelectInstructor = async (instructor: SavedInstructor) => {
    if (onSelectInstructor && !actionLoading) {
      setActionLoading(`use-instructor-${instructor.id}`);
      try {
        await useInstructor(instructor.id);
        onSelectInstructor(getInstructorForCertificate(instructor));
        onOpenChange(false);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleSelectResponsible = async (responsible: SavedResponsible) => {
    if (onSelectResponsible && !actionLoading) {
      setActionLoading(`use-responsible-${responsible.id}`);
      try {
        await useResponsible(responsible.id);
        onSelectResponsible(getResponsibleForCertificate(responsible));
        onOpenChange(false);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleSaveInstructor = async () => {
    if (newInstructor.nome.trim() && !actionLoading) {
      setActionLoading('add-instructor');
      try {
        await addInstructor(newInstructor);
        setNewInstructor({ nome: '' });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleSaveResponsible = async () => {
    if (newResponsible.nome.trim() && !actionLoading) {
      setActionLoading('add-responsible');
      try {
        await addResponsible(newResponsible);
        setNewResponsible({ nome: '' });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleFileChange = (file: File | null, type: 'instructor' | 'responsible') => {
    if (type === 'instructor') {
      setNewInstructor(prev => ({ ...prev, assinatura: file || undefined }));
    } else {
      setNewResponsible(prev => ({ ...prev, assinatura: file || undefined }));
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return 'Data inválida';
      }
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] sm:max-h-[80vh] w-full" aria-describedby="saved-people-dialog-description">
          <DialogHeader>
            <DialogTitle>Biblioteca de Pessoas</DialogTitle>
            <DialogDescription id="saved-people-dialog-description">
              Gerencie instrutores e responsáveis salvos com suas assinaturas
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="instructors">
                <User className="w-4 h-4 mr-2" />
                Instrutores ({instructors.length})
              </TabsTrigger>
              <TabsTrigger value="responsibles">
                <FileSignature className="w-4 h-4 mr-2" />
                Responsáveis ({responsibles.length})
              </TabsTrigger>
            </TabsList>

          <TabsContent value="instructors" className="space-y-4">
            {/* Adicionar novo instrutor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Instrutor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instructor-name">Nome *</Label>
                    <Input
                      id="instructor-name"
                      value={newInstructor.nome}
                      onChange={(e) => setNewInstructor(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Nome do instrutor"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructor-registro">Registro</Label>
                    <Input
                      id="instructor-registro"
                      value={newInstructor.registro || ''}
                      onChange={(e) => setNewInstructor(prev => ({ ...prev, registro: e.target.value }))}
                      placeholder="Número do registro"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="instructor-signature">Assinatura</Label>
                  <Input
                    id="instructor-signature"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'instructor')}
                  />
                </div>
                <Button 
                  onClick={handleSaveInstructor} 
                  disabled={!newInstructor.nome.trim() || actionLoading === 'add-instructor'}
                >
                  {actionLoading === 'add-instructor' ? 'Salvando...' : 'Salvar Instrutor'}
                </Button>
              </CardContent>
            </Card>

            {/* Lista de instrutores */}
            <ScrollArea className="h-[300px] sm:h-[400px] w-full">
              <div className="space-y-2 pr-4">
                {instructors.map((instructor) => (
                  <Card key={instructor.id} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="shrink-0">
                          <AvatarFallback>{instructor.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium truncate">{instructor.nome}</h4>
                          {instructor.registro && (
                            <p className="text-sm text-muted-foreground">Registro: {instructor.registro}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {instructor.assinatura && (
                              <Badge variant="secondary">Com assinatura</Badge>
                            )}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatDate(instructor.lastUsed)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 min-w-0 shrink-0">
                        {onSelectInstructor && (
                          <Button
                            size="sm"
                            onClick={() => handleSelectInstructor(instructor)}
                            disabled={actionLoading === `use-instructor-${instructor.id}`}
                            className="w-full sm:w-auto"
                          >
                            {actionLoading === `use-instructor-${instructor.id}` ? 'Usando...' : 'Usar'}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingInstructor(instructor)}
                          disabled={!!actionLoading}
                          className="w-full sm:w-auto"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async () => {
                            if (!actionLoading) {
                              setActionLoading(`remove-instructor-${instructor.id}`);
                              try {
                                await removeInstructor(instructor.id);
                              } finally {
                                setActionLoading(null);
                              }
                            }
                          }}
                          disabled={actionLoading === `remove-instructor-${instructor.id}`}
                          className="w-full sm:w-auto"
                        >
                          {actionLoading === `remove-instructor-${instructor.id}` ? '...' : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {instructors.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum instrutor salvo
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="responsibles" className="space-y-4">
            {/* Adicionar novo responsável */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Responsável
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responsible-name">Nome *</Label>
                    <Input
                      id="responsible-name"
                      value={newResponsible.nome}
                      onChange={(e) => setNewResponsible(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Nome do responsável"
                    />
                  </div>
                  <div>
                    <Label htmlFor="responsible-registro">Registro</Label>
                    <Input
                      id="responsible-registro"
                      value={newResponsible.registro || ''}
                      onChange={(e) => setNewResponsible(prev => ({ ...prev, registro: e.target.value }))}
                      placeholder="Número do registro"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="responsible-signature">Assinatura</Label>
                  <Input
                    id="responsible-signature"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'responsible')}
                  />
                </div>
                <Button 
                  onClick={handleSaveResponsible} 
                  disabled={!newResponsible.nome.trim() || actionLoading === 'add-responsible'}
                >
                  {actionLoading === 'add-responsible' ? 'Salvando...' : 'Salvar Responsável'}
                </Button>
              </CardContent>
            </Card>

            {/* Lista de responsáveis */}
            <ScrollArea className="h-[300px] sm:h-[400px] w-full">
              <div className="space-y-2 pr-4">
                {responsibles.map((responsible) => (
                  <Card key={responsible.id} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="shrink-0">
                          <AvatarFallback>{responsible.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium truncate">{responsible.nome}</h4>
                          {responsible.registro && (
                            <p className="text-sm text-muted-foreground">Registro: {responsible.registro}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {responsible.assinatura && (
                              <Badge variant="secondary">Com assinatura</Badge>
                            )}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatDate(responsible.lastUsed)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 min-w-0 shrink-0">
                        {onSelectResponsible && (
                          <Button
                            size="sm"
                            onClick={() => handleSelectResponsible(responsible)}
                            disabled={actionLoading === `use-responsible-${responsible.id}`}
                            className="w-full sm:w-auto"
                          >
                            {actionLoading === `use-responsible-${responsible.id}` ? 'Usando...' : 'Usar'}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingResponsible(responsible)}
                          disabled={!!actionLoading}
                          className="w-full sm:w-auto"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async () => {
                            if (!actionLoading) {
                              setActionLoading(`remove-responsible-${responsible.id}`);
                              try {
                                await removeResponsible(responsible.id);
                              } finally {
                                setActionLoading(null);
                              }
                            }
                          }}
                          disabled={actionLoading === `remove-responsible-${responsible.id}`}
                          className="w-full sm:w-auto"
                        >
                          {actionLoading === `remove-responsible-${responsible.id}` ? '...' : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {responsibles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum responsável salvo
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Diálogos de edição - fora do diálogo principal */}
      {editingInstructor && (
        <EditInstructorDialog
          instructor={{
            nome: editingInstructor.nome,
            registro: editingInstructor.registro
          }}
          onSave={async (updatedInstructor) => {
            await editInstructor(editingInstructor.id, updatedInstructor);
            setEditingInstructor(null);
          }}
          onCancel={() => setEditingInstructor(null)}
        />
      )}

      {editingResponsible && (
        <EditResponsibleDialog
          responsible={{
            nome: editingResponsible.nome,
            registro: editingResponsible.registro,
            assinatura: editingResponsible.assinatura ? new File([], 'signature') : undefined
          }}
          onSave={async (updatedResponsible) => {
            await editResponsible(editingResponsible.id, {
              nome: updatedResponsible.nome,
              registro: updatedResponsible.registro,
              assinatura: updatedResponsible.assinatura
            });
            setEditingResponsible(null);
          }}
          onCancel={() => setEditingResponsible(null)}
        />
      )}
    </>
  );
};