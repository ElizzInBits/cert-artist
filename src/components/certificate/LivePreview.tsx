import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw } from 'lucide-react';
import { useCertificateStore } from '@/hooks/useCertificateStore';
import { generateCertificatePDF } from '@/utils/pdfGenerator';

export const LivePreview = () => {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const store = useCertificateStore();
  const { employees, signatureConfig, fontConfig } = store;

  const generatePreview = async () => {
    if (!employees.length) return;
    
    setIsGenerating(true);
    try {
      const config = {
        courseData: store.courseData,
        conformidade: store.conformidade,
        conteudo: store.conteudo,
        observacoes: store.observacoes,
        useObservacoes: store.useObservacoes,
        instructors: store.instructors,
        responsibles: store.responsibles,
        employees: store.employees,
        excelFile: null,
        fontConfig: store.fontConfig,
        signatureConfig: store.signatureConfig,
        conferidoA: store.conferidoA
      };
      
      const blob = await generateCertificatePDF(employees[0], config);
      const url = URL.createObjectURL(blob);
      
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(url);
    } catch (error) {
      console.error('Erro no preview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-update quando configurações mudarem
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      generatePreview();
    }, 500); // Debounce de 500ms
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [signatureConfig, fontConfig, employees.length]);

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Preview em Tempo Real
            {isGenerating && <RefreshCw className="w-4 h-4 animate-spin" />}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generatePreview}
            disabled={isGenerating || !employees.length}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pdfUrl ? (
          <div className="border rounded-lg overflow-hidden">
            <iframe
              src={pdfUrl}
              className="w-full h-[600px]"
              title="Preview do Certificado"
            />
          </div>
        ) : (
          <div className="h-[600px] border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center text-muted-foreground">
            {employees.length ? 'Gerando preview...' : 'Carregue funcionários para ver o preview'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};