import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFormStore } from "@/hooks/useFormStore";
import { Eye, Edit3, Save } from "lucide-react";
import { useState, useRef } from "react";
import vallourecLogo from "@/pages/vallourec.jpg";

export const FormPreview = () => {
  const { selectedTemplate } = useFormStore();
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const saveContent = () => {
    if (editorRef.current) {
      console.log('Conteúdo salvo:', editorRef.current.innerHTML);
      setIsEditing(false);
    }
  };

  if (!selectedTemplate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Preview do Formulário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground">Selecione um template para visualizar o preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedTemplate.id === 'avaliacao-atividades-criticas') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview do Formulário
            </CardTitle>
            <div className="flex gap-2">
              {isEditing ? (
                <Button size="sm" onClick={saveContent}>
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
              ) : (
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            ref={editorRef}
            className="bg-white border rounded-lg p-6 overflow-auto" 
            style={{ maxHeight: '600px', fontFamily: 'Arial MT, Arial, sans-serif', fontSize: '9pt' }}
          >
            <div style={{ position: 'relative', marginBottom: '2px', marginTop: '-6px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '16pt', fontFamily: 'Arial, sans-serif', textDecoration: 'underline', textAlign: 'center' }}>MEDICINA DO TRABALHO</div>
              <img src={vallourecLogo} alt="Vallourec" style={{ height: '32px', position: 'absolute', right: '20px', top: '-4px' }} />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px', border: '0.5px solid #000' }}>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', border: '0.5px solid #000', padding: '5px', fontSize: '11px' }}>AVALIAÇÃO DE ATIVIDADES CRÍTICAS</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '9pt', textAlign: 'justify', border: '0.5px solid #000', padding: '3px' }}>
                    Sistemática de conduta médica está condicionada ao PCMSO e estabelecerá exames complementares indicados conforme a necessidade, pelo Médico coordenador ou examinador.
                  </td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px', border: '0.5px solid #000' }}>
              <tbody>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '1px 4px', height: '8px', fontSize: '9pt' }}>Nome: _______________</td>
                  <td style={{ border: '0.5px solid #000', padding: '1px 4px', height: '8px', fontSize: '9pt' }}>PN/Ronda: _____</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '1px 4px', height: '8px', fontSize: '9pt' }}>Cargo: _______________</td>
                  <td style={{ border: '0.5px solid #000', padding: '1px 4px', height: '8px', fontSize: '9pt' }}>Setor/Empresa: _____</td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px', border: '0.5px solid #000' }}>
              <tbody>
                <tr>
                  <td rowSpan={15} style={{ border: '0.5px solid #000', writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center', fontWeight: 'bold', width: '24px', fontSize: '10px' }}>ENTREVISTA MÉDICA</td>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Fatores Psicossociais 'estressores': Acrofobia, Claustrofobia, Agorafobia, Ansiedade, Insônia, Tratamento Psiquiátrico.</td>
                  <td style={{ border: '0.5px solid #000', width: '65px', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', width: '65px', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Coordenação Motora; Restrição de Movimentos, equilíbrio, Desorientação tempo – espaço, tremores de Extremidades.</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Doenças da Coluna e MMII (Deambulação)</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Sinal de Romberg Positivo; Desmaio, Tontura, Vertigem ou Zumbido</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Epilepsia, Convulsão, Doença Neurológica</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Patologias Crônicas descompensadas: Doenças cardiovasculares, Hipertensão</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Uso Medicamentoso que interferem no Sistema Nervoso, Ritmo e Frequência Cardíaca</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Uso Contínuo ou Abusivo de Bebida Alcoólica, Drogas, Tabagista (Dependência Química)</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Obesidade</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Doença Pulmonar "Asma Brônquica e DPOC"</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Anemia</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Patologias Crônicas Descompensadas: Diabetes tipo I ou II; Diabético Insulinodependente.</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Doença Nefropática</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Pelos, Deformidade Facial</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Doenças da Tireoide</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>SIM ( )</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '9pt' }}>NÃO ( )</td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px', border: '0.5px solid #000' }}>
              <tbody>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontWeight: 'bold', fontSize: '9pt' }}>Observação:</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', height: '30px' }}></td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px', border: '0.5px solid #000' }}>
              <tbody>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>PESO: ___</td>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>ALTURA: ___</td>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>IMC: ___</td>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>PA: ___</td>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>FC: ___</td>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '9pt' }}>FR: ___</td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px', border: '0.5px solid #000' }}>
              <tbody>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '8pt' }}>☐ Trabalho em altura (Acima de 2 metros)</td>
                  <td style={{ border: '0.5px solid #000', width: '75px', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Liberado</td>
                  <td style={{ border: '0.5px solid #000', width: '90px', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Não Liberado</td>
                  <td style={{ border: '0.5px solid #000', width: '60px', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ N/A</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '8pt' }}>☐ Equipamentos de Guindar (Ponte Rolante cabine/ controle/ botoeira e Pórtico cabine)</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Não Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ N/A</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '8pt' }}>☐ Equipamentos de Guindar (Talha)</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Não Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ N/A</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '8pt' }}>☐ Equipamentos móveis (Caminhão Munck/ Empilhadeira/ Pá carregadeira / Veículo de carga e passageiro)</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Não Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ N/A</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '8pt' }}>☐ Eletricidade (baixa / alta tensão) Exposição a calor</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Não Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ N/A</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '8pt' }}>☐ Espaço confinado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Não Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ N/A</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '8pt' }}>☐ Plataforma Elevatória</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Não Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ N/A</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '8pt' }}>☐ Proteção Respiratória</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Não Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ N/A</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #000', padding: '2px 4px', fontSize: '8pt' }}>☐ Radiação Ionizante</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ Não Liberado</td>
                  <td style={{ border: '0.5px solid #000', textAlign: 'center', padding: '2px', fontSize: '8pt' }}>☐ N/A</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '24px', fontSize: '11pt', fontFamily: 'Arial MT, Arial, sans-serif' }}>
              <span>Assinatura do Médico Examinador: _____________________________</span>
              <span style={{ marginLeft: '40px' }}>Data: ......../......../........</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9pt', fontFamily: 'Arial MT, Arial, sans-serif' }}>
              <span>MOD AMS MT 001/00</span>
              <span>Página 1 de 1</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Preview do Formulário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg p-6 min-h-[400px]">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">Título do Formulário</h1>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
