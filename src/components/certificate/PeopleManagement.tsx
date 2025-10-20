import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePeopleDatabase } from '@/hooks/usePeopleDatabase';
import { SavedPeopleDialog } from './dialogs/SavedPeopleDialog';
import { Database, Users, FileSignature, Plus } from 'lucide-react';

export const PeopleManagement = () => {
  const { instructors, responsibles, loading } = usePeopleDatabase();
  const [showDialog, setShowDialog] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Biblioteca de Pessoas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{instructors.length}</div>
              <div className="text-sm text-muted-foreground">Instrutores</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <FileSignature className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{responsibles.length}</div>
              <div className="text-sm text-muted-foreground">Responsáveis</div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Gerenciar Pessoas
            </Button>
          </div>

          {/* Resumo rápido */}
          <div className="space-y-2">
            <h4 className="font-medium">Últimos Adicionados:</h4>
            <div className="space-y-1">
              {[...instructors, ...responsibles]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 3)
                .map((person) => (
                  <div key={person.id} className="flex items-center justify-between text-sm">
                    <span>{person.nome}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {'mimeType' in person ? 'Responsável' : 'Instrutor'}
                      </Badge>
                      {person.assinatura && (
                        <Badge variant="secondary" className="text-xs">
                          Com assinatura
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <SavedPeopleDialog
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </div>
  );
};