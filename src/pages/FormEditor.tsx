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
<div style="width:800px;margin:0 auto;background:#fff;font-family:Arial,Helvetica,sans-serif;font-size:8px;color:#000;">

  <!-- CABEÇALHO -->
  <table style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="text-align:center;font-weight:bold;font-size:11px;">
        MEDICINA DO TRABALHO
      </td>
      <td style="text-align:right;font-weight:bold;font-size:12px;color:#1f6fb2;">
        vallourec
      </td>
    </tr>
  </table>

  <hr style="border:0;border-top:1px solid #000;margin:4px 0;" />

  <!-- TÍTULO -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;">
    <tr>
      <td style="text-align:center;font-weight:bold;padding:3px;">
        AVALIAÇÃO DE ATIVIDADES CRÍTICAS
      </td>
    </tr>
    <tr>
      <td style="font-size:7px;padding:3px;">
        Sistemática de conduta médica assistencial condicionada ao PCMSO e estabelecerá exames complementares indicados conforme a necessidade, pelo Médico coordenador ou examinador.
      </td>
    </tr>
  </table>

  <!-- DADOS -->
  <table style="width:100%;border-collapse:collapse;margin-top:4px;">
    <tr>
      <td style="border:1px solid #000;padding:3px;">Nome:</td>
      <td style="border:1px solid #000;padding:3px;">PN/Ponto:</td>
      <td style="border:1px solid #000;padding:3px;">Setor/Empresa:</td>
    </tr>
    <tr>
      <td colspan="3" style="border:1px solid #000;padding:3px;">Cargo:</td>
    </tr>
  </table>

  <!-- AVALIAÇÃO MÉDICA -->
  <table style="width:100%;border-collapse:collapse;margin-top:4px;">
    <tr>
      <td rowspan="14"
        style="border:1px solid #000;
               text-align:center;
               writing-mode:vertical-rl;
               transform:rotate(180deg);
               font-weight:bold;
               font-size:7px;
               width:20px;">
        ENTREVISTA<br/>MÉDICA
      </td>
      <td style="border:1px solid #000;padding:2px;width:620px;">
        Fatores Psicossociais estressores: Acrofobia, Claustrofobia, Agorafobia, Ansiedade, Fobias, Transtorno Psiquiátrico
      </td>
      <td style="border:1px solid #000;width:60px;text-align:center;">SIM ( )</td>
      <td style="border:1px solid #000;width:60px;text-align:center;">NÃO ( )</td>
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
        <td style="border:1px solid #000;padding:2px;">${item}</td>
        <td style="border:1px solid #000;text-align:center;">SIM ( )</td>
        <td style="border:1px solid #000;text-align:center;">NÃO ( )</td>
      </tr>
    `).join('')}
  </table>

  <!-- OBSERVAÇÃO -->
  <table style="width:100%;border-collapse:collapse;margin-top:4px;">
    <tr>
      <td style="border:1px solid #000;height:40px;padding:3px;">
        Observação:
      </td>
    </tr>
  </table>

  <!-- DADOS VITAIS -->
  <table style="width:100%;border-collapse:collapse;margin-top:4px;">
    <tr>
      <td style="border:1px solid #000;padding:3px;">PESO:</td>
      <td style="border:1px solid #000;padding:3px;">ALTURA:</td>
      <td style="border:1px solid #000;padding:3px;">IMC:</td>
      <td style="border:1px solid #000;padding:3px;">PA:</td>
      <td style="border:1px solid #000;padding:3px;">FC:</td>
      <td style="border:1px solid #000;padding:3px;">FR:</td>
    </tr>
  </table>

  <!-- ATIVIDADES CRÍTICAS -->
  <table style="width:100%;border-collapse:collapse;margin-top:4px;">
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
        <td style="border:1px solid #000;padding:2px;width:520px;">☐ ${item}</td>
        <td style="border:1px solid #000;width:90px;text-align:center;">☐ Liberado</td>
        <td style="border:1px solid #000;width:110px;text-align:center;">☐ Não Liberado</td>
        <td style="border:1px solid #000;width:60px;text-align:center;">☐ N/A</td>
      </tr>
    `).join('')}
  </table>

  <!-- ASSINATURA -->
  <div style="margin-top:10px;font-size:8px;">
    Assinatura do Médico Examinador: ____________________________________ 
    &nbsp;&nbsp;Data: ____/____/____
    <div style="display:flex;justify-content:space-between;margin-top:6px;">
      <span>MOD AMS MT 001/00</span>
      <span>Página 1 de 1</span>
    </div>
  </div>

</div>
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
<html>
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
      a.download = \`formulario-\${id}.html\`;
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
