import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Save, FolderOpen, Trash2, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTemplates } from "@/hooks/useTemplates"
import { useCertificateStore } from "@/hooks/useCertificateStore"

export const TemplateManager = () => {
  const { toast } = useToast()
  const { templates, loading, saveTemplate, loadTemplate, deleteTemplate } = useTemplates()
  const { config, setConfig } = useCertificateStore()
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [loadDialogOpen, setLoadDialogOpen] = useState(false)
  const [templateName, setTemplateName] = useState("")

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para o template",
        variant: "destructive"
      })
      return
    }

    try {
      await saveTemplate(templateName, config)
      toast({
        title: "Template salvo",
        description: `Template "${templateName}" salvo com sucesso!`
      })
      setTemplateName("")
      setSaveDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o template",
        variant: "destructive"
      })
    }
  }

  const handleLoad = async (id: string, name: string) => {
    try {
      const loadedConfig = await loadTemplate(id)
      setConfig(loadedConfig)
      toast({
        title: "Template carregado",
        description: `Template "${name}" carregado com sucesso!`
      })
      setLoadDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar o template",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteTemplate(id)
      toast({
        title: "Template excluído",
        description: `Template "${name}" excluído com sucesso!`
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o template",
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💾 Gerenciar Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Template
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby="save-template-description">
              <DialogHeader>
                <DialogTitle>Salvar Template</DialogTitle>
                <DialogDescription id="save-template-description">
                  Salve a configuração atual como um template para reutilizar posteriormente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nome do template"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FolderOpen className="w-4 h-4" />
                Carregar Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" aria-describedby="load-template-description">
              <DialogHeader>
                <DialogTitle>Carregar Template</DialogTitle>
                <DialogDescription id="load-template-description">
                  Selecione um template salvo para carregar suas configurações.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {loading ? (
                  <p>Carregando templates...</p>
                ) : templates.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum template salvo ainda
                  </p>
                ) : (
                  templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(template.updatedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleLoad(template.id, template.name)}
                        >
                          Carregar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(template.id, template.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}