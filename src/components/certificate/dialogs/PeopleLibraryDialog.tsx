import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePeopleLibrary } from "@/hooks/usePeopleLibrary";
import { Search, Clock, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavedPerson {
  id: string;
  type: 'instructor' | 'responsible';
  nome: string;
  registro?: string;
  assinatura?: File;
  createdAt: Date;
  lastUsed: Date;
}

interface PeopleLibraryDialogProps {
  children: React.ReactNode;
  type: 'instructor' | 'responsible';
  onSelect: (person: SavedPerson) => void;
}

export const PeopleLibraryDialog = ({ children, type, onSelect }: PeopleLibraryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { savedPeople, removePerson, markAsUsed } = usePeopleLibrary();
  const { toast } = useToast();

  const filteredPeople = savedPeople
    .filter(person => person.type === type)
    .filter(person => 
      person.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.registro && person.registro.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());

  const handleSelect = (person: SavedPerson) => {
    markAsUsed(person.id);
    onSelect(person);
    setOpen(false);
    toast({
      title: `${type === 'instructor' ? 'Instrutor' : 'Responsável'} adicionado`,
      description: person.nome
    });
  };

  const handleRemove = (personId: string, personName: string) => {
    removePerson(personId);
    toast({
      title: "Pessoa removida da biblioteca",
      description: personName
    });
  };

  const getTypeLabel = () => type === 'instructor' ? 'Instrutores' : 'Responsáveis';
  const getTypeIcon = () => type === 'instructor' ? '👨🏫' : '👨💼';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon()} Biblioteca de {getTypeLabel()}
          </DialogTitle>
          <DialogDescription>
            Selecione uma pessoa salva ou gerencie sua biblioteca.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Buscar ${type === 'instructor' ? 'instrutores' : 'responsáveis'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Lista de pessoas */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredPeople.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma pessoa encontrada</p>
                <p className="text-sm">
                  {searchTerm ? 'Tente outro termo de busca' : `Adicione ${type === 'instructor' ? 'instrutores' : 'responsáveis'} para salvá-los aqui`}
                </p>
              </div>
            ) : (
              filteredPeople.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{person.nome}</h4>
                      <div className="flex gap-1">
                        {person.registro && (
                          <Badge variant="secondary" className="text-xs">
                            {person.registro}
                          </Badge>
                        )}
                        {person.assinatura && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            ✓ Assinatura
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Usado: {person.lastUsed.toLocaleDateString()}
                      </span>
                      <span>
                        Criado: {person.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSelect(person)}
                    >
                      Selecionar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemove(person.id, person.nome)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Estatísticas */}
          {filteredPeople.length > 0 && (
            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              {filteredPeople.length} {type === 'instructor' ? 'instrutor(es)' : 'responsável(is)'} na biblioteca
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};