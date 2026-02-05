import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save, Download, ArrowLeft, Printer, Plus, Trash2 } from 'lucide-react';
import vallourecLogo from './vallourec.jpg';
import filipeAssinatura from './filipe_assinatura.jpg';

interface FormData {
  nome: string;
  pn: string;
  setor: string;
  cargo: string;
  respostas: Record<string, string>;
  atividades: Record<number, string>;
  observacao: string;
  peso: string;
  altura: string;
  imc: string;
  pa: string;
  fc: string;
  fr: string;
  data: string;
  assinatura: boolean;
}

const perguntas = [
  'Fatores Psicossociais \'estressores\': Acrofobia, Claustrofobia, Agorafobia, Ansiedade, Insônia, Tratamento Psiquiátrico.',
  'Coordenação Motora; Restrição de Movimentos, equilíbrio, Desorientação tempo – espaço, tremores de Extremidades.',
  'Doenças da Coluna e MMII (Deambulação)',
  'Sinal de Romberg Positivo; Desmaio, Tontura, Vertigem ou Zumbido',
  'Epilepsia, Convulsão, Doença Neurológica',
  'Patologias Crônicas descompensadas: Doenças cardiovasculares, Hipertensão',
  'Uso Medicamentoso que interferem no Sistema Nervoso, Ritmo e Frequência Cardíaca',
  'Uso Contínuo ou Abusivo de Bebida Alcoólica, Drogas, Tabagista (Dependência Química)',
  'Obesidade',
  'Doença Pulmonar "Asma Brônquica e DPOC"',
  'Anemia',
  'Patologias Crônicas Descompensadas: Diabetes tipo I ou II; Diabético Insulinodependente.',
  'Doença Nefropática',
  'Pelos, Deformidade Facial',
  'Doenças da Tireoide'
];

const atividades = [
  'Trabalho em altura (Acima de 2 metros)',
  'Equipamentos de Guindar (Ponte Rolante cabine/ controle/ botoeira e Pórtico cabine)',
  'Equipamentos de Guindar (Talha)',
  'Equipamentos móveis (Caminhão Munck/ Empilhadeira/ Pá carregadeira / Veículo de carga e passageiro)',
  'Eletricidade (baixa / alta tensão) Exposição a calor',
  'Espaço confinado',
  'Plataforma Elevatória',
  'Proteção Respiratória',
  'Radiação Ionizante'
];

export default function FormEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormData[]>([{
    nome: '',
    pn: '',
    setor: '',
    cargo: '',
    respostas: {},
    atividades: {},
    observacao: '',
    peso: '',
    altura: '',
    imc: '',
    pa: '',
    fc: '',
    fr: '',
    data: new Date().toLocaleDateString('pt-BR'),
    assinatura: false
  }]);

  useEffect(() => {
    const saved = localStorage.getItem(`form-${id}`);
    if (saved) {
      setForms(JSON.parse(saved));
    }
  }, [id]);

  const addNewForm = () => {
    setForms([...forms, {
      nome: '',
      pn: '',
      setor: '',
      cargo: '',
      respostas: {},
      atividades: {},
      observacao: '',
      peso: '',
      altura: '',
      imc: '',
      pa: '',
      fc: '',
      fr: '',
      data: new Date().toLocaleDateString('pt-BR'),
      assinatura: false
    }]);
  };

  const addSignatureToAll = () => {
    setForms(prev => prev.map(form => ({ ...form, assinatura: true })));
  };

  const toggleSignature = (formIndex: number) => {
    setForms(prev => prev.map((form, idx) => 
      idx === formIndex ? { ...form, assinatura: !form.assinatura } : form
    ));
  };

  const updateField = (formIndex: number, field: keyof FormData, value: string) => {
    setForms(prev => prev.map((form, idx) => 
      idx === formIndex ? { ...form, [field]: value } : form
    ));
  };

  const updateResposta = (formIndex: number, index: number, value: string) => {
    setForms(prev => prev.map((form, idx) => 
      idx === formIndex ? { ...form, respostas: { ...form.respostas, [index]: value } } : form
    ));
  };

  const handleCheckboxAtividade = (formIndex: number, index: number, checked: boolean) => {
    setForms(prev => prev.map((form, idx) => {
      if (idx !== formIndex) return form;
      if (checked) {
        return { ...form, atividades: { ...form.atividades, [index]: 'checked' } };
      } else {
        return { ...form, atividades: { ...form.atividades, [index]: 'na' } };
      }
    }));
  };

  const handleRadioAtividade = (formIndex: number, index: number, value: string) => {
    setForms(prev => prev.map((form, idx) => 
      idx === formIndex ? { ...form, atividades: { ...form.atividades, [index]: value } } : form
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent, formIndex: number, type: 'resposta' | 'atividade', index: number) => {
    if (type === 'resposta') {
      if (e.key === 'ArrowLeft' || e.key === '1') {
        e.preventDefault();
        updateResposta(formIndex, index, 'sim');
      } else if (e.key === 'ArrowRight' || e.key === '2') {
        e.preventDefault();
        updateResposta(formIndex, index, 'nao');
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        // Navegar entre perguntas
        const nextIndex = e.key === 'ArrowDown' ? index + 1 : index - 1;
        if (nextIndex >= 0 && nextIndex < perguntas.length) {
          const nextElement = document.querySelector(`[data-resposta="${formIndex}-${nextIndex}"]`) as HTMLElement;
          nextElement?.focus();
        }
        e.preventDefault();
      }
    } else if (type === 'atividade') {
      const isNA = forms[formIndex].atividades[index] === 'na' || forms[formIndex].atividades[index] === undefined;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleCheckboxAtividade(formIndex, index, isNA);
      } else if (!isNA) {
        if (e.key === 'ArrowLeft' || e.key === '1') {
          e.preventDefault();
          handleRadioAtividade(formIndex, index, 'liberado');
        } else if (e.key === 'ArrowRight' || e.key === '2') {
          e.preventDefault();
          handleRadioAtividade(formIndex, index, 'nao_liberado');
        } else if (e.key === 'ArrowDown' || e.key === '3') {
          e.preventDefault();
          handleRadioAtividade(formIndex, index, 'na');
        }
      }
      
      // Navegar entre atividades
      if (e.key === 'Tab') {
        const nextIndex = e.shiftKey ? index - 1 : index + 1;
        if (nextIndex >= 0 && nextIndex < atividades.length) {
          e.preventDefault();
          const nextElement = document.querySelector(`[data-atividade="${formIndex}-${nextIndex}"]`) as HTMLElement;
          nextElement?.focus();
        }
      }
    }
  };

  const removeForm = (index: number) => {
    if (forms.length > 1) {
      if (confirm(`Deseja realmente excluir o documento ${index + 1}?`)) {
        setForms(forms.filter((_, idx) => idx !== index));
      }
    }
  };

  const handleSave = () => {
    localStorage.setItem(`form-${id}`, JSON.stringify(forms));
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
    <div className="min-h-screen" style={{ background: 'white' }}>
      <style>{`
        @page {
          size: A4 portrait;
          margin: 5mm;
        }
        @media print {
          @page {
            margin: 5mm;
          }
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            width: 100%;
            padding: 0;
            margin: 0;
            background: transparent !important;
            box-shadow: none !important;
          }
          .print-container > div {
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          .print-page {
            padding: 5mm !important;
          }
        }
        @media screen {
          body {
            background: white;
          }
          .print-container {
            width: 210mm;
            margin: 0 auto;
            padding: 5mm;
            background: transparent;
          }
        }
        .form-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 9pt;
          font-family: 'Arial MT', Arial, sans-serif;
          width: 100%;
        }
        .form-textarea {
          border: none;
          outline: none;
          background: transparent;
          font-size: 8pt;
          font-family: 'Arial MT', Arial, sans-serif;
          width: 100%;
          resize: vertical;
          line-height: 1.3;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }
        td {
          border: 1px solid #000;
          padding: 2px 4px;
          vertical-align: middle;
          font-size: 9pt;
          font-family: 'Arial MT', Arial, sans-serif;
        }
        a {
          display: none !important;
        }
        .delete-button {
          pointer-events: auto !important;
          cursor: pointer !important;
          z-index: 9999 !important;
          position: relative !important;
        }
        .delete-button:hover {
          opacity: 0.8;
        }
      `}</style>

      <div className="bg-white border-b shadow-sm sticky top-0 z-10 no-print">
        <div className="container mx-auto px-6 py-4 flex justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={addNewForm}>
              <Plus className="w-4 h-4 mr-2" /> Novo Documento
            </Button>
            <Button variant="outline" size="sm" onClick={addSignatureToAll}>
              Adicionar Assinatura em Todos
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> Salvar
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" /> Imprimir Todos ({forms.length})
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" /> Baixar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="print-container" id="form-content" style={{ fontFamily: '\'Arial MT\', Arial, sans-serif', fontSize: '9pt' }}>
          {forms.map((formData, formIndex) => (
            <div key={formIndex} style={{ pageBreakAfter: formIndex < forms.length - 1 ? 'always' : 'auto', marginBottom: formIndex < forms.length - 1 ? '50px' : '0', position: 'relative', border: '1px solid #e5e7eb', padding: '10px', borderRadius: '8px', pageBreakInside: 'avoid' }} className="print-page">
          
          <div className="no-print" style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '8px', alignItems: 'center', zIndex: 9999, background: 'white', padding: '4px 8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b7280' }}>Documento {formIndex + 1}</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={formData.assinatura} 
                onChange={() => toggleSignature(formIndex)}
                style={{ cursor: 'pointer' }}
              />
              Assinatura
            </label>
            {forms.length > 1 && (
              <button
                className="delete-button"
                onClick={() => removeForm(formIndex)}
                style={{
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '500'
                }}
              >
                <Trash2 style={{ width: '14px', height: '14px' }} />
                Excluir
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2px', marginTop: '0px', pageBreakInside: 'avoid', position: 'relative' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16pt', fontFamily: 'Arial, sans-serif', textDecoration: 'underline', textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>MEDICINA DO TRABALHO</div>
            <img src={vallourecLogo} alt="Vallourec" style={{ height: '30px', marginLeft: 'auto' }} />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2px' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid #000', padding: '2px', fontSize: '16 pt' }}>AVALIAÇÃO DE ATIVIDADES CRÍTICAS</td>
              </tr>
              <tr>
                <td style={{ fontSize: '10 pt', textAlign: 'justify', border: '1px solid #000', padding: '1px' }}>
                  Sistemática de conduta médica está condicionada ao PCMSO e estabelecerá exames complementares indicados conforme a necessidade, pelo Médico coordenador ou examinador.
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '1px 4px', height: '16px', fontSize: '8pt', whiteSpace: 'nowrap', width: '60%' }}>Nome: <input className="form-input" style={{ fontSize: '8pt', display: 'inline', width: 'calc(100% - 40px)' }} value={formData.nome} onChange={(e) => updateField(formIndex, 'nome', e.target.value)} /></td>
                <td style={{ border: '1px solid #000', padding: '1px 4px', height: '16px', fontSize: '8pt', whiteSpace: 'nowrap', width: '40%' }}>PN/Ronda: <input className="form-input" style={{ fontSize: '8pt', display: 'inline', width: 'calc(100% - 70px)' }} value={formData.pn} onChange={(e) => updateField(formIndex, 'pn', e.target.value)} /></td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: '1px 4px', height: '16px', fontSize: '8pt', whiteSpace: 'nowrap', width: '60%' }}>Cargo: <input className="form-input" style={{ fontSize: '8pt', display: 'inline', width: 'calc(100% - 45px)' }} value={formData.cargo} onChange={(e) => updateField(formIndex, 'cargo', e.target.value)} /></td>
                <td style={{ border: '1px solid #000', padding: '1px 4px', height: '16px', fontSize: '8pt', whiteSpace: 'nowrap', width: '40%' }}>Setor/Empresa: <input className="form-input" style={{ fontSize: '8pt', display: 'inline', width: 'calc(100% - 95px)' }} value={formData.setor} onChange={(e) => updateField(formIndex, 'setor', e.target.value)} /></td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <tbody>
              {perguntas.map((pergunta, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td rowSpan={perguntas.length} style={{ border: '1px solid #000', textAlign: 'center', fontWeight: 'normal', width: '24px', fontSize: '14px', padding: '4px 2px', lineHeight: '1.2' }}>
                      <div>E</div>
                      <div>N</div>
                      <div>T</div>
                      <div>R</div>
                      <div>E</div>
                      <div>V</div>
                      <div>I</div>
                      <div>S</div>
                      <div>T</div>
                      <div>A</div>
                      <div style={{ height: '12px' }}></div>
                      <div>M</div>
                      <div>É</div>
                      <div>D</div>
                      <div>I</div>
                      <div>C</div>
                      <div>A</div>
                    </td>
                  )}
                  <td style={{ border: '1px solid #000', padding: '3px 5px', fontSize: '9pt', lineHeight: '1.1' }}>{pergunta}</td>
                  <td 
                    style={{ border: '1px solid #000', width: '65px', textAlign: 'center', fontSize: '9pt', cursor: 'pointer', padding: '3px 4px', lineHeight: '1.1' }} 
                    tabIndex={0} 
                    onKeyDown={(e) => handleKeyDown(e, formIndex, 'resposta', index)}
                    data-resposta={`${formIndex}-${index}`}
                    onClick={() => updateResposta(formIndex, index, 'sim')}
                  >
                    SIM <span style={{ fontSize: '10pt' }}>({formData.respostas[index] === 'sim' ? 'X' : ' '})</span>
                  </td>
                  <td 
                    style={{ border: '1px solid #000', width: '65px', textAlign: 'center', fontSize: '9pt', cursor: 'pointer', padding: '3px 4px', lineHeight: '1.1' }} 
                    tabIndex={0} 
                    onKeyDown={(e) => handleKeyDown(e, formIndex, 'resposta', index)}
                    onClick={() => updateResposta(formIndex, index, 'nao')}
                  >
                    NÃO <span style={{ fontSize: '10pt' }}>({formData.respostas[index] === 'nao' ? 'X' : ' '})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '1px 4px', fontWeight: 'bold', fontSize: '9pt' }}>Observação:</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: '3px', height: '50px', verticalAlign: 'top' }}>
                  <textarea 
                    className="form-textarea" 
                    rows={2} 
                    value={formData.observacao} 
                    onChange={(e) => updateField(formIndex, 'observacao', e.target.value)}
                    style={{ minHeight: '40px', fontSize: '9pt', lineHeight: '1.2' }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <tbody>
              <tr style={{ height: '60px' }}>
                <td style={{ border: '1px solid #000', borderRight: 'none', padding: '2px 4px', fontSize: '9pt', width: '25%', verticalAlign: 'top' }}>
                  <div>PESO: <input className="form-input" style={{ fontSize: '9pt', lineHeight: '1', width: '60px', display: 'inline-block' }} value={formData.peso} onChange={(e) => updateField(formIndex, 'peso', e.target.value)} /></div>
                  <div style={{ marginTop: '12px' }}>FC: <input className="form-input" style={{ fontSize: '9pt', lineHeight: '1', width: '60px', display: 'inline-block' }} value={formData.fc} onChange={(e) => updateField(formIndex, 'fc', e.target.value)} /></div>
                </td>
                <td style={{ border: '1px solid #000', borderRight: 'none', borderLeft: 'none', padding: '2px 4px', fontSize: '9pt', width: '25%', verticalAlign: 'top' }}>
                  <div>ALTURA: <input className="form-input" style={{ fontSize: '9pt', lineHeight: '1', width: '60px', display: 'inline-block' }} value={formData.altura} onChange={(e) => updateField(formIndex, 'altura', e.target.value)} /></div>
                  <div style={{ marginTop: '12px' }}>FR: <input className="form-input" style={{ fontSize: '9pt', lineHeight: '1', width: '60px', display: 'inline-block' }} value={formData.fr} onChange={(e) => updateField(formIndex, 'fr', e.target.value)} /></div>
                </td>
                <td style={{ border: '1px solid #000', borderRight: 'none', borderLeft: 'none', padding: '2px 4px', fontSize: '9pt', width: '25%', verticalAlign: 'top' }}>
                  <div>IMC: <input className="form-input" style={{ fontSize: '9pt', lineHeight: '1', width: '60px', display: 'inline-block' }} value={formData.imc} onChange={(e) => updateField(formIndex, 'imc', e.target.value)} /></div>
                </td>
                <td style={{ border: '1px solid #000', borderLeft: 'none', padding: '2px 4px', fontSize: '9pt', width: '25%', verticalAlign: 'top' }}>
                  <div>PA: <input className="form-input" style={{ fontSize: '9pt', lineHeight: '1', width: '60px', display: 'inline-block' }} value={formData.pa} onChange={(e) => updateField(formIndex, 'pa', e.target.value)} /></div>
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <tbody>
              {atividades.map((atividade, index) => {
                const isChecked = formData.atividades[index] !== 'na' && formData.atividades[index] !== undefined;
                const isNA = formData.atividades[index] === 'na' || formData.atividades[index] === undefined;
                
                return (
                  <tr 
                    key={index} 
                    tabIndex={0} 
                    onKeyDown={(e) => handleKeyDown(e, formIndex, 'atividade', index)}
                    data-atividade={`${formIndex}-${index}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ border: '1px solid #000', borderBottom: index === atividades.length - 1 ? '1px solid #000' : 'none', borderLeft: '1px solid #000', borderRight: '1px solid #000', borderTop: index === 0 ? '1px solid #000' : 'none', padding: '1px 3px', fontSize: '8pt', lineHeight: '1.1' }}>
                      <span 
                        onClick={() => handleCheckboxAtividade(formIndex, index, !isChecked)}
                        style={{ cursor: 'pointer', userSelect: 'none', fontSize: '12pt', display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }}
                      >
                        {isChecked ? '☒' : '☐'}
                      </span> {atividade}
                    </td>
                    <td 
                      style={{ border: '1px solid #000', borderBottom: index === atividades.length - 1 ? '1px solid #000' : 'none', borderLeft: '1px solid #000', borderRight: '1px solid #000', borderTop: index === 0 ? '1px solid #000' : 'none', width: '75px', textAlign: 'center', fontSize: '8pt', cursor: 'pointer', lineHeight: '1.1', padding: '1px 2px' }}
                      onClick={() => !isNA && handleRadioAtividade(formIndex, index, 'liberado')}
                    >
                      <span style={{ fontSize: '12pt', verticalAlign: 'middle' }}>{formData.atividades[index] === 'liberado' ? '☒' : '☐'}</span> Liberado
                    </td>
                    <td 
                      style={{ border: '1px solid #000', borderBottom: index === atividades.length - 1 ? '1px solid #000' : 'none', borderLeft: '1px solid #000', borderRight: '1px solid #000', borderTop: index === 0 ? '1px solid #000' : 'none', width: '90px', textAlign: 'center', fontSize: '8pt', cursor: 'pointer', lineHeight: '1.1', padding: '1px 2px' }}
                      onClick={() => !isNA && handleRadioAtividade(formIndex, index, 'nao_liberado')}
                    >
                      <span style={{ fontSize: '12pt', verticalAlign: 'middle' }}>{formData.atividades[index] === 'nao_liberado' ? '☒' : '☐'}</span> Não Liberado
                    </td>
                    <td 
                      style={{ border: '1px solid #000', borderBottom: index === atividades.length - 1 ? '1px solid #000' : 'none', borderLeft: '1px solid #000', borderRight: '1px solid #000', borderTop: index === 0 ? '1px solid #000' : 'none', width: '60px', textAlign: 'center', fontSize: '8pt', cursor: 'pointer', lineHeight: '1.1', padding: '1px 2px' }}
                      onClick={() => handleRadioAtividade(formIndex, index, 'na')}
                    >
                      <span style={{ fontSize: '12pt', verticalAlign: 'middle' }}>{isNA ? '☒' : '☐'}</span> N/A
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginTop: '1px', pageBreakInside: 'avoid' }}>
            <div style={{ fontSize: '9pt', fontFamily: '\'Arial MT\', Arial, sans-serif', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <span style={{ marginBottom: '2px' }}>Assinatura do Médico Examinador:</span>
              {formData.assinatura ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={filipeAssinatura} alt="Assinatura" style={{ height: '130px', marginBottom: '-10px' }} />
                  <div style={{ borderBottom: '1px solid #000', width: '200px' }}></div>
                </div>
              ) : (
                <span style={{ borderBottom: '1px solid #000', display: 'inline-block', width: '200px', marginBottom: '2px' }}></span>
              )}
              <span style={{ marginLeft: '15px', marginBottom: '2px' }}>Data: <input className="form-input" style={{ width: '100px', display: 'inline-block', borderBottom: '1px solid #000', fontSize: '9pt', textAlign: 'center', padding: '0 4px' }} value={formData.data} onChange={(e) => updateField(formIndex, 'data', e.target.value)} /></span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', fontSize: '9pt', fontFamily: '\'Arial MT\', Arial, sans-serif' }}>
              <span>MOD AMS MT 001/00</span>
              <span>Página 1 de 1</span>
            </div>
          </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}