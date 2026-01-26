import { useState } from "react";
import { FileUploadSection } from "@/components/certificate/FileUploadSection";
import { CourseDataSection } from "@/components/certificate/CourseDataSection";
import { DetailsSection } from "@/components/certificate/DetailsSection";
import { TeamSection } from "@/components/certificate/TeamSection";
import { SignatureConfigSection } from "@/components/certificate/SignatureConfigSection";
import { FontConfigSection } from "@/components/certificate/FontConfigSection";
import { ActionButtons } from "@/components/certificate/ActionButtons";
import { LivePreview } from "@/components/certificate/LivePreview";
import { TemplateManager } from "@/components/certificate/TemplateManager";
import { FormPage } from "@/components/form/FormPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, LogOut, FileText } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary to-blue-600 text-primary-foreground shadow-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3 w-full">
            <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm shadow-lg">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight drop-shadow-sm">Gerador de Documentos</h1>
              <p className="text-primary-foreground/90 text-sm mt-1 font-medium">Certificados e Formulários Profissionais</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-white hover:bg-white/20 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="certificados" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-card shadow-md border">
            <TabsTrigger value="certificados" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <GraduationCap className="w-4 h-4" />
              Certificados
            </TabsTrigger>
            <TabsTrigger value="formularios" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <FileText className="w-4 h-4" />
              Formulários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="certificados" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-6">
                <FileUploadSection
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
              {/* Template Manager */}
              <TemplateManager />
              
              {/* Preview Section */}
              <LivePreview />
              
              {/* Configuration Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SignatureConfigSection />
                <FontConfigSection />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6">
              <ActionButtons />
            </div>
          </TabsContent>

          <TabsContent value="formularios">
            <FormPage />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-sm border-t border-border mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-muted-foreground text-sm font-medium">
              Gerador de Documentos v4.2
            </p>
            <p className="text-center text-muted-foreground/70 text-xs">
              Sistema Profissional de Certificados e Formulários
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
