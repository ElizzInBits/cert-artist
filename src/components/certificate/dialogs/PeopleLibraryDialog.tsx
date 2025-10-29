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
import { Search, Clock, Trash2, User, Users } from "lucide-react";
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
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] flex flex-col p-0" data-orientation="vertical" aria-describedby="library-dialog-description">
        <DialogHeader className="flex-shrink-0 p-6 pb-0">
          <DialogTitle className="text-xl font-bold mb-2">Biblioteca de Pessoas</DialogTitle>
          <DialogDescription id="library-dialog-description" className="text-muted-foreground">
            Gerencie instrutores e responsáveis salvos com suas assinaturas
          </DialogDescription>
        </DialogHeader>
        
        {/* Tabs */}
        <div className="flex-shrink-0 px-6">
          <div className="flex border-b">
            <button 
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                type === 'instructor' 
                  ? 'border-blue-500 text-blue-600 bg-blue-50' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="w-4 h-4" />
              Instrutores ({savedPeople.filter(p => p.type === 'instructor').length})
            </button>
            <button 
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                type === 'responsible' 
                  ? 'border-green-500 text-green-600 bg-green-50' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" />
              Responsáveis ({savedPeople.filter(p => p.type === 'responsible').length})
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-6 pb-6 min-h-0">
          {/* Busca */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Buscar ${type === 'instructor' ? 'instrutores' : 'responsáveis'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Lista de pessoas */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {filteredPeople.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">Nenhuma pessoa encontrada</p>
                  <p className="text-sm">
                    {searchTerm ? 'Tente outro termo de busca' : `Adicione ${type === 'instructor' ? 'instrutores' : 'responsáveis'} para salvá-los aqui`}
                  </p>
                </div>
              </div>
            ) : (
              filteredPeople.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{person.nome}</h4>
                      <div className="flex gap-1 flex-shrink-0">
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
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {person.lastUsed.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0 ml-4">
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
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          </div>
          
          {/* Footer com estatísticas */}
          {filteredPeople.length > 0 && (
            <div className="flex-shrink-0 pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground">
                {filteredPeople.length} {type === 'instructor' ? 'instrutor(es)' : 'responsável(is)'} encontrado(s)
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};