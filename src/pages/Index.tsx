import { useState } from "react";
import { FileUploadSection } from "@/components/certificate/FileUploadSection";
import { CourseDataSection } from "@/components/certificate/CourseDataSection";
import { DetailsSection } from "@/components/certificate/DetailsSection";
import { TeamSection } from "@/components/certificate/TeamSection";
import { OutputFormatSection } from "@/components/certificate/OutputFormatSection";
import { SignatureConfigSection } from "@/components/certificate/SignatureConfigSection";
import { FontConfigSection } from "@/components/certificate/FontConfigSection";
import { ActionButtons } from "@/components/certificate/ActionButtons";
import { GraduationCap } from "lucide-react";

const Index = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gerador de Certificados</h1>
              <p className="text-primary-foreground/80 text-sm mt-1">
                Sistema profissional de geração de certificados
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            <FileUploadSection
              pdfFile={pdfFile}
              setPdfFile={setPdfFile}
              pptFile={pptFile}
              setPptFile={setPptFile}
              excelFile={excelFile}
              setExcelFile={setExcelFile}
            />
            <CourseDataSection />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <DetailsSection />
            <TeamSection />
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="space-y-6">
          <OutputFormatSection />
          <SignatureConfigSection />
          <FontConfigSection />
          <ActionButtons />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-muted-foreground text-sm">
            Gerador de Certificados v3.0 - Sistema Profissional de Certificação
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
