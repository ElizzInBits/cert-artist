import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save, Download, ArrowLeft, Printer } from 'lucide-react';

interface FormData {
  nome: string;
  pn: string;
  setor: string;
  cargo: string;
  respostas: Record<string, string>;
  observacao: string;
  peso: string;
  altura: string;
  imc: string;
  pa: string;
  fc: string;
  fr: string;
  data: string;
}

const perguntas = [
  'Fatores Psicossociais estressores: Acrofobia, Claustrofobia, Agorafobia, Ansiedade, Fobias, Transtorno Psiquiátrico',
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
];

const atividades = [
  'Trabalho em altura (Acima de 2 metros)',
  'Equipamentos de Guindar (Ponte Rolante / Talha)',
  'Equipamentos móveis (Caminhão / Munck / Empilhadeira)',
  'Eletricidade (baixa e alta tensão)',
  'Explosão e calor',
  'Plataforma Elevatória',
  'Proteção Respiratória',
  'Radiação ionizante'
];

export default function FormEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    pn: '',
    setor: '',
    cargo: '',
    respostas: {},
    observacao: '',
    peso: '',
    altura: '',
    imc: '',
    pa: '',
    fc: '',
    fr: '',
    data: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem(`form-${id}`);
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, [id]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateResposta = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      respostas: { ...prev.respostas, [index]: value }
    }));
  };

  const handleSave = () => {
    localStorage.setItem(`form-${id}`, JSON.stringify(formData));
    alert('Formulário salvo com sucesso!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const html = document.getElementById('form-content')?.innerHTML;
    const blob = new Blob([`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Avaliação de Atividades Críticas</title>
<style>
  @page { size: A4; margin: 10mm; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 7px; }
  table { border-collapse: collapse; width: 100%; margin-top: 4px; }
  td { border: 1px solid #000; padding: 2px 3px; vertical-align: middle; }
  input, textarea { border: none; outline: none; width: 100%; font-size: 7px; font-family: inherit; }
  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: bold; }
  .small { font-size: 6px; }
  .vertical { writing-mode: vertical-rl; transform: rotate(180deg); text-align: center; font-weight: bold; width: 22px; }
  .checkbox { width: 60px; text-align: center; }
  .brand { font-size: 12px; color: #1f6fb2; }
</style>
</head>
<body>
${html}
</body>
</html>
    `], { type: 'text/html' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formulario-${id}.html`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <style>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            width: 210mm;
            min-height: 297mm;
            padding: 10mm;
            margin: 0;
            background: white;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
        @media screen {
          .print-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 10mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
        }
        .form-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 7px;
          font-family: Arial, Helvetica, sans-serif;
          width: 100%;
        }
        .form-textarea {
          border: none;
          outline: none;
          background: transparent;
          font-size: 7px;
          font-family: Arial, Helvetica, sans-serif;
          width: 100%;
          resize: none;
        }
      `}</style>

      <div className="bg-white border-b shadow-sm sticky top-0 z-10 no-print">
        <div className="container mx-auto px-6 py-4 flex justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> Salvar
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" /> Imprimir
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" /> Baixar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="print-container" id="form-content" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '7px' }}>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', border: '1px solid #000', padding: '2px 3px' }}>MEDICINA DO TRABALHO</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '12px', color: '#1f6fb2', border: '1px solid #000', padding: '2px 3px' }}>vallourec</td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid #000', padding: '2px 3px' }}>AVALIAÇÃO DE ATIVIDADES CRÍTICAS</td>
              </tr>
              <tr>
                <td style={{ fontSize: '6px', textAlign: 'center', border: '1px solid #000', padding: '2px 3px' }}>
                  Sistemática de conduta médica assistencial condicionada ao PCMSO e estabelecerá exames complementares indicados conforme a necessidade, pelo Médico coordenador ou examinador.
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '2px 3px' }}>Nome: <input className="form-input" value={formData.nome} onChange={(e) => updateField('nome', e.target.value)} /></td>
                <td style={{ border: '1px solid #000', padding: '2px 3px' }}>PN/Ponto: <input className="form-input" value={formData.pn} onChange={(e) => updateField('pn', e.target.value)} /></td>
                <td style={{ border: '1px solid #000', padding: '2px 3px' }}>Setor/Empresa: <input className="form-input" value={formData.setor} onChange={(e) => updateField('setor', e.target.value)} /></td>
              </tr>
              <tr>
                <td colSpan={3} style={{ border: '1px solid #000', padding: '2px 3px' }}>Cargo: <input className="form-input" value={formData.cargo} onChange={(e) => updateField('cargo', e.target.value)} /></td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px' }}>
            <tbody>
              {perguntas.map((pergunta, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td rowSpan={perguntas.length} style={{ border: '1px solid #000', writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center', fontWeight: 'bold', width: '22px' }}>
                      ENTREVISTA<br/>MÉDICA
                    </td>
                  )}
                  <td style={{ border: '1px solid #000', padding: '2px 3px' }}>{pergunta}</td>
                  <td style={{ border: '1px solid #000', width: '60px', textAlign: 'center' }}>
                    SIM <input type="radio" name={`q${index}`} checked={formData.respostas[index] === 'sim'} onChange={() => updateResposta(index, 'sim')} />
                  </td>
                  <td style={{ border: '1px solid #000', width: '60px', textAlign: 'center' }}>
                    NÃO <input type="radio" name={`q${index}`} checked={formData.respostas[index] === 'nao'} onChange={() => updateResposta(index, 'nao')} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '2px 3px', fontWeight: 'bold' }}>Observação:</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: '2px 3px' }}>
                  <textarea className="form-textarea" rows={4} value={formData.observacao} onChange={(e) => updateField('observacao', e.target.value)} />
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '2px 3px' }}>PESO: <input className="form-input" value={formData.peso} onChange={(e) => updateField('peso', e.target.value)} /></td>
                <td style={{ border: '1px solid #000', padding: '2px 3px' }}>ALTURA: <input className="form-input" value={formData.altura} onChange={(e) => updateField('altura', e.target.value)} /></td>
                <td style={{ border: '1px solid #000', padding: '2px 3px' }}>IMC: <input className="form-input" value={formData.imc} onChange={(e) => updateField('imc', e.target.value)} /></td>
                <td style={{ border: '1px solid #000', padding: '2px 3px' }}>PA: <input className="form-input" value={formData.pa} onChange={(e) => updateField('pa', e.target.value)} /></td>
                <td style={{ border: '1px solid #000', padding: '2px 3px' }}>FC: <input className="form-input" value={formData.fc} onChange={(e) => updateField('fc', e.target.value)} /></td>
                <td style={{ border: '1px solid #000', padding: '2px 3px' }}>FR: <input className="form-input" value={formData.fr} onChange={(e) => updateField('fr', e.target.value)} /></td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px' }}>
            <tbody>
              {atividades.map((atividade, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #000', padding: '2px 3px' }}>☐ {atividade}</td>
                  <td style={{ border: '1px solid #000', width: '60px', textAlign: 'center' }}>☐ Liberado</td>
                  <td style={{ border: '1px solid #000', width: '60px', textAlign: 'center' }}>☐ Não Liberado</td>
                  <td style={{ border: '1px solid #000', width: '60px', textAlign: 'center' }}>☐ N/A</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '2px 3px' }}>Assinatura do Médico Examinador: _____________________________</td>
                <td style={{ border: '1px solid #000', padding: '2px 3px' }}>Data: <input className="form-input" value={formData.data} onChange={(e) => updateField('data', e.target.value)} /></td>
              </tr>
            </tbody>
          </table>

          <p style={{ fontSize: '6px', textAlign: 'right', marginTop: '4px' }}>Página 1 de 1</p>
        </div>
      </div>
    </div>
  );
}
