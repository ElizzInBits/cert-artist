/**
 * Processador de imagem simplificado focado em preservar qualidade
 */

export const processSignatureSimple = async (imageFile: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!(imageFile instanceof File)) {
      reject(new Error('Input não é um File válido'));
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
    
    const processImage = () => {
      try {
        const originalWidth = img.width;
        const originalHeight = img.height;
        
        // Calcular dimensões otimizadas mantendo proporção
        const maxWidth = 400;
        const maxHeight = 200;
        const aspectRatio = originalWidth / originalHeight;
        
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;
        
        if (originalWidth > maxWidth) {
          targetWidth = maxWidth;
          targetHeight = maxWidth / aspectRatio;
        }
        
        if (targetHeight > maxHeight) {
          targetHeight = maxHeight;
          targetWidth = maxHeight * aspectRatio;
        }
        
        // Garantir dimensões inteiras
        targetWidth = Math.round(targetWidth);
        targetHeight = Math.round(targetHeight);

        // Configurar canvas
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Configurações de máxima qualidade
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Limpar canvas
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        
        // Desenhar imagem com máxima qualidade
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Converter para blob com qualidade máxima
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Falha ao gerar blob'));
            return;
          }

          const processedFile = new File([blob], 'signature.png', {
            type: 'image/png',
            lastModified: Date.now()
          });

          resolve(processedFile);
        }, 'image/png', 1.0);

      } catch (error) {
        reject(new Error(`Erro no processamento: ${error.message}`));
      }
    };

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      processImage();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Erro ao carregar imagem'));
    };

    // Carregar imagem
    const objectUrl = URL.createObjectURL(imageFile);
    img.src = objectUrl;
  });
};