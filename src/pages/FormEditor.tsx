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
     <div style="width: 800px; margin: 0 auto; background: #fff; font-family: Arial, Helvetica, sans-serif; font-size: 8px; color: #000;">

  <!-- CABEÇALHO -->
  <table style="width:100%; border-collapse: collapse;">
    <tr>
      <td style="text-align:center; font-weight:bold; font-size:12px;">
        MEDICINA DO TRABALHO
      </td>
      <td style="text-align:right; font-size:14px; font-weight:bold; color:#1f6fb2;">
        vallourec
      </td>
    </tr>
  </table>

  <hr style="border:0; border-top:1px solid #000; margin:4px 0;" />

  <!-- TÍTULO -->
  <table style="width:100%; border-collapse: collapse; border:1px solid #000;">
    <tr>
      <td style="text-align:center; font-weight:bold;">
        AVALIAÇÃO DE ATIVIDADES CRÍTICAS
      </td>
    </tr>
    <tr>
      <td style="font-size:7px; text-align:center;">
        Sistemática de conduta médica assistencial condicionada ao PCMSO e estabelecerá exames complementares indicados conforme a necessidade, pelo Médico coordenador ou examinador.
      </td>
    </tr>
  </table>

  <!-- DADOS -->
  <table style="width:100%; border-collapse: collapse; margin-top:4px;">
    <tr>
      <td style="border:1px solid #000;">Nome:</td>
      <td style="border:1px solid #000;">PN/Ponto:</td>
      <td style="border:1px solid #000;">Setor/Empresa:</td>
    </tr>
    <tr>
      <td colspan="3" style="border:1px solid #000;">Cargo:</td>
    </tr>
  </table>

  <!-- AVALIAÇÃO MÉDICA -->
  <table style="width:100%; border-collapse: collapse; margin-top:4px;">
    <tr>
      <td style="border:1px solid #000; width:70%;">Fatores Psicossociais estressores</td>
      <td style="border:1px solid #000; width:15%; text-align:center;">SIM ( )</td>
      <td style="border:1px solid #000; width:15%; text-align:center;">NÃO ( )</td>
    </tr>
    <!-- repete linhas -->
  </table>

  <!-- OBS -->
  <table style="width:100%; border-collapse: collapse; margin-top:4px;">
    <tr>
      <td style="border:1px solid #000; height:30px;">Observação:</td>
    </tr>
  </table>

  <!-- ASSINATURA -->
  <div style="margin-top:10px;">
    Assinatura do Médico Examinador: ___________________________  
    Data: ____/____/____
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
