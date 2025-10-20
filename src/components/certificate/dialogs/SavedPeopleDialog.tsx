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

  const handleSelectInstructor = async (instructor: SavedInstructor) => {
    if (onSelectInstructor) {
      await useInstructor(instructor.id);
      onSelectInstructor(getInstructorForCertificate(instructor));
      onOpenChange(false);
    }
  };

  const handleSelectResponsible = async (responsible: SavedResponsible) => {
    if (onSelectResponsible) {
      await useResponsible(responsible.id);
      onSelectResponsible(getResponsibleForCertificate(responsible));
      onOpenChange(false);
    }
  };

  const handleSaveInstructor = async () => {
    if (newInstructor.nome.trim()) {
      await addInstructor(newInstructor);
      setNewInstructor({ nome: '' });
    }
  };

  const handleSaveResponsible = async () => {
    if (newResponsible.nome.trim()) {
      await addResponsible(newResponsible);
      setNewResponsible({ nome: '' });
    }
  };

  const handleFileChange = (file: File | null, type: 'instructor' | 'responsible') => {
    if (type === 'instructor') {
      setNewInstructor(prev => ({ ...prev, assinatura: file || undefined }));
    } else {
      setNewResponsible(prev => ({ ...prev, assinatura: file || undefined }));
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]" aria-describedby="saved-people-dialog-description">
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
                <div className="grid grid-cols-2 gap-4">
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
                <Button onClick={handleSaveInstructor} disabled={!newInstructor.nome.trim()}>
                  Salvar Instrutor
                </Button>
              </CardContent>
            </Card>

            {/* Lista de instrutores */}
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {instructors.map((instructor) => (
                  <Card key={instructor.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{instructor.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{instructor.nome}</h4>
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
                      <div className="flex gap-2">
                        {onSelectInstructor && (
                          <Button
                            size="sm"
                            onClick={() => handleSelectInstructor(instructor)}
                          >
                            Usar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingInstructor(instructor)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeInstructor(instructor.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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
                <div className="grid grid-cols-2 gap-4">
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
                <Button onClick={handleSaveResponsible} disabled={!newResponsible.nome.trim()}>
                  Salvar Responsável
                </Button>
              </CardContent>
            </Card>

            {/* Lista de responsáveis */}
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {responsibles.map((responsible) => (
                  <Card key={responsible.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{responsible.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{responsible.nome}</h4>
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
                      <div className="flex gap-2">
                        {onSelectResponsible && (
                          <Button
                            size="sm"
                            onClick={() => handleSelectResponsible(responsible)}
                          >
                            Usar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingResponsible(responsible)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeResponsible(responsible.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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
  );
};