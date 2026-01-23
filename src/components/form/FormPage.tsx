import { FormDataSection } from "@/components/form/FormDataSection";
import { FormTemplateManager } from "@/components/form/FormTemplateManager";
import { FormFontConfigSection } from "@/components/form/FormFontConfigSection";
import { FormActionButtons } from "@/components/form/FormActionButtons";
import { FormPreview } from "@/components/form/FormPreview";

export const FormPage = () => {
  return (
    <div className="space-y-6">
      {/* Upload e Template */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormDataSection />
        <FormTemplateManager />
      </div>
      
      {/* Preview */}
      <FormPreview />
      
      {/* Configurações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormFontConfigSection />
        <div className="space-y-6">
          <div className="h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Configurações adicionais em breve</p>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <FormActionButtons />
    </div>
  );
};