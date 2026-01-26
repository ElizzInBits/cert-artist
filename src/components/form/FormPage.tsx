import { FormTemplateManager } from "@/components/form/FormTemplateManager";
import { FormActionButtons } from "@/components/form/FormActionButtons";
import { FormPreview } from "@/components/form/FormPreview";

export const FormPage = () => {
  return (
    <div className="space-y-6">
      {/* Template */}
      <FormTemplateManager />
      
      {/* Preview */}
      <FormPreview />

      {/* Botões de Ação */}
      <FormActionButtons />
    </div>
  );
};