import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Download, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCertificateStore } from "@/hooks/useCertificateStore";
import * as XLSX from 'xlsx';

interface Employee {
  nome: string;
  cpf: string;
}

export const SpreadsheetEditor = () => {
  const { toast } = useToast();
  const { setEmployees } = useCertificateStore();
  const [employees, setLocalEmployees] = useState<Employee[]>([
    { nome: "", cpf: "" }
  ]);
  const [open, setOpen] = useState(false);

  const addRow = () => {
    setLocalEmployees([...employees, { nome: "", cpf: "" }]);
  };

  const removeRow = (index: number) => {
    if (employees.length > 1) {
      setLocalEmployees(employees.filter((_, i) => i !== index));
    }
  };

  const updateEmployee = (index: number, field: keyof Employee, value: string) => {
    const updated = [...employees];
    updated[index][field] = value;
    setLocalEmployees(updated);
  };

  const saveToStore = () => {
    const validEmployees = employees.filter(emp => emp.nome.trim() !== "");
    setEmployees(validEmployees);
    setOpen(false);
    toast({
      title: "Funcionários salvos",
      description: `${validEmployees.length} funcionários adicionados ao sistema.`,
    });
  };

  const downloadExcel = () => {
    const validEmployees = employees.filter(emp => emp.nome.trim() !== "");
    if (validEmployees.length === 0) {
      toast({
        title: "Nenhum funcionário",
        description: "Adicione pelo menos um funcionário para baixar.",
        variant: "destructive"
      });
      return;
    }

    const ws = XLSX.utils.json_to_sheet(validEmployees.map(emp => ({
      Nome: emp.nome,
      CPF: emp.cpf
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Funcionários");
    XLSX.writeFile(wb, "lista_funcionarios.xlsx");
    
    toast({
      title: "Planilha baixada",
      description: "Arquivo Excel criado com sucesso!",
    });
  };

  const loadSampleData = () => {
    const sampleEmployees = [
      { nome: "João Silva", cpf: "123.456.789-00" },
      { nome: "Maria Santos", cpf: "987.654.321-00" },
      { nome: "Pedro Oliveira", cpf: "456.789.123-00" },
      { nome: "Ana Costa", cpf: "789.123.456-00" },
      { nome: "Carlos Ferreira", cpf: "321.654.987-00" }
    ];
    setLocalEmployees(sampleEmployees);
    toast({
      title: "Dados de exemplo carregados",
      description: "5 funcionários de exemplo foram adicionados.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="w-4 h-4" />
          📝 Criar Planilha
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="spreadsheet-dialog-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Editor de Funcionários
          </DialogTitle>
          <DialogDescription id="spreadsheet-dialog-description">
            Adicione, edite e gerencie a lista de funcionários para geração de certificados.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={addRow} size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
            <Button onClick={loadSampleData} size="sm" variant="outline" className="gap-1">
              👥 Exemplo
            </Button>
            <Button onClick={downloadExcel} size="sm" variant="outline" className="gap-1">
              <Download className="w-4 h-4" />
              Baixar Excel
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-0 bg-muted p-2 font-semibold text-sm">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Nome</div>
              <div className="col-span-4">CPF</div>
              <div className="col-span-2">Ações</div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {employees.map((employee, index) => (
                <div key={index} className="grid grid-cols-12 gap-0 p-2 border-b hover:bg-muted/50">
                  <div className="col-span-1 flex items-center text-sm text-muted-foreground">
                    {index + 1}
                  </div>
                  <div className="col-span-5 pr-2">
                    <Input
                      value={employee.nome}
                      onChange={(e) => updateEmployee(index, 'nome', e.target.value)}
                      placeholder="Nome completo"
                      className="h-8"
                    />
                  </div>
                  <div className="col-span-4 pr-2">
                    <Input
                      value={employee.cpf}
                      onChange={(e) => updateEmployee(index, 'cpf', e.target.value)}
                      placeholder="000.000.000-00"
                      className="h-8"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      onClick={() => removeRow(index)}
                      size="sm"
                      variant="ghost"
                      disabled={employees.length === 1}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Total: {employees.filter(emp => emp.nome.trim() !== "").length} funcionários válidos
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveToStore}>
                Salvar Funcionários
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};