import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save, Download, ArrowLeft } from 'lucide-react';

export default function FormEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formContent, setFormContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(`form-${id}`);
    if (saved) {
      setFormContent(saved);
    } else {
      setFormContent(getInitialTemplate());
    }
  }, [id]);

  const getInitialTemplate = () => {
    return `
<style>
  body { font-family: Arial, Helvetica, sans-serif; font-size: 7px; }
  table { border-collapse: collapse; width: 100%; margin-top: 4px; }
  td { border: 1px solid #000; padding: 2px 3px; vertical-align: middle; }
  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: bold; }
  .small { font-size: 6px; }
  .vertical { writing-mode: vertical-rl; transform: rotate(180deg); text-align: center; font-weight: bold; width: 22px; }
  .checkbox { width: 60px; text-align: center; }
  .obs { height: 60px; }
  .header { font-size: 11px; }
  .brand { font-size: 12px; color: #1f6fb2; }
</style>

<!-- CABEÇALHO -->
<table>
  <tr>
    <td class="center bold header">MEDICINA DO TRABALHO</td>
    <td class="right bold brand">vallourec</td>
  </tr>
</table>

<table>
  <tr>
    <td class="center bold">AVALIAÇÃO DE ATIVIDADES CRÍTICAS</td>
  </tr>
  <tr>
    <td class="small">
      Sistemática de conduta médica assistencial condicionada ao PCMSO e estabelecerá exames complementares indicados conforme a necessidade, pelo Médico coordenador ou examinador.
    </td>
  </tr>
</table>

<!-- DADOS -->
<table>
  <tr>
    <td>Nome:</td>
    <td>PN/Ponto:</td>
    <td>Setor/Empresa:</td>
  </tr>
  <tr>
    <td colspan="3">Cargo:</td>
  </tr>
</table>

<!-- ENTREVISTA MÉDICA -->
<table>
  <tr>
    <td rowspan="14" class="vertical">ENTREVISTA<br/>MÉDICA</td>
    <td>Fatores Psicossociais estressores: Acrofobia, Claustrofobia, Agorafobia, Ansiedade, Fobias, Transtorno Psiquiátrico</td>
    <td class="checkbox">SIM ( )</td>
    <td class="checkbox">NÃO ( )</td>
  </tr>
  ${[
    'Coordenação Motora: Restrição de Movimentos, equilíbrio, Desorientação tempo – espaço, tremores de Extremidades',
    'Doenças da Coluna e MMII (Deambulação)',
    'Sinal de Romberg Positivo: Desmaio, Tontura, Vertigem ou Zumbido',
    'Epilepsia, Convulsões, Doença Neurológica',
    'Patologias Cardiovasculares: Doenças cardiovasculares, Hipertensão',
    'Uso Medicamentos que interferem no Sistema Nervoso, Ritmo e Frequência Cardíaca',
    'Uso Contínuo ou Abusivo de Bebida Alcoólica, Drogas, Tabagista (Dependência Química)',
    'Obesidade',
    'Doença Pulmonar "Asma Brônquica e DPOC"',
    'Anemia',
    'Patologias Crônicas Descompensadas: Diabetes tipo I ou II; Diabético Insulinodependente',
    'Doença Nefropática',
    'Pelos, Deformidade Facial',
    'Doenças da Tireóide'
  ].map(item => `
  <tr>
    <td>${item}</td>
    <td class="checkbox">SIM ( )</td>
    <td class="checkbox">NÃO ( )</td>
  </tr>`).join('')}
</table>

<!-- OBSERVAÇÃO -->
<table>
  <tr>
    <td class="bold">Observação:</td>
  </tr>
  <tr>
    <td class="obs"></td>
  </tr>
</table>

<!-- SINAIS VITAIS -->
<table>
  <tr>
    <td>PESO:</td>
    <td>ALTURA:</td>
    <td>IMC:</td>
    <td>PA:</td>
    <td>FC:</td>
    <td>FR:</td>
  </tr>
</table>

<!-- ATIVIDADES CRÍTICAS -->
<table>
  ${[
    'Trabalho em altura (Acima de 2 metros)',
    'Equipamentos de Guindar (Ponte Rolante / Talha)',
    'Equipamentos móveis (Caminhão / Munck / Empilhadeira)',
    'Eletricidade (baixa e alta tensão)',
    'Explosão e calor',
    'Plataforma Elevatória',
    'Proteção Respiratória',
    'Radiação ionizante'
  ].map(item => `
  <tr>
    <td>☐ ${item}</td>
    <td class="checkbox">☐ Liberado</td>
    <td class="checkbox">☐ Não Liberado</td>
    <td class="checkbox">☐ N/A</td>
  </tr>`).join('')}
</table>

<!-- ASSINATURA -->
<table>
  <tr>
    <td>Assinatura do Médico Examinador: _____________________________</td>
    <td>Data: ___ / ___ / _____</td>
  </tr>
</table>

<p class="small right">Página 1 de 1</p>
`;
  };

  const handleSave = () => {
    const editor = document.getElementById('form-editor');
    if (editor) {
      localStorage.setItem(`form-${id}`, editor.innerHTML);
      alert('Formulário salvo com sucesso!');
    }
  };

  const handleDownload = () => {
    const editor = document.getElementById('form-editor');
    if (editor) {
      const blob = new Blob([`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Avaliação de Atividades Críticas</title>
</head>
<body>
${editor.innerHTML}
</body>
</html>
      `], { type: 'text/html' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `formulario-${id}.html`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> Salvar
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" /> Baixar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div
            id="form-editor"
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: formContent }}
            style={{ minHeight: '900px' }}
          />
        </div>
      </div>
    </div>
  );
}
