import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormStore } from "@/hooks/useFormStore";
import { Eye } from "lucide-react";

export const FormPreview = () => {
  const { selectedTemplate, formData, formConfig } = useFormStore();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Preview do Formulário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg p-6 min-h-[400px]" style={{ fontFamily: 'Arial, sans-serif' }}>
          {/* Cabeçalho do formulário */}
          <div className="text-center mb-6">
            <h1 
              className="font-bold text-gray-800 mb-2"
              style={{ fontSize: `${formConfig.fontConfig.titulo}px` }}
            >
              {formData.titulo || 'Título do Formulário'}
            </h1>
            {formData.empresa && (
              <p 
                className="text-gray-600"
                style={{ fontSize: `${formConfig.fontConfig.conteudo}px` }}
              >
                {formData.empresa}
              </p>
            )}
            {formData.descricao && (
              <p 
                className="text-gray-500 mt-2"
                style={{ fontSize: `${formConfig.fontConfig.conteudo - 1}px` }}
              >
                {formData.descricao}
              </p>
            )}
          </div>

          {/* Campos do formulário */}
          <div className="space-y-4">
            {selectedTemplate.campos.map((campo) => (
              <div key={campo.id} className="space-y-1">
                <label 
                  className="block font-medium text-gray-700"
                  style={{ fontSize: `${formConfig.fontConfig.labels}px` }}
                >
                  {campo.label}
                  {campo.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {campo.type === 'textarea' ? (
                  <div 
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 min-h-[80px]"
                    style={{ fontSize: `${formConfig.fontConfig.campos}px` }}
                  >
                    <span className="text-gray-400">{campo.placeholder || 'Digite aqui...'}</span>
                  </div>
                ) : campo.type === 'select' ? (
                  <div 
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    style={{ fontSize: `${formConfig.fontConfig.campos}px` }}
                  >
                    <span className="text-gray-400">Selecione uma opção</span>
                  </div>
                ) : (
                  <div 
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    style={{ fontSize: `${formConfig.fontConfig.campos}px` }}
                  >
                    <span className="text-gray-400">{campo.placeholder || `Digite ${campo.label.toLowerCase()}`}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Rodapé */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p 
              className="text-center text-gray-500"
              style={{ fontSize: `${formConfig.fontConfig.conteudo - 2}px` }}
            >
              Formulário gerado automaticamente
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};