import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save, Download, ArrowLeft } from 'lucide-react';

export default function FormEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formContent, setFormContent] = useState('');

  useEffect(() => {
    // Carregar conteúdo do formulário do localStorage ou API
    const saved = localStorage.getItem(`form-${id}`);
    if (saved) {
      setFormContent(saved);
    } else {
      // Template inicial
      setFormContent(getInitialTemplate());
    }
  }, [id]);

  const getInitialTemplate = () => {
    return `
      <div style="padding: 40px; background: white; min-height: 100vh;">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
          <div>
            <h1 style="font-size: 18px; font-weight: bold;">MEDICINA DO TRABALHO</h1>
            <p style="font-size: 10px; margin-top: 5px;">Motivo da Revisão: Emissão Inicial</p>
            <p style="font-size: 10px;">Instrução de preenchimento:</p>
          </div>
          <div style="text-align: right;">
            <div style="color: #2563eb; font-weight: bold; font-size: 18px;">vallourec</div>
          </div>
        </div>

        <div style="border: 1px solid #333; padding: 10px; margin-bottom: 15px;">
          <p style="text-align: center; font-size: 12px; font-weight: bold;">AVALIAÇÃO DE ATIVIDADES CRÍTICAS</p>
          <p style="text-align: center; font-size: 10px; margin-top: 5px;">
            Sistemática de conduta médica assistencial condicionada ao PCMSO e estabelecer exames complementares indicados conforme a necessidade, pelo Médico coordenador ou examinador.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px; margin-bottom: 15px;">
          <div style="border: 1px solid #333; padding: 5px;">
            <span style="font-size: 10px;">Nome: <input type="text" style="border: none; border-bottom: 1px solid #999; width: 80%;" /></span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
            <div style="border: 1px solid #333; padding: 5px;">
              <span style="font-size: 10px;">PN: <input type="text" style="border: none; border-bottom: 1px solid #999; width: 60%;" /></span>
            </div>
            <div style="border: 1px solid #333; padding: 5px;">
              <span style="font-size: 10px;">Setor: <input type="text" style="border: none; border-bottom: 1px solid #999; width: 50%;" /></span>
            </div>
          </div>
        </div>

        <div style="border: 1px solid #333; padding: 5px; margin-bottom: 15px;">
          <span style="font-size: 10px;">Cargo: <input type="text" style="border: none; border-bottom: 1px solid #999; width: 90%;" /></span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 15px;">
          <tbody>
            <tr>
              <td style="border: 1px solid #333; padding: 5px;">Fatores Psicossociais 'estressores': Acrofobia, Claustrofobia, Agorafobia, Ansiedade, Fobias, Transtorno Psiquiátrico</td>
              <td style="border: 1px solid #333; padding: 5px; text-align: center;">SIM <input type="checkbox" /></td>
              <td style="border: 1px solid #333; padding: 5px; text-align: center;">NÃO <input type="checkbox" /></td>
            </tr>
            <tr>
              <td style="border: 1px solid #333; padding: 5px;">Coordenação Motora: Restrição de Movimentos, equilíbrio, Desorientação tempo – espaço, história de Enfermidades</td>
              <td style="border: 1px solid #333; padding: 5px; text-align: center;">SIM <input type="checkbox" /></td>
              <td style="border: 1px solid #333; padding: 5px; text-align: center;">NÃO <input type="checkbox" /></td>
            </tr>
            <tr>
              <td style="border: 1px solid #333; padding: 5px;">Doenças da Coluna e MMII (Desmubulação)</td>
              <td style="border: 1px solid #333; padding: 5px; text-align: center;">SIM <input type="checkbox" /></td>
              <td style="border: 1px solid #333; padding: 5px; text-align: center;">NÃO <input type="checkbox" /></td>
            </tr>
          </tbody>
        </table>

        <div style="border: 1px solid #333; padding: 10px; margin-bottom: 15px;">
          <p style="font-size: 10px; font-weight: bold;">Observação:</p>
          <textarea style="width: 100%; height: 60px; border: none; margin-top: 5px; font-size: 10px;"></textarea>
        </div>

        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 5px; margin-bottom: 15px;">
          <div style="border: 1px solid #333; padding: 5px;">
            <span style="font-size: 10px;">PESO: <input type="text" style="width: 40px; border: none; border-bottom: 1px solid #999;" /></span>
          </div>
          <div style="border: 1px solid #333; padding: 5px;">
            <span style="font-size: 10px;">ALTURA: <input type="text" style="width: 40px; border: none; border-bottom: 1px solid #999;" /></span>
          </div>
          <div style="border: 1px solid #333; padding: 5px;">
            <span style="font-size: 10px;">IMC: <input type="text" style="width: 40px; border: none; border-bottom: 1px solid #999;" /></span>
          </div>
          <div style="border: 1px solid #333; padding: 5px;">
            <span style="font-size: 10px;">PA: <input type="text" style="width: 40px; border: none; border-bottom: 1px solid #999;" /></span>
          </div>
          <div style="border: 1px solid #333; padding: 5px;">
            <span style="font-size: 10px;">FC: <input type="text" style="width: 40px; border: none; border-bottom: 1px solid #999;" /></span>
          </div>
          <div style="border: 1px solid #333; padding: 5px;">
            <span style="font-size: 10px;">FR: <input type="text" style="width: 40px; border: none; border-bottom: 1px solid #999;" /></span>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 15px;">
          <tbody>
            <tr>
              <td style="border: 1px solid #333; padding: 5px;"><input type="checkbox" /> Trabalho em altura (Acima de 2 metros)</td>
              <td style="border: 1px solid #333; padding: 5px; text-align: center;"><input type="checkbox" /> Liberado</td>
              <td style="border: 1px solid #333; padding: 5px; text-align: center;"><input type="checkbox" /> Não Liberado</td>
              <td style="border: 1px solid #333; padding: 5px; text-align: center;"><input type="checkbox" /> N/A</td>
            </tr>
            <tr>
              <td style="border: 1px solid #333; padding: 5px;"><input type="checkbox" /> Equipamento de Guindar</td>
              <td style="border: 1px solid #333; padding: 5px; text-align: center;"><input type="checkbox" /> Liberado</td>
              <td style="border: 1px solid #333; padding: 5px; text-align: center;"><input type="checkbox" /> Não Liberado</td>
              <td style="border: 1px solid #333; padding: 5px; text-align: center;"><input type="checkbox" /> N/A</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #999;">
          <div style="display: flex; justify-content: space-between;">
            <div style="flex: 1;">
              <p style="font-size: 10px;">Assinatura do Médico Examinador: _______________________</p>
            </div>
            <div>
              <p style="font-size: 10px;">Data: ____/____/____</p>
            </div>
          </div>
          <p style="font-size: 10px; color: #666; margin-top: 10px;">MOD AMS MT 001/00</p>
          <p style="font-size: 10px; text-align: right; margin-top: 5px;">Página 1 de 1</p>
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
      {/* Header fixo */}
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

      {/* Editor */}
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
