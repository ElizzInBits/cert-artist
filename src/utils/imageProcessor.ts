/**
 * Utilitário para processamento otimizado de imagens de assinatura
 * Resolve problemas de qualidade e corte das imagens
 */

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maintainAspectRatio?: boolean;
  removeBackground?: boolean;
  outputFormat?: 'png' | 'jpeg';
}

export interface ProcessedImageResult {
  file: File;
  base64: string;
  dimensions: {
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  };
  quality: 'low' | 'medium' | 'high';
}

/**
 * Processa uma imagem de assinatura com alta qualidade
 */
export const processSignatureImage = async (
  imageFile: File,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImageResult> => {
  const {
    maxWidth = 800,
    maxHeight = 400,
    quality = 0.95,
    maintainAspectRatio = true,
    removeBackground = true,
    outputFormat = 'png'
  } = options;

  return new Promise((resolve, reject) => {
    if (!(imageFile instanceof File)) {
      reject(new Error('Input deve ser um File válido'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { 
      alpha: true,
      willReadFrequently: false 
    });
    
    if (!ctx) {
      reject(new Error('Não foi possível criar contexto do canvas'));
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      try {
        const originalWidth = img.width;
        const originalHeight = img.height;
        
        // Validar dimensões mínimas
        if (originalWidth < 50 || originalHeight < 25) {
          reject(new Error('Imagem muito pequena. Mínimo: 50x25 pixels'));
          return;
        }

        // Calcular dimensões otimizadas
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;

        if (maintainAspectRatio) {
          const aspectRatio = originalWidth / originalHeight;
          
          if (originalWidth > maxWidth) {
            targetWidth = maxWidth;
            targetHeight = maxWidth / aspectRatio;
          }
          
          if (targetHeight > maxHeight) {
            targetHeight = maxHeight;
            targetWidth = maxHeight * aspectRatio;
          }
        } else {
          targetWidth = Math.min(originalWidth, maxWidth);
          targetHeight = Math.min(originalHeight, maxHeight);
        }

        // Garantir dimensões inteiras
        targetWidth = Math.round(targetWidth);
        targetHeight = Math.round(targetHeight);

        // Configurar canvas com alta qualidade
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Configurações de alta qualidade
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Limpar canvas
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        
        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Remover fundo se solicitado
        if (removeBackground) {
          removeImageBackground(ctx, targetWidth, targetHeight);
        }

        // Determinar qualidade baseada na resolução final
        const totalPixels = targetWidth * targetHeight;
        let imageQuality: 'low' | 'medium' | 'high';
        if (totalPixels > 100000) imageQuality = 'high';
        else if (totalPixels > 25000) imageQuality = 'medium';
        else imageQuality = 'low';

        // Converter para blob com alta qualidade
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Falha ao gerar blob da imagem processada'));
            return;
          }

          // Criar File otimizado
          const processedFile = new File([blob], `signature.${outputFormat}`, {
            type: `image/${outputFormat}`,
            lastModified: Date.now()
          });

          // Converter para base64 de alta qualidade
          const reader = new FileReader();
          reader.onload = () => {
            const base64Result = reader.result as string;
            const base64Data = base64Result.split(',')[1];

            resolve({
              file: processedFile,
              base64: base64Data,
              dimensions: {
                width: targetWidth,
                height: targetHeight,
                originalWidth,
                originalHeight
              },
              quality: imageQuality
            });
          };
          reader.onerror = () => reject(new Error('Erro ao converter para base64'));
          reader.readAsDataURL(blob);
          
        }, `image/${outputFormat}`, quality);

      } catch (error) {
        reject(new Error(`Erro no processamento: ${error.message}`));
      }
    };

    img.onerror = () => {
      reject(new Error('Erro ao carregar imagem'));
    };

    // Carregar imagem
    const objectUrl = URL.createObjectURL(imageFile);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      img.onload(); // Chamar o handler original
    };
    img.src = objectUrl;
  });
};

/**
 * Remove fundo da imagem de forma inteligente
 */
const removeImageBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Detectar cor de fundo analisando as bordas
  const borderPixels = [];
  
  // Coletar pixels das bordas
  for (let x = 0; x < width; x++) {
    // Borda superior
    const topIdx = (0 * width + x) * 4;
    borderPixels.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);
    
    // Borda inferior
    const bottomIdx = ((height - 1) * width + x) * 4;
    borderPixels.push([data[bottomIdx], data[bottomIdx + 1], data[bottomIdx + 2]]);
  }
  
  for (let y = 0; y < height; y++) {
    // Borda esquerda
    const leftIdx = (y * width + 0) * 4;
    borderPixels.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);
    
    // Borda direita
    const rightIdx = (y * width + (width - 1)) * 4;
    borderPixels.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
  }

  // Calcular cor de fundo média
  let avgR = 0, avgG = 0, avgB = 0;
  borderPixels.forEach(([r, g, b]) => {
    avgR += r;
    avgG += g;
    avgB += b;
  });
  
  const pixelCount = borderPixels.length;
  avgR = Math.round(avgR / pixelCount);
  avgG = Math.round(avgG / pixelCount);
  avgB = Math.round(avgB / pixelCount);

  // Remover pixels similares ao fundo
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calcular distância da cor de fundo
    const distance = Math.sqrt(
      Math.pow(r - avgR, 2) + 
      Math.pow(g - avgG, 2) + 
      Math.pow(b - avgB, 2)
    );
    
    // Limiar para remoção de fundo
    const threshold = 60;
    const fadeThreshold = 100;
    
    if (distance < threshold) {
      // Tornar completamente transparente
      data[i + 3] = 0;
    } else if (distance < fadeThreshold) {
      // Transição suave nas bordas
      const alpha = Math.round(((distance - threshold) / (fadeThreshold - threshold)) * 255);
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Converte base64 para File com validação
 */
export const base64ToFile = (base64: string, mimeType: string, filename: string): File => {
  try {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: mimeType });
  } catch (error) {
    throw new Error(`Erro ao converter base64 para File: ${error.message}`);
  }
};

/**
 * Valida se um arquivo é uma imagem válida
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato não suportado. Use PNG, JPG ou WebP.'
    };
  }
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Arquivo muito grande. Máximo: 10MB.'
    };
  }
  
  return { valid: true };
};

/**
 * Otimiza imagem para uso em PDF
 */
export const optimizeForPDF = async (imageFile: File): Promise<ProcessedImageResult> => {
  return processSignatureImage(imageFile, {
    maxWidth: 600,
    maxHeight: 300,
    quality: 0.98,
    maintainAspectRatio: true,
    removeBackground: true,
    outputFormat: 'png'
  });
};