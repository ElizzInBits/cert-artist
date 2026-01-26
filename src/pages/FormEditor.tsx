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
      <div style="padding: 20px; background: white; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
          <tr>
            <td style="width: 70%; border: 1px solid #000; padding: 5px;">
              <div style="font-size: 11px; font-weight: bold; text-decoration: underline;">MEDICINA DO TRABALHO</div>
            </td>
            <td rowspan="2" style="width: 30%; border: 1px solid #000; padding: 5px; text-align: center; vertical-align: middle;">
              <div style="color: #0066cc; font-weight: bold; font-size: 16px;">vallourec</div>
            </td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
          <tr>
            <td style="border: 1px solid #000; padding: 8px; text-align: center;">
              <div style="font-size: 10px; font-weight: bold;">AVALIAÇÃO DE ATIVIDADES CRÍTICAS</div>
              <div style="font-size: 8px; margin-top: 3px;">Sistemática de conduta médica assistencial condicionada ao PCMSO e estabelecerá exames complementares indicados conforme a necessidade, pelo Médico coordenador ou examinador.</div>
            </td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 0;">
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; width: 50%;">Nome:</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; width: 25%;">PN/Ponto:</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; width: 25%;">Setor/Empresa:</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px;" colspan="3">Cargo:</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 0;">
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; width: 70%;">Fatores Psicossociais 'estressores': Acrofobia, Claustrofobia, Agorafobia, Ansiedade, Fobias, Transtorno Psiquiátrico</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center; width: 15%;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center; width: 15%;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Coordenação Motora: Restrição de Movimentos, equilíbrio, Desorientação tempo – espaço, história de Enfermidades</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Doenças da Coluna e MMII (Deambulação)</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Sinal de Romberg Positivo: Desmaio, Tontura, Vertigem ou Zumbido</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Epilepsia, Convulsões, Doença Neurológica</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Patologias Cardiovasculares: Doenças cardiovasculares, Hipertensão</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Uso Medicamentos que interferem no Sistema Nervoso, Ritmo e Frequência Cardíaca</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Uso Contínuo ou Abusivo de Bebida Alcoólica, Drogas, Tabagista (Dependência Química)</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Obesidade</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Doença Pulmonar "Asma Brônquica e DPOC"</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Anemia</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Patologias Crônicas Descompensadas: Diabetes tipo I ou II; Diabético Insulinodependente.</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Doenças Nefróticas</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Peso, Deformidade Facial</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">Doenças da Tireóide</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">SIM ( )</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">NÃO ( )</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 0;">
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px;" colspan="6">Observação:</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 0;">
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; width: 16.66%;">PESO:</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; width: 16.66%;">ALTURA:</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; width: 16.66%;">IMC:</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; width: 16.66%;">PA:</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; width: 16.66%;">FC:</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; width: 16.66%;">FR:</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; width: 40%;">☐ Trabalho em altura (Acima de 2 metros)</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center; width: 15%;">☐ Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center; width: 15%;">☐ Não Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center; width: 10%;">☐ N/A</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">☐ Equipamentos de Guindar (Ponte Rolante cabine/ controlar botoneira e Empilhadeira Pá carregadeira / Retroescavadeira)</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Não Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ N/A</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">☐ Equipamentos de Guindar (Talha)</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Não Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ N/A</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">☐ Equipamentos móveis (Caminhão/ Munck/ Empilhadeira/ Pá carregadeira / Retroescavadeira)</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Não Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ N/A</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">☐ Eletricidade (baixa e alta tensão)</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Não Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ N/A</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">☐ Explosão e calor</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Não Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ N/A</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">☐ Plataforma Elevatória</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Não Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ N/A</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">☐ Proteção Respiratória</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Não Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ N/A</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px;">☐ Rotativo Isolante</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ Não Liberado</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 7px; text-align: center;">☐ N/A</td>
          </tr>
        </table>

        <div style="margin-top: 20px; font-size: 8px;">
          <div>Assinatura do Médico Examinador: _________________________________ Data: ......./......./.......</div>
          <div style="margin-top: 10px; display: flex; justify-content: space-between;">
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
      const content = editor.innerHTML;
      localStorage.setItem(`form-${id}`, content);
      alert('Formulário salvo com sucesso!');
    }
  };

  const handleDownload = () => {
    const editor = document.getElementById('form-editor');
    if (editor) {
      const content = editor.innerHTML;
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Avaliação de Atividades Críticas</title>
        </head>
        <body>
          ${content}
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
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-lg font-semibold">Editor de Formulário</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Baixar
              </Button>
            </div>
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
            className="focus:outline-none"
            style={{ minHeight: '800px' }}
          />
        </div>
      </div>
    </div>
  );
}
