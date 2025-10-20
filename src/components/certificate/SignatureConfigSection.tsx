import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pen, RotateCcw, Move, Maximize2, Zap, Eye, AlertCircle, Settings2 } from "lucide-react";
import { useCertificateStore } from "@/hooks/useCertificateStore";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface ImageAnalysis {
  originalWidth: number;
  originalHeight: number;
  aspectRatio: number;
  recommendedWidth: number;
  recommendedHeight: number;
  quality: 'low' | 'medium' | 'high';
}

const signaturePresets = {
  compact: { 
    width: 100, 
    height: 50, 
    offsetY: 0,
    name: 'Compacta',
    description: 'Pequena e discreta'
  },
  standard: { 
    width: 140, 
    height: 70, 
    offsetY: 0,
    name: 'Padrão',
    description: 'Equilibrada'
  },
  professional: { 
    width: 180, 
    height: 90, 
    offsetY: -50,
    name: 'Profissional',
    description: 'Destacada no topo'
  },
  executive: { 
    width: 200, 
    height: 100, 
    offsetY: 100,
    name: 'Executiva',
    description: 'Grande na base'
  },
  minimal: { 
    width: 80, 
    height: 40, 
    offsetY: 0,
    name: 'Minimalista',
    description: 'Muito sutil'
  },
  signature_only: { 
    width: 160, 
    height: 60, 
    offsetY: -100,
    name: 'Só Assinatura',
    description: 'Foco superior'
  }
};

export const SignatureConfigSection = () => {
  const { signatureConfig, setSignatureConfig, responsibles } = useCertificateStore();
  const { toast } = useToast();
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analisar imagens de assinatura quando responsáveis mudarem
  useEffect(() => {
    analyzeSignatureImages();
  }, [responsibles]);

  const analyzeSignatureImages = async () => {
    if (!responsibles || responsibles.length === 0) {
      setImageAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Encontrar a primeira assinatura válida
      const responsibleWithSignature = responsibles.find(r => r.assinatura);
      
      if (!responsibleWithSignature?.assinatura) {
        setImageAnalysis(null);
        setIsAnalyzing(false);
        return;
      }

      let imageUrl: string;
      
      // Verificar se é um File ou uma string
      if (responsibleWithSignature.assinatura instanceof File) {
        // Converter File para URL
        imageUrl = URL.createObjectURL(responsibleWithSignature.assinatura);
      } else if (typeof responsibleWithSignature.assinatura === 'string') {
        imageUrl = responsibleWithSignature.assinatura;
      } else {
        // Usar análise padrão se não conseguir determinar o tipo
        const defaultAnalysis: ImageAnalysis = {
          originalWidth: 200,
          originalHeight: 100,
          aspectRatio: 2,
          recommendedWidth: 120,
          recommendedHeight: 60,
          quality: 'medium'
        };
        setImageAnalysis(defaultAnalysis);
        setIsAnalyzing(false);
        return;
      }

      // Criar uma imagem temporária para análise
      const img = new Image();
      img.onload = () => {
        const analysis = analyzeImage(img);
        setImageAnalysis(analysis);
        setIsAnalyzing(false);
        
        // Limpar URL se foi criada a partir de File
        if (responsibleWithSignature.assinatura instanceof File) {
          URL.revokeObjectURL(imageUrl);
        }
      };
      img.onerror = () => {
        setIsAnalyzing(false);
        // Usar análise padrão em caso de erro
        const defaultAnalysis: ImageAnalysis = {
          originalWidth: 200,
          originalHeight: 100,
          aspectRatio: 2,
          recommendedWidth: 120,
          recommendedHeight: 60,
          quality: 'medium'
        };
        setImageAnalysis(defaultAnalysis);
        
        // Limpar URL se foi criada a partir de File
        if (responsibleWithSignature.assinatura instanceof File) {
          URL.revokeObjectURL(imageUrl);
        }
      };
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
    } catch (error) {
      setIsAnalyzing(false);
      console.log('Erro ao analisar imagem:', error);
    }
  };

  const analyzeImage = (img: HTMLImageElement): ImageAnalysis => {
    const { width, height } = img;
    const aspectRatio = width / height;
    
    // Calcular tamanho recomendado baseado no tamanho original
    let recommendedWidth: number;
    let recommendedHeight: number;
    let quality: 'low' | 'medium' | 'high';

    // Determinar qualidade baseada na resolução
    const totalPixels = width * height;
    if (totalPixels > 50000) quality = 'high';
    else if (totalPixels > 10000) quality = 'medium';
    else quality = 'low';

    // Calcular tamanho recomendado (otimizado para certificados)
    if (width > 300) {
      // Imagem grande - reduzir proporcionalmente
      recommendedWidth = Math.min(200, width * 0.4);
    } else if (width > 150) {
      // Imagem média - ajuste moderado
      recommendedWidth = Math.min(160, width * 0.8);
    } else {
      // Imagem pequena - usar tamanho próximo ao original
      recommendedWidth = Math.max(80, width);
    }

    recommendedHeight = Math.round(recommendedWidth / aspectRatio);

    // Garantir limites mínimos e máximos
    recommendedWidth = Math.max(60, Math.min(300, recommendedWidth));
    recommendedHeight = Math.max(30, Math.min(150, recommendedHeight));

    return {
      originalWidth: width,
      originalHeight: height,
      aspectRatio,
      recommendedWidth,
      recommendedHeight,
      quality
    };
  };

  const applyRecommendedSize = () => {
    if (!imageAnalysis) return;
    
    setSignatureConfig({
      width: imageAnalysis.recommendedWidth,
      height: imageAnalysis.recommendedHeight
    });

    toast({
      title: "Configuração aplicada",
      description: `Tamanho otimizado: ${imageAnalysis.recommendedWidth}×${imageAnalysis.recommendedHeight}px`
    });
  };

  const applyPreset = (presetKey: keyof typeof signaturePresets) => {
    const preset = signaturePresets[presetKey];
    setSignatureConfig({
      width: preset.width,
      height: preset.height,
      offsetY: preset.offsetY
    });

    toast({
      title: `Preset ${preset.name} aplicado`,
      description: preset.description
    });
  };

  const handleReset = () => {
    setSignatureConfig({ width: 120, height: 60, offsetY: 0 });
    toast({
      title: "Configurações resetadas",
      description: "Assinatura restaurada ao padrão"
    });
  };

  const handleCustomValue = (field: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setSignatureConfig({ [field]: numValue });
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityText = (quality: string) => {
    switch (quality) {
      case 'high': return 'Alta Qualidade';
      case 'medium': return 'Qualidade Média';
      case 'low': return 'Baixa Qualidade';
      default: return 'Desconhecida';
    }
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pen className="w-5 h-5 text-primary" />
          Configurações de Assinatura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Análise Inteligente */}
        {imageAnalysis && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <Label className="text-sm font-medium text-blue-900">Análise da Imagem</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Tamanho Original:</span>
                <div className="font-medium">{imageAnalysis.originalWidth}×{imageAnalysis.originalHeight}px</div>
              </div>
              <div>
                <span className="text-muted-foreground">Qualidade:</span>
                <div>
                  <Badge className={getQualityColor(imageAnalysis.quality)}>
                    {getQualityText(imageAnalysis.quality)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">Tamanho Recomendado:</span>
                <div className="font-medium text-blue-900">
                  {imageAnalysis.recommendedWidth}×{imageAnalysis.recommendedHeight}px
                </div>
              </div>
              <Button 
                onClick={applyRecommendedSize} 
                size="sm" 
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Zap className="w-4 h-4" />
                Aplicar
              </Button>
            </div>

            {imageAnalysis.quality === 'low' && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-800">
                  <strong>Dica:</strong> Para melhor qualidade, use uma imagem com pelo menos 200×100px
                </div>
              </div>
            )}
          </div>
        )}

        {isAnalyzing && (
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-muted-foreground">Analisando imagem de assinatura...</span>
          </div>
        )}

        {!imageAnalysis && !isAnalyzing && (
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Adicione uma assinatura nos responsáveis para análise automática
            </span>
          </div>
        )}

        {/* Presets Personalizados */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Presets Personalizados</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(signaturePresets).map(([key, preset]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(key as keyof typeof signaturePresets)}
                className="flex flex-col items-start p-3 h-auto text-left"
              >
                <div className="font-medium text-xs">{preset.name}</div>
                <div className="text-xs text-muted-foreground">{preset.description}</div>
                <div className="text-xs text-blue-600 mt-1">
                  {preset.width}×{preset.height}px
                  {preset.offsetY !== 0 && ` (${preset.offsetY > 0 ? '+' : ''}${preset.offsetY}px)`}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Configurações Manuais */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Ajuste Manual</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Largura</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={signatureConfig.width}
                    onChange={(e) => handleCustomValue('width', e.target.value)}
                    className="w-16 h-7 text-xs"
                    min={30}
                    max={400}
                  />
                  <span className="text-xs text-muted-foreground">px</span>
                </div>
              </div>
              <Slider
                value={[signatureConfig.width]}
                onValueChange={([value]) => setSignatureConfig({ width: value })}
                min={30}
                max={400}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Altura</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={signatureConfig.height}
                    onChange={(e) => handleCustomValue('height', e.target.value)}
                    className="w-16 h-7 text-xs"
                    min={15}
                    max={200}
                  />
                  <span className="text-xs text-muted-foreground">px</span>
                </div>
              </div>
              <Slider
                value={[signatureConfig.height]}
                onValueChange={([value]) => setSignatureConfig({ height: value })}
                min={15}
                max={200}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Posicionamento Vertical</Label>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Deslocamento Y</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={signatureConfig.offsetY}
                  onChange={(e) => handleCustomValue('offsetY', e.target.value)}
                  className="w-16 h-7 text-xs"
                  min={-600}
                  max={600}
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
            </div>
            <Slider
              value={[signatureConfig.offsetY]}
              onValueChange={([value]) => setSignatureConfig({ offsetY: value })}
              min={-600}
              max={600}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>↑ Mais alto</span>
              <span>Centro</span>
              <span>Mais baixo ↓</span>
            </div>
          </div>
        </div>

        {/* Preview e Reset */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Atual: {signatureConfig.width}×{signatureConfig.height}px
            {signatureConfig.offsetY !== 0 && (
              <span className="ml-2">
                ({signatureConfig.offsetY > 0 ? '+' : ''}{signatureConfig.offsetY}px)
              </span>
            )}
          </div>
          <Button onClick={handleReset} variant="outline" size="sm" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};