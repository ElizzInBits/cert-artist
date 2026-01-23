import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormStore } from "@/hooks/useFormStore";
import { Eye } from "lucide-react";

export const FormPreview = () => {
  const { selectedTemplate, formData } = useFormStore();

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

  // Preview específico para Avaliação de Atividades Críticas
  if (selectedTemplate.id === 'avaliacao-atividades-criticas') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Preview do Formulário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white border rounded-lg p-6 overflow-auto" style={{ maxHeight: '600px' }}>
            {/* Cabeçalho */}
            <div className="flex justify-between items-start mb-4 pb-2 border-b-2 border-gray-800">
              <div>
                <h1 className="text-lg font-bold">MEDICINA DO TRABALHO</h1>
                <p className="text-xs mt-1">Motivo da Revisão: Emissão Inicial</p>
                <p className="text-xs">Instrução de preenchimento:</p>
              </div>
              <div className="text-right">
                <div className="text-blue-600 font-bold text-lg">vallourec</div>
              </div>
            </div>

            {/* Título do formulário */}
            <div className="border border-gray-800 p-2 mb-3">
              <p className="text-center text-sm font-bold">AVALIAÇÃO DE ATIVIDADES CRÍTICAS</p>
              <p className="text-xs text-center mt-1">
                Sistemática de conduta médica assistencial condicionada ao PCMSO e estabelecer exames complementares indicados conforme a necessidade, pelo Médico coordenador ou examinador.
              </p>
            </div>

            {/* Identificação */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="border border-gray-800 p-1">
                <span className="text-xs">Nome: _______________</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="border border-gray-800 p-1">
                  <span className="text-xs">PN: _____</span>
                </div>
                <div className="border border-gray-800 p-1">
                  <span className="text-xs">Setor: _____</span>
                </div>
              </div>
            </div>
            <div className="border border-gray-800 p-1 mb-3">
              <span className="text-xs">Cargo: _______________</span>
            </div>

            {/* Tabela de Avaliação */}
            <table className="w-full border-collapse border border-gray-800 text-xs mb-3">
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-1 w-3/4">Fatores Psicossociais 'estressores': Acrofobia, Claustrofobia, Agorafobia, Ansiedade, Fobias, Transtorno Psiquiátrico</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Coordenação Motora: Restrição de Movimentos, equilíbrio, Desorientação tempo – espaço, história de Enfermidades</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Doenças da Coluna e MMII (Desmbulação)</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Sinal de Romberg Positivo: Desmais, Tontura, Vertigem ou Zumbido</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Epilepsia, Convulsão, Doença Neurológica</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Patologias Crônicas descompensadas: Doenças cardiovasculares, Hipertensão</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Uso Medicamentoso que interferem no Sistema Nervoso, Ritmo e Frequência Cardíaca</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Uso Contínuo ou Abusivo de Bebida Alcoólica, Drogas, Tabagista (Dependência Química)</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Obesidade</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Doença Pulmonar "Asma Brônquica e DPOC"</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Anemia</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Endocrinopatias Crônicas Descompensadas: Diabetes tipo I ou II, Diabético Insulinodependente</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Doença Nefropática</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Pelos, Deformidade Facial</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">Doenças da Tireoide</td>
                  <td className="border border-gray-800 p-1 text-center">SIM ( )</td>
                  <td className="border border-gray-800 p-1 text-center">NÃO ( )</td>
                </tr>
              </tbody>
            </table>

            {/* Observação */}
            <div className="border border-gray-800 p-2 mb-3">
              <p className="text-xs font-semibold">Observação:</p>
              <div className="h-12 mt-1"></div>
            </div>

            {/* Dados Físicos */}
            <div className="grid grid-cols-6 gap-1 mb-3">
              <div className="border border-gray-800 p-1">
                <span className="text-xs">PESO: ___</span>
              </div>
              <div className="border border-gray-800 p-1">
                <span className="text-xs">ALTURA: ___</span>
              </div>
              <div className="border border-gray-800 p-1">
                <span className="text-xs">IMC: ___</span>
              </div>
              <div className="border border-gray-800 p-1">
                <span className="text-xs">PA: ___</span>
              </div>
              <div className="border border-gray-800 p-1">
                <span className="text-xs">FC: ___</span>
              </div>
              <div className="border border-gray-800 p-1">
                <span className="text-xs">FR: ___</span>
              </div>
            </div>

            {/* Atividades Críticas */}
            <table className="w-full border-collapse border border-gray-800 text-xs mb-3">
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-1">☐ Trabalho em altura (Acima de 2 metros)</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Não Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ N/A</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">☐ Equipamento de Guindar (Ponte Rolante cabine/ controle/ botoneira e Piso cabine)</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Não Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ N/A</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">☐ Espaço confinado (Gaseiral / Forno)</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Não Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ N/A</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">☐ Equipamento móveis (Caminhão Munk/ Empilhadeira/ Pá carregadeira / Líquido de carga e passageiro)</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Não Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ N/A</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">☐ Operação de veículo (Motorista)</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Não Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ N/A</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">☐ Exposição a calor</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Não Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ N/A</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">☐ Espaço confinado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Não Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ N/A</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">☐ Plataforma Elevatória</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Não Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ N/A</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">☐ Proteção Respiratória</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Não Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ N/A</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1">☐ Outros</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ Não Liberado</td>
                  <td className="border border-gray-800 p-1 text-center">☐ N/A</td>
                </tr>
              </tbody>
            </table>

            {/* Assinatura */}
            <div className="mt-6 pt-4 border-t border-gray-400">
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  <p className="text-xs">Assinatura do Médico Examinador: _______________________</p>
                </div>
                <div>
                  <p className="text-xs">Data: ____/____/____</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">MOD AMS MT 001/00</p>
              <p className="text-xs text-right mt-1">Página 1 de 1</p>
            </div>

            {/* Página 2 - Instruções */}
            <div className="mt-8 pt-8 border-t-4 border-gray-300">
              <div className="flex justify-between items-start mb-4 pb-2 border-b-2 border-gray-800">
                <div>
                  <h1 className="text-lg font-bold">MEDICINA DO TRABALHO</h1>
                </div>
                <div className="text-right">
                  <div className="text-blue-600 font-bold text-lg">vallourec</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p><span className="text-red-600 font-bold">(1)</span> A ENFERMAGEM DEVE PREENCHER NOME, PN, CARGO E SETOR DO EMPREGADO;</p>
                <p><span className="text-red-600 font-bold">(2)</span> O MÉDICO DE RESPONDER A ENTREVISTA MÉDICA, MARCANDO NOS QUADROS SIM OU NÃO;</p>
                <p><span className="text-red-600 font-bold">(3)</span> CASO TENHA ALGUMA OBSERVAÇÃO O MÉDICO DEVERÁ REGISTRAR;</p>
                <p><span className="text-red-600 font-bold">(4)</span> O MÉDICO DEVE ESCREVER OS DADOS DO EMPREGADO, PESO, ALTURA, IMC, PA, FC E FR;</p>
                <p><span className="text-red-600 font-bold">(5)</span> O MÉDICO DEVE ASSINALAR QUAL O TIPO DE ATIVIDADE CRÍTICA FOI SOLICITADA AO EMPREGADO E MARCAR SE FOI LIBERADO OU NÃO.</p>
                <p><span className="text-red-600 font-bold">(6)</span> O MÉDICO DEVE ASSINAR E DATAR.</p>
              </div>

              <div className="mt-6">
                <p className="text-xs text-gray-500">MOD AMS MT 001/00</p>
                <p className="text-xs text-right mt-1">Página 1 de 1</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preview genérico para outros templates
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
            <h1 className="text-xl font-bold">{formData.titulo || 'Título do Formulário'}</h1>
            {formData.empresa && <p className="text-gray-600 mt-2">{formData.empresa}</p>}
          </div>
          <div className="space-y-4">
            {selectedTemplate.campos.map((campo) => (
              <div key={campo.id} className="space-y-1">
                <label className="block font-medium text-sm">
                  {campo.label}
                  {campo.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="w-full p-2 border rounded bg-gray-50 text-sm text-gray-400">
                  {campo.placeholder || `Digite ${campo.label.toLowerCase()}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};