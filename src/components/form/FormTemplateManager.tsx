import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFormStore } from "@/hooks/useFormStore";
import { FormTemplate } from "@/types/form";
import { Layout, Plus } from "lucide-react";

// Templates padrão temporários - você pode personalizar depois
const defaultTemplates: FormTemplate[] = [
  {
    id: 'avaliacao-atividades-criticas',
    nome: 'Avaliação de Atividades Críticas',
    descricao: 'Formulário de avaliação médica para atividades críticas',
    tipo: 'padrao',
    campos: [
      { id: 'nome', label: 'Nome', type: 'text', required: true, group: 'identificacao' },
      { id: 'pn', label: 'PN', type: 'text', required: false, group: 'identificacao' },
      { id: 'cargo', label: 'Cargo', type: 'text', required: true, group: 'identificacao' },
      { id: 'setor', label: 'Setor', type: 'text', required: false, group: 'identificacao' },
      
      // Avaliação Médica
      { id: 'fatores_psicossociais', label: 'Fatores Psicossociais', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'coordenacao_motora', label: 'Coordenação Motora', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'doencas_coluna', label: 'Doenças da Coluna e MMII', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'sinal_romberg', label: 'Sinal de Romberg Positivo', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'epilepsia', label: 'Epilepsia, Convulsão, Doença Neurológica', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'patologias_cronicas', label: 'Patologias Crônicas descompensadas', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'uso_medicamentos', label: 'Uso Medicamentoso que interferem no Sistema Nervoso', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'uso_continuo_alcool', label: 'Uso Contínuo ou Abusivo de Álcool', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'obesidade', label: 'Obesidade', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'doenca_pulmonar', label: 'Doença Pulmonar', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'anemia', label: 'Anemia', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'endocrinopatias', label: 'Endocrinopatias Crônicas Descompensadas', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'doenca_nefropatica', label: 'Doença Nefropática', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'pelos_deformidade', label: 'Pelos, Deformidade Facial', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      { id: 'doencas_tireoide', label: 'Doenças da Tireoide', type: 'radio', required: true, options: ['SIM', 'NÃO'], group: 'avaliacao' },
      
      { id: 'observacao', label: 'Observação', type: 'textarea', required: false, group: 'observacao' },
      
      // Dados Físicos
      { id: 'peso', label: 'PESO', type: 'number', required: false, group: 'dados_fisicos' },
      { id: 'altura', label: 'ALTURA', type: 'number', required: false, group: 'dados_fisicos' },
      { id: 'imc', label: 'IMC', type: 'number', required: false, group: 'dados_fisicos' },
      { id: 'pa', label: 'PA', type: 'text', required: false, group: 'dados_fisicos' },
      { id: 'fc', label: 'FC', type: 'text', required: false, group: 'dados_fisicos' },
      { id: 'fr', label: 'FR', type: 'text', required: false, group: 'dados_fisicos' },
      
      // Atividades Críticas
      { id: 'trabalho_altura', label: 'Trabalho em altura', type: 'radio', required: false, options: ['Liberado', 'Não Liberado', 'N/A'], group: 'atividades' },
      { id: 'equipamento_guindar', label: 'Equipamento de Guindar', type: 'radio', required: false, options: ['Liberado', 'Não Liberado', 'N/A'], group: 'atividades' },
      { id: 'espaco_confinado', label: 'Espaço confinado', type: 'radio', required: false, options: ['Liberado', 'Não Liberado', 'N/A'], group: 'atividades' },
      { id: 'equipamento_moveis', label: 'Equipamento móveis', type: 'radio', required: false, options: ['Liberado', 'Não Liberado', 'N/A'], group: 'atividades' },
      { id: 'operacao_veiculo', label: 'Operação de veículo', type: 'radio', required: false, options: ['Liberado', 'Não Liberado', 'N/A'], group: 'atividades' },
      { id: 'exposicao_calor', label: 'Exposição a calor', type: 'radio', required: false, options: ['Liberado', 'Não Liberado', 'N/A'], group: 'atividades' },
      { id: 'espaco_confinado2', label: 'Espaço confinado', type: 'radio', required: false, options: ['Liberado', 'Não Liberado', 'N/A'], group: 'atividades' },
      { id: 'plataforma_elevatoria', label: 'Plataforma Elevatória', type: 'radio', required: false, options: ['Liberado', 'Não Liberado', 'N/A'], group: 'atividades' },
      { id: 'protecao_respiratoria', label: 'Proteção Respiratória', type: 'radio', required: false, options: ['Liberado', 'Não Liberado', 'N/A'], group: 'atividades' },
      { id: 'outros', label: 'Outros', type: 'radio', required: false, options: ['Liberado', 'Não Liberado', 'N/A'], group: 'atividades' },
    ],
    configuracao: {
      fontConfig: { titulo: 16, campos: 10, labels: 11, conteudo: 10 },
      layoutConfig: { margens: { top: 40, bottom: 40, left: 40, right: 40 }, espacamento: 8 }
    }
  },
  {
    id: 'avaliacao-padrao',
    nome: 'Avaliação Padrão',
    descricao: 'Formulário básico de avaliação',
    tipo: 'padrao',
    campos: [
      { id: 'nome', label: 'Nome Completo', type: 'text', required: true },
      { id: 'email', label: 'E-mail', type: 'text', required: true },
      { id: 'avaliacao', label: 'Avaliação', type: 'select', required: true, options: ['Excelente', 'Bom', 'Regular', 'Ruim'] }
    ],
    configuracao: {
      fontConfig: { titulo: 18, campos: 12, labels: 14, conteudo: 12 },
      layoutConfig: { margens: { top: 50, bottom: 50, left: 50, right: 50 }, espacamento: 15 }
    }
  },
  {
    id: 'documento-padrao',
    nome: 'Documento Padrão',
    descricao: 'Formulário básico com campos de texto',
    tipo: 'padrao',
    campos: [
      { id: 'nome', label: 'Nome', type: 'text', required: true },
      { id: 'observacoes', label: 'Observações', type: 'textarea', required: false }
    ],
    configuracao: {
      fontConfig: { titulo: 18, campos: 12, labels: 14, conteudo: 12 },
      layoutConfig: { margens: { top: 50, bottom: 50, left: 50, right: 50 }, espacamento: 15 }
    }
  }
];

export const FormTemplateManager = () => {
  const { selectedTemplate, setSelectedTemplate } = useFormStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="w-5 h-5" />
          Templates de Formulário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {defaultTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTemplate?.id === template.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{template.nome}</h3>
                <Badge variant={template.tipo === 'padrao' ? 'default' : 'secondary'}>
                  {template.tipo}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{template.descricao}</p>
              <p className="text-xs text-muted-foreground">
                {template.campos.length} campos
              </p>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Criar Template Personalizado
        </Button>
      </CardContent>
    </Card>
  );
};