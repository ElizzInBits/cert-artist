import { useState, useEffect } from 'react';
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
  respostas: Record<number, string>;
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
  'Fatores Psicossociais "estressores": Acrofobia, Claustrofobia, Agorofobia, Ansiedade, Insônia, Tratamento Psiquiátrico.',
  'Coordenação Motora; Restrição de Movimentos, equilíbrio, Desorientação tempo–espaço.',
  'Doenças da Coluna e MMII (Deambulação)',
  'Sinal de Romberg Positivo; Desmaio, Tontura, Vertigem ou Zumbido',
  'Epilepsia, Convulsão, Doença Neurológica',
  'Patologias Crônicas descompensadas: Doenças cardiovasculares, Hipertensão',
  'Uso Medicamentoso que interfere no Sistema Nervoso e Ritmo Cardíaco',
  'Uso Contínuo ou Abusivo de Álcool, Drogas ou Tabagismo',
  'Obesidade',
  'Doença Pulmonar (Asma Brônquica / DPOC)',
  'Anemia',
  'Diabetes tipo I ou II (Insulinodependente)',
  'Doença Nefropática',
  'Pelos / Deformidade Facial',
  'Doenças da Tireoide'
];

const atividades = [
  'Trabalho em altura (Acima de 2 metros)',
  'Equipamentos de Guindar – Ponte Rolante / Pórtico',
  'Equipamentos de Guindar – Talha',
  'Equipamentos móveis (Munck / Empilhadeira / Veículos)',
  'Eletricidade (Baixa / Alta tensão)',
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
    if (saved) setForms(JSON.parse(saved));
  }, [id]);

  const updateField = (i: number, f: keyof FormData, v: string) =>
    setForms(p => p.map((x, k) => k === i ? { ...x, [f]: v } : x));

  const updateResposta = (i: number, q: number, v: string) =>
    setForms(p => p.map((x, k) => k === i ? { ...x, respostas: { ...x.respostas, [q]: v } } : x));

  const updateAtividade = (i: number, a: number, v: string) =>
    setForms(p => p.map((x, k) => k === i ? { ...x, atividades: { ...x.atividades, [a]: v } } : x));

  return (
    <div className="min-h-screen bg-white">

      <style>{`
        @page {
          size: A4;
          margin: 5mm 6mm;
        }

        @media print {
          body { font-size: 9.5pt; }
          .no-print { display: none !important; }
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 2px;
        }

        td {
          border: 0.35px solid #000;
          padding: 3px 4px;
          vertical-align: middle;
          font-size: 9.5pt;
          font-family: Arial, Helvetica, sans-serif;
        }

        .form-input, .form-textarea {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 9.5pt;
          font-family: Arial, Helvetica, sans-serif;
        }

        .form-textarea {
          resize: none;
        }
      `}</style>

      <div className="no-print flex gap-2 p-4 border-b">
        <Button size="sm" variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        <Button size="sm" onClick={() => setForms([...forms, forms[0]])}>
          <Plus className="w-4 h-4 mr-2" /> Novo
        </Button>
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" /> Imprimir
        </Button>
        <Button size="sm" onClick={() => localStorage.setItem(`form-${id}`, JSON.stringify(forms))}>
          <Save className="w-4 h-4 mr-2" /> Salvar
        </Button>
      </div>

      {forms.map((f, i) => (
        <div key={i} style={{ pageBreakAfter: 'always', padding: '6mm' }}>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <strong style={{ fontSize: '13pt', textDecoration: 'underline', flex: 1, textAlign: 'center' }}>
              MEDICINA DO TRABALHO
            </strong>
            <img src={vallourecLogo} style={{ height: '28px' }} />
          </div>

          <table>
            <tr>
              <td style={{ fontSize: '11.5pt', fontWeight: 'bold', textAlign: 'center', letterSpacing: '0.5px' }}>
                AVALIAÇÃO DE ATIVIDADES CRÍTICAS
              </td>
            </tr>
          </table>

          <table>
            <tr>
              <td>Nome: <input className="form-input" value={f.nome} onChange={e => updateField(i,'nome',e.target.value)} /></td>
              <td>PN: <input className="form-input" value={f.pn} onChange={e => updateField(i,'pn',e.target.value)} /></td>
            </tr>
            <tr>
              <td>Cargo: <input className="form-input" value={f.cargo} onChange={e => updateField(i,'cargo',e.target.value)} /></td>
              <td>Setor: <input className="form-input" value={f.setor} onChange={e => updateField(i,'setor',e.target.value)} /></td>
            </tr>
          </table>

          <table>
            {perguntas.map((p, q) => (
              <tr key={q}>
                <td>{p}</td>
                <td width="60">SIM <input type="radio" checked={f.respostas[q]==='sim'} onChange={()=>updateResposta(i,q,'sim')} /></td>
                <td width="60">NÃO <input type="radio" checked={f.respostas[q]==='nao'} onChange={()=>updateResposta(i,q,'nao')} /></td>
              </tr>
            ))}
          </table>

          <table>
            <tr><td>Observações:</td></tr>
            <tr><td><textarea className="form-textarea" value={f.observacao} onChange={e=>updateField(i,'observacao',e.target.value)} /></td></tr>
          </table>

          <table>
            {atividades.map((a, x) => (
              <tr key={x}>
                <td>{a}</td>
                <td width="70">Liberado <input type="radio" onChange={()=>updateAtividade(i,x,'liberado')} /></td>
                <td width="90">Não Liberado <input type="radio" onChange={()=>updateAtividade(i,x,'nao')} /></td>
                <td width="60">N/A <input type="radio" onChange={()=>updateAtividade(i,x,'na')} /></td>
              </tr>
            ))}
          </table>

          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Assinatura:</span>
            <div style={{ textAlign: 'center' }}>
              <img src={filipeAssinatura} style={{ height: '90px', marginBottom: '-10px' }} />
              <div style={{ borderTop: '0.5px solid #000', width: '260px', fontSize: '8pt' }}>
                Médico Examinador
              </div>
            </div>
            <span>Data: {f.data}</span>
          </div>

        </div>
      ))}
    </div>
  );
}
