import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProcessingToastProps {
  isProcessing: boolean;
  onComplete?: (success: boolean, message?: string) => void;
  processingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export const ProcessingToast = ({
  isProcessing,
  onComplete,
  processingMessage = "Processando imagem...",
  successMessage = "Imagem processada com sucesso!",
  errorMessage = "Erro ao processar imagem"
}: ProcessingToastProps) => {
  const { toast } = useToast();
  const [toastId, setToastId] = useState<string | null>(null);

  useEffect(() => {
    if (isProcessing && !toastId) {
      // Mostrar toast de processamento
      const id = Math.random().toString(36).substr(2, 9);
      setToastId(id);
      
      toast({
        title: (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {processingMessage}
          </div>
        ),
        duration: Infinity, // Não remove automaticamente
      });
    } else if (!isProcessing && toastId) {
      // Remover toast de processamento e mostrar resultado
      setToastId(null);
      
      if (onComplete) {
        onComplete(true, successMessage);
      }
    }
  }, [isProcessing, toastId, processingMessage, successMessage, onComplete, toast]);

  return null;
};

export const showProcessingToast = (
  toast: ReturnType<typeof useToast>['toast'],
  message: string = "Processando..."
) => {
  return toast({
    title: (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        {message}
      </div>
    ),
    duration: Infinity,
  });
};

export const showSuccessToast = (
  toast: ReturnType<typeof useToast>['toast'],
  title: string,
  description?: string
) => {
  return toast({
    title: (
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-600" />
        {title}
      </div>
    ),
    description,
    duration: 3000,
  });
};

export const showErrorToast = (
  toast: ReturnType<typeof useToast>['toast'],
  title: string,
  description?: string
) => {
  return toast({
    title: (
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-600" />
        {title}
      </div>
    ),
    description,
    variant: "destructive",
    duration: 5000,
  });
};