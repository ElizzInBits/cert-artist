import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Rocket, Target, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCertificateStore } from "@/hooks/useCertificateStore";
import { generateCertificatePDF, generateAllCertificates, downloadCertificate, previewCertificate } from "@/utils/pdfGenerator";
import { useState } from "react";

export const ActionButtons = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const store = useCertificateStore();
  const {
    courseData,
    conformidade,
    conteudo,
    observacoes,
    useObservacoes,
    instructors,
    responsibles,
    employees,
    fontConfig,
    signatureConfig,
    clearAll
  } = store;
  


  const validateData = () => {
    console.log('Validando dados:', { courseData, employees: employees.length });
    if (!courseData.curso || courseData.curso.trim() === '') {
      toast({
        title: "Dados incompletos",
        description: "Nome do curso é obrigatório.",
        variant: "destructive"
      });
      return false;
    }
    if (!employees || employees.length === 0) {
      toast({
        title: "Dados incompletos",
        description: "Carregue a planilha de funcionários.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handlePreview = async () => {
    if (!validateData()) return;
    
    try {
      const config = {
        courseData,
        conformidade,
        conteudo,
        observacoes,
        useObservacoes,
        instructors,
        responsibles,
        employees,
        excelFile: null,
        fontConfig,
        signatureConfig,
        conferidoA: store.conferidoA
      };
      
      console.log('Gerando preview com config:', config);
      const previewEmployee = employees[0];
      console.log('Funcionário para preview:', previewEmployee);
      
      const certificateBlob = await generateCertificatePDF(previewEmployee, config);
      previewCertificate(certificateBlob);
      
      toast({
        title: "Preview gerado",
        description: `Certificado de ${previewEmployee.nome} aberto em nova aba.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar preview",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateAll = async () => {
    if (!validateData()) return;
    
    console.log('=== INICIANDO GERAÇÃO DE CERTIFICADOS ===');
    console.log('Funcionários no store:', employees);
    console.log('Total de funcionários:', employees.length);
    console.log('Dados do curso:', courseData);
    
    // Verificar suporte para seleção de pasta
    if ('showDirectoryPicker' in window) {
      try {
        // Abrir seletor de pasta
        const dirHandle = await (window as any).showDirectoryPicker();
        
        setIsGenerating(true);
        const config = {
          courseData,
          conformidade,
          conteudo,
          observacoes,
          useObservacoes,
          instructors,
          responsibles,
          employees,
          excelFile: null,
          fontConfig,
          signatureConfig,
          conferidoA: store.conferidoA
        };
        
        console.log('Config completa para geração:', config);
        console.log('Funcionários que serão processados:', config.employees);
        
        const certificates = await generateAllCertificates(config.employees, config, (current, total) => {
          console.log(`Progresso: ${current}/${total}`);
          toast({
            title: "Gerando certificados...",
            description: `Processando ${current}/${total} certificados.`,
          });
        });
        
        // Salvar cada certificado na pasta escolhida
        for (let i = 0; i < certificates.length; i++) {
          const employee = employees[i];
          const fileName = `Certificado_${employee.nome.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.pdf`;
          const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(certificates[i]);
          await writable.close();
        }
        
        toast({
          title: "Certificados salvos",
          description: `${certificates.length} certificados salvos na pasta escolhida.`,
        });
      } catch (error) {
        if (error.name === 'AbortError') {
          toast({
            title: "Operação cancelada",
            description: "Seleção de pasta cancelada.",
          });
          return;
        }
        console.error('Erro:', error);
        toast({
          title: "Erro ao salvar",
          description: "Fazendo download individual...",
        });
        // Fallback para download individual
        await downloadIndividual();
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Navegador não suporta - download individual
      toast({
        title: "Seleção de pasta não suportada",
        description: "Fazendo download individual dos certificados.",
      });
      await downloadIndividual();
    }
  };
  
  const downloadIndividual = async () => {
    console.log('=== DOWNLOAD INDIVIDUAL ===');
    console.log('Funcionários disponíveis:', employees);
    
    setIsGenerating(true);
    try {
      const config = {
        courseData,
        conformidade,
        conteudo,
        observacoes,
        useObservacoes,
        instructors,
        responsibles,
        employees,
        excelFile: null,
        fontConfig,
        signatureConfig,
        conferidoA: store.conferidoA
      };
      
      console.log('Config para download individual:', config);
      console.log('Employees na config:', config.employees);
      
      const certificates = await generateAllCertificates(config.employees, config, (current, total) => {
        console.log(`Download individual - Progresso: ${current}/${total}`);
        toast({
          title: "Gerando certificados...",
          description: `Processando ${current}/${total} certificados.`,
        });
      });
      
      console.log('Certificados gerados:', certificates.length);
      
      certificates.forEach((cert, index) => {
        const employee = employees[index];
        console.log(`Baixando certificado ${index + 1}: ${employee.nome}`);
        const fileName = `Certificado_${employee.nome.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.pdf`;
        downloadCertificate(cert, fileName);
      });
      
      toast({
        title: "Certificados baixados",
        description: `${certificates.length} certificados baixados.`,
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro ao gerar certificados",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSelected = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Seleção de funcionários específicos será implementada em breve.",
    });
  };

  const handleClear = () => {
    clearAll();
    toast({
      title: "Formulário limpo",
      description: "Todos os campos foram resetados.",
    });
  };

  const { setEmployees } = useCertificateStore();
  
  const handleTestEmployees = () => {
    // Only add test data if no employees exist
    if (employees.length === 0) {
      const testEmployees = [
        { nome: "OTONIEL DORNELAS DOS SANTOS", cpf: "892.011.916-34" },
        { nome: "Maria Santos", cpf: "987.654.321-00" },
        { nome: "Pedro Oliveira", cpf: "456.789.123-00" }
      ];
      setEmployees(testEmployees);
      
      toast({
        title: "Dados de teste preenchidos",
        description: "Funcionários e dados do curso preenchidos para teste.",
      });
    } else {
      toast({
        title: "Dados já existem",
        description: `${employees.length} funcionários já carregados. Use 'Limpar' primeiro se quiser testar.`,
        variant: "destructive"
      });
      return;
    }
    
    // Preencher dados de teste do curso
    store.setCourseData({
      empresa: "ALVES DIAS CONTRUCOES E PNEUMATICOS",
      curso: "NR6 - EPIS E EPCS (EQUIPAMENTOS DE PROTECAO INDIVIDUAL E COLETIVA)",
      modalidade: "EAD",
      tipo: "TEORICO",
      cargaHoraria: "02 HORAS",
      periodo: "02/10/2025 A 03/10/2025",
      aproveitamento: "APROVADO"
    });
    
    store.setConformidade("NR6 - EPIS E EPCS (EQUIPAMENTOS DE PROTECAO INDIVIDUAL E COLETIVA), PORTARIA MTP N.° 4.219, DE 20 DE DEZEMBRO DE 2022");
    

  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={handlePreview}
            className="gap-2 min-w-[200px]"
          >
            <Eye className="w-5 h-5" />
             VISUALIZAR
          </Button>

          <Button
            size="lg"
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className="gap-2 min-w-[200px] bg-gradient-accent hover:opacity-90"
          >
            <Rocket className="w-5 h-5" />
            {isGenerating ? "⏳ GERANDO..." : "GERAR TODOS"}
          </Button>

          <Button
            size="lg"
            onClick={handleGenerateSelected}
            className="gap-2 min-w-[200px]"
          >
            <Target className="w-5 h-5" />
             GERAR SELECIONADOS
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleTestEmployees}
            className="gap-2 min-w-[200px]"
          >
            👤 TESTE
          </Button>

          <Button
            size="lg"
            variant="destructive"
            onClick={handleClear}
            className="gap-2 min-w-[200px]"
          >
            <Trash2 className="w-5 h-5" />
            LIMPAR
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
