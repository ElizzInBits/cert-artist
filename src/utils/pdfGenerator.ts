import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Employee, CertificateConfig } from '@/types/certificate';

// Função para processar imagem com remoção inteligente de fundo
const processSignatureImage = async (imageFile: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Verificar se é realmente um File
    if (!(imageFile instanceof File)) {
      reject(new Error('Input não é um File válido'));
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const scale = Math.max(1, 400 / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Detectar cor de fundo automaticamente (cantos da imagem)
      const corners = [
        [0, 0], [canvas.width - 1, 0], 
        [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1]
      ];
      
      let bgR = 0, bgG = 0, bgB = 0;
      corners.forEach(([x, y]) => {
        const idx = (y * canvas.width + x) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      });
      
      bgR /= 4; bgG /= 4; bgB /= 4;
      
      // Remover pixels similares ao fundo detectado
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const distance = Math.sqrt(
          Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
        );
        
        // Se muito similar ao fundo, tornar transparente
        if (distance < 50) {
          data[i + 3] = 0;
        } else if (distance < 80) {
          // Transição suave para bordas
          data[i + 3] = Math.floor((distance - 50) * 255 / 30);
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
    };
    
    img.onerror = () => {
      reject(new Error('Erro ao carregar imagem'));
    };
    
    try {
      img.src = URL.createObjectURL(imageFile);
    } catch (error) {
      reject(new Error('Erro ao criar URL da imagem'));
    }
  });
};

// Função auxiliar para quebrar texto em linhas
const splitTextToLines = (text: string, font: any, fontSize: number, maxWidth: number): string[] => {
  const cleanText = text.replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleanText.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word);
      }
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
};

export const generateCertificatePDF = async (
  employee: Employee,
  config: CertificateConfig
): Promise<Blob> => {
  try {
    console.log('Gerando certificado para:', employee.nome);
    
    // Determinar qual modelo usar
    const modelPath = config.useObservacoes 
      ? '/modelos_certificados/Modelo Certificado-Base-2.pdf'
      : '/modelos_certificados/Modelo Certificado-Base.pdf';
    
    let basePdf: PDFDocument;
    
    try {
      const modelResponse = await fetch(modelPath);
      if (!modelResponse.ok) {
        throw new Error(`Modelo não encontrado: ${modelPath}`);
      }
      const modelBytes = await modelResponse.arrayBuffer();
      basePdf = await PDFDocument.load(modelBytes);
    } catch (error) {
      // Criar PDF simples se modelo não encontrado
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      page.drawText(`Certificado para: ${employee.nome}`, {
        x: 50,
        y: 750,
        size: 16,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: 'application/pdf' });
    }
    
    // Modificar o PDF base
    const helveticaFont = await basePdf.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await basePdf.embedFont(StandardFonts.HelveticaBold);
    
    // Página 1
    const page1 = basePdf.getPageCount() > 0 ? basePdf.getPage(0) : null;
    if (page1) {
      
      // "Conferido a: "
      page1.drawText('Conferido a: ', {
        x: 270,
        y: 630,
        size: config.fontConfig?.nome || 16,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Nome centralizado
      const nome = employee.nome.toUpperCase();
      const nomeWidth = helveticaBoldFont.widthOfTextAtSize(nome, config.fontConfig?.nome || 16);
      const nomeX = (595.28 - nomeWidth) / 2;
      page1.drawText(nome, {
        x: nomeX,
        y: 600,
        size: config.fontConfig?.nome || 16,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });
      
      // Documento de Identificação
      page1.drawText('Documento de', {
        x: 60,
        y: 519,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page1.drawText('Identificação:', {
        x: 60,
        y: 506,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // CPF
      page1.drawText(employee.cpf || 'XXX.XXX.XXX-XX', {
        x: 156,
        y: 513,
        size: config.fontConfig?.cpf || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Nome do Curso
      page1.drawText('Nome do Curso:', {
        x: 60,
        y: 467,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Curso com quebra automática
      const curso = (config.courseData?.curso || '').toUpperCase();
      const cursoLines = splitTextToLines(curso, helveticaFont, config.fontConfig?.nome_curso || 12, 350);
      let yCursoAtual = 467;
      cursoLines.forEach((linha) => {
        page1.drawText(linha, {
          x: 156,
          y: yCursoAtual,
          size: config.fontConfig?.nome_curso || 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yCursoAtual -= 15;
      });
      
      // Calcular ajuste Y
      const ajusteY = (cursoLines.length - 1) * 15;
      
      // Empresa
      const yEmpresa = 429 - ajusteY;
      page1.drawText('Empresa:', {
        x: 60,
        y: yEmpresa,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page1.drawText((config.courseData?.empresa || '').toUpperCase(), {
        x: 156,
        y: yEmpresa - 2,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Modalidade
      const yModalidade = yEmpresa - 40;
      page1.drawText('Modalidade de', {
        x: 60,
        y: yModalidade + 7,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page1.drawText('treinamento:', {
        x: 60,
        y: yModalidade - 8,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Modalidade valor
      const modalidadeLines = splitTextToLines((config.courseData?.modalidade || '').toUpperCase(), helveticaFont, config.fontConfig?.campos || 12, 140);
      let yModalidadeAtual = yModalidade;
      modalidadeLines.slice(0, 2).forEach((linha) => {
        page1.drawText(linha, {
          x: 156,
          y: yModalidadeAtual,
          size: config.fontConfig?.campos || 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yModalidadeAtual -= 12;
      });
      
      // Tipo de Treinamento
      page1.drawText('Tipo de', {
        x: 310,
        y: yModalidade + 11,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page1.drawText('Treinamento:', {
        x: 310,
        y: yModalidade - 4,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Tipo valor
      const tipoLines = splitTextToLines((config.courseData?.tipo || '').toUpperCase(), helveticaFont, config.fontConfig?.campos || 12, 130);
      let yTipoAtual = yModalidade + 6;
      tipoLines.slice(0, 2).forEach((linha) => {
        page1.drawText(linha, {
          x: 400,
          y: yTipoAtual,
          size: config.fontConfig?.campos || 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yTipoAtual -= 12;
      });
      
      // Carga Horária e Período
      const maxLinhasUsadas = Math.max(modalidadeLines.length, tipoLines.length);
      const ajusteYModalidade = (maxLinhasUsadas - 1) * 12;
      const yCarga = yModalidade - 50 - ajusteYModalidade;
      
      page1.drawText('Carga Horária', {
        x: 60,
        y: yCarga + 8,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page1.drawText('Realizada:', {
        x: 60,
        y: yCarga - 7,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Carga Horária valor
      const cargaLines = splitTextToLines((config.courseData?.cargaHoraria || '').toUpperCase(), helveticaFont, config.fontConfig?.campos || 12, 140);
      let yCargaAtual = yCarga + 1;
      cargaLines.slice(0, 2).forEach((linha) => {
        page1.drawText(linha, {
          x: 156,
          y: yCargaAtual,
          size: config.fontConfig?.campos || 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yCargaAtual -= 12;
      });
      
      // Período de Treinamento
      page1.drawText('Período de', {
        x: 310,
        y: yCarga + 8,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page1.drawText('Treinamento:', {
        x: 310,
        y: yCarga - 7,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Período valor
      const periodoLines = splitTextToLines((config.courseData?.periodo || '').toUpperCase(), helveticaFont, config.fontConfig?.campos || 12, 140);
      let yPeriodoAtual = yCarga + 1;
      periodoLines.slice(0, 2).forEach((linha) => {
        page1.drawText(linha, {
          x: 400,
          y: yPeriodoAtual,
          size: config.fontConfig?.campos || 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yPeriodoAtual -= 12;
      });
      
      // Conformidade
      const maxLinhasCargaPeriodo = Math.max(cargaLines.length, periodoLines.length);
      const ajusteYFinal = (maxLinhasCargaPeriodo - 1) * 12;
      const yConformidade = yCarga - 40 - ajusteYFinal;
      
      page1.drawText('Em conformidade:', {
        x: 60,
        y: yConformidade,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Conformidade texto
      if (config.conformidade) {
        const confLines = splitTextToLines(config.conformidade.toUpperCase(), helveticaFont, config.fontConfig?.conformidade || 10, 480);
        let yTexto = yConformidade - 15;
        confLines.forEach((linha) => {
          page1.drawText(linha, {
            x: 60,
            y: yTexto,
            size: config.fontConfig?.conformidade || 10,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          yTexto -= (config.fontConfig?.conformidade || 10) + 2;
        });
      }
    }
    
    // Página 2 - Conteúdo e equipe
    if (basePdf.getPageCount() > 1) {
      const page2 = basePdf.getPage(1);
      
      // Conteúdo Programático
      if (config.conteudo) {
        let tamanhoConteudo = config.fontConfig?.conteudo || 12;
        const yLimiteConteudo = 470;
        const yConteudoInicial = 660;
        
        // Ajuste automático de fonte
        while (tamanhoConteudo >= 8) {
          const linhasConteudo = splitTextToLines(config.conteudo, helveticaFont, tamanhoConteudo, 515);
          const alturaNecessaria = linhasConteudo.length * (tamanhoConteudo + 4);
          
          if (yConteudoInicial - alturaNecessaria >= yLimiteConteudo) {
            break;
          }
          tamanhoConteudo -= 1;
        }
        
        const conteudoLines = splitTextToLines(config.conteudo, helveticaFont, tamanhoConteudo, 515);
        let yConteudo = yConteudoInicial;
        
        conteudoLines.forEach((linha) => {
          if (yConteudo >= yLimiteConteudo) {
            page2.drawText(linha, {
              x: 40,
              y: yConteudo,
              size: tamanhoConteudo,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
            yConteudo -= (tamanhoConteudo + 4);
          }
        });
      }
      
      // Instrutores
      if (config.instructors && config.instructors.length > 0) {
        let yInst = 430;
        config.instructors.forEach((instrutor) => {
          const registroInfo = instrutor.registro ? ` - ${instrutor.registro}` : '';
          const textoInstrutor = `${instrutor.nome}${registroInfo}`;
          const instLines = splitTextToLines(textoInstrutor, helveticaFont, config.fontConfig?.instrutores || 12, 515);
          
          instLines.forEach((linha) => {
            if (yInst > 50) {
              page2.drawText(linha, {
                x: 40,
                y: yInst,
                size: config.fontConfig?.instrutores || 12,
                font: helveticaFont,
                color: rgb(0, 0, 0),
              });
              yInst -= (config.fontConfig?.instrutores || 12) + 4;
            }
          });
          yInst -= 4;
        });
      }
      
      // Responsáveis Técnicos
      if (config.responsibles && config.responsibles.length > 0) {
        let yResp = 320;
        config.responsibles.forEach((responsavel) => {
          const registroInfo = responsavel.registro ? ` - ${responsavel.registro}` : '';
          const textoResponsavel = `${responsavel.nome}${registroInfo}`;
          const respLines = splitTextToLines(textoResponsavel, helveticaFont, config.fontConfig?.responsaveis || 12, 515);
          
          respLines.forEach((linha) => {
            if (yResp > 50) {
              page2.drawText(linha, {
                x: 40,
                y: yResp,
                size: config.fontConfig?.responsaveis || 12,
                font: helveticaFont,
                color: rgb(0, 0, 0),
              });
              yResp -= (config.fontConfig?.responsaveis || 12) + 4;
            }
          });
          yResp -= 4;
        });
      }
      
      // Aproveitamento
      if (config.courseData?.aproveitamento) {
        const aprovLines = splitTextToLines(config.courseData.aproveitamento, helveticaFont, config.fontConfig?.aproveitamento || 12, 515);
        let yAproveitamento = 220;
        
        aprovLines.forEach((linha) => {
          if (yAproveitamento > 50) {
            page2.drawText(linha, {
              x: 40,
              y: yAproveitamento,
              size: config.fontConfig?.aproveitamento || 12,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
            yAproveitamento -= (config.fontConfig?.aproveitamento || 12) + 4;
          }
        });
      }
    }
    
    // Linhas de assinatura na primeira página - Responsáveis Técnicos e Aluno
    if (page1) {
      const numResponsaveis = config.responsibles ? config.responsibles.length : 0;
      
      if (numResponsaveis > 0) {
        let yAssinaturaBase;
        
        if (numResponsaveis === 1) {
          // Uma assinatura: responsável e aluno na mesma linha
          yAssinaturaBase = 130;
          const larguraAssinatura = 180;
          const xResponsavel = 80;
          
          // Linha do responsável
          page1.drawLine({
            start: { x: xResponsavel, y: yAssinaturaBase },
            end: { x: xResponsavel + larguraAssinatura, y: yAssinaturaBase },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          // Imagem da assinatura do responsável (se disponível)
          const responsavel = config.responsibles[0];
          if (responsavel?.assinatura && responsavel.assinatura instanceof File) {
            try {
              console.log('Processando assinatura:', responsavel.assinatura.name);
              // Processar imagem com alta qualidade
              const processedImage = await processSignatureImage(responsavel.assinatura);
              const assinaturaBytes = await processedImage.arrayBuffer();
              let assinaturaImage;
              
              // Tentar diferentes formatos de imagem
              try {
                assinaturaImage = await basePdf.embedPng(assinaturaBytes);
              } catch {
                try {
                  assinaturaImage = await basePdf.embedJpg(assinaturaBytes);
                } catch {
                  console.warn('Formato de imagem não suportado');
                }
              }
              
              if (assinaturaImage) {
                const maxWidth = config.signatureConfig?.width || 120;
                const maxHeight = config.signatureConfig?.height || 40;
                const offsetY = config.signatureConfig?.offsetY || 15;
                
                console.log('Signature config:', { maxWidth, maxHeight, offsetY });
                
                // Calcular dimensões mantendo proporção
                const originalWidth = assinaturaImage.width;
                const originalHeight = assinaturaImage.height;
                const aspectRatio = originalWidth / originalHeight;
                
                let finalWidth = maxWidth;
                let finalHeight = maxWidth / aspectRatio;
                
                if (finalHeight > maxHeight) {
                  finalHeight = maxHeight;
                  finalWidth = maxHeight * aspectRatio;
                }
                
                page1.drawImage(assinaturaImage, {
                  x: xResponsavel + (larguraAssinatura - finalWidth) / 2,
                  y: yAssinaturaBase + offsetY,
                  width: finalWidth,
                  height: finalHeight,
                });
              }
            } catch (error) {
              console.error('Erro ao carregar assinatura:', error);
            }
          } else if (responsavel?.assinatura) {
            console.warn('Assinatura não é um File válido:', typeof responsavel.assinatura);
          }
          
          // Texto do responsável
          const textoResponsavel = 'RESPONSÁVEL TÉCNICO';
          const textoLargura = helveticaFont.widthOfTextAtSize(textoResponsavel, 10);
          const textoX = xResponsavel + (larguraAssinatura - textoLargura) / 2;
          page1.drawText(textoResponsavel, {
            x: textoX,
            y: yAssinaturaBase - 15,
            size: 10,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          
          // Linha do aluno (lado direito)
          const xAluno = 320;
          const larguraAluno = 200;
          page1.drawLine({
            start: { x: xAluno, y: yAssinaturaBase },
            end: { x: xAluno + larguraAluno, y: yAssinaturaBase },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          page1.drawText('ALUNO', {
            x: xAluno + 80,
            y: yAssinaturaBase - 15,
            size: 10,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          
        } else {
          // Múltiplas assinaturas: responsáveis em uma linha, aluno abaixo
          yAssinaturaBase = 150;
          const larguraDisponivel = 480;
          const larguraAssinatura = Math.min(140, larguraDisponivel / numResponsaveis);
          const espacoTotal = larguraDisponivel - (numResponsaveis * larguraAssinatura);
          const espacoEntre = Math.max(20, espacoTotal / (numResponsaveis + 1));
          const xInicial = 60 + espacoEntre;
          
          // Desenhar linhas dos responsáveis
          for (let i = 0; i < numResponsaveis; i++) {
            const xPos = xInicial + i * (larguraAssinatura + espacoEntre);
            
            // Linha do responsável
            page1.drawLine({
              start: { x: xPos, y: yAssinaturaBase },
              end: { x: xPos + larguraAssinatura, y: yAssinaturaBase },
              thickness: 1,
              color: rgb(0, 0, 0),
            });
            
            // Imagem da assinatura do responsável (se disponível)
            const responsavel = config.responsibles[i];
            if (responsavel?.assinatura && responsavel.assinatura instanceof File) {
              try {
                console.log('Processando assinatura múltipla:', responsavel.assinatura.name);
                // Processar imagem com alta qualidade
                const processedImage = await processSignatureImage(responsavel.assinatura);
                const assinaturaBytes = await processedImage.arrayBuffer();
                let assinaturaImage;
                
                // Tentar diferentes formatos de imagem
                try {
                  assinaturaImage = await basePdf.embedPng(assinaturaBytes);
                } catch {
                  try {
                    assinaturaImage = await basePdf.embedJpg(assinaturaBytes);
                  } catch {
                    console.warn('Formato de imagem não suportado');
                  }
                }
                
                if (assinaturaImage) {
                  const maxWidth = config.signatureConfig?.width || 100;
                  const maxHeight = config.signatureConfig?.height || 35;
                  const offsetY = config.signatureConfig?.offsetY || 15;
                  
                  console.log('Signature config (multiple):', { maxWidth, maxHeight, offsetY });
                  
                  // Calcular dimensões mantendo proporção
                  const originalWidth = assinaturaImage.width;
                  const originalHeight = assinaturaImage.height;
                  const aspectRatio = originalWidth / originalHeight;
                  
                  let finalWidth = maxWidth;
                  let finalHeight = maxWidth / aspectRatio;
                  
                  if (finalHeight > maxHeight) {
                    finalHeight = maxHeight;
                    finalWidth = maxHeight * aspectRatio;
                  }
                  
                  page1.drawImage(assinaturaImage, {
                    x: xPos + (larguraAssinatura - finalWidth) / 2,
                    y: yAssinaturaBase + offsetY,
                    width: finalWidth,
                    height: finalHeight,
                  });
                }
              } catch (error) {
                console.error('Erro ao carregar assinatura múltipla:', error);
              }
            } else if (responsavel?.assinatura) {
              console.warn('Assinatura múltipla não é um File válido:', typeof responsavel.assinatura);
            }
            
            // Texto do responsável
            const textoResponsavel = 'RESPONSÁVEL TÉCNICO';
            const textoLargura = helveticaFont.widthOfTextAtSize(textoResponsavel, 10);
            const textoX = xPos + (larguraAssinatura - textoLargura) / 2;
            page1.drawText(textoResponsavel, {
              x: textoX,
              y: yAssinaturaBase - 15,
              size: 10,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
          }
          
          // Linha do aluno abaixo dos responsáveis
          const yAluno = yAssinaturaBase - 60;
          const xAluno = 220;
          const larguraAluno = 200;
          page1.drawLine({
            start: { x: xAluno, y: yAluno },
            end: { x: xAluno + larguraAluno, y: yAluno },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          page1.drawText('ALUNO', {
            x: xAluno + 75,
            y: yAluno - 15,
            size: 10,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        }
      }
    }
    
    // Página 3 - Observações (se habilitada)
    if (config.useObservacoes && config.observacoes && basePdf.getPageCount() > 2) {
      const page3 = basePdf.getPage(2);
      
      const obsLines = splitTextToLines(config.observacoes, helveticaFont, config.fontConfig?.observacoes || 12, 515);
      let yObs = 630;
      
      obsLines.forEach((linha) => {
        if (yObs > 50) {
          page3.drawText(linha, {
            x: 40,
            y: yObs,
            size: config.fontConfig?.observacoes || 12,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          yObs -= (config.fontConfig?.observacoes || 12) + 4;
        }
      });
    }
    
    const pdfBytes = await basePdf.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error(`Erro ao gerar certificado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

export const generateAllCertificates = async (
  employees: Employee[],
  config: CertificateConfig,
  onProgress?: (current: number, total: number) => void
): Promise<Blob[]> => {
  const certificates: Blob[] = [];
  
  for (let i = 0; i < employees.length; i++) {
    const certificate = await generateCertificatePDF(employees[i], config);
    certificates.push(certificate);
    
    if (onProgress) {
      onProgress(i + 1, employees.length);
    }
  }
  
  return certificates;
};

export const downloadCertificate = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const previewCertificate = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};Modalidade + 6;
      tipoLines.slice(0, 2).forEach((linha) => {
        page1.drawText(linha, {
          x: 400,
          y: yTipoAtual,
          size: config.fontConfig?.campos || 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yTipoAtual -= 12;
      });
      
      // Carga Horária e Período
      const maxLinhasUsadas = Math.max(modalidadeLines.length, tipoLines.length);
      const ajusteYModalidade = (maxLinhasUsadas - 1) * 12;
      const yCarga = yModalidade - 50 - ajusteYModalidade;
      
      page1.drawText('Carga Horária', {
        x: 60,
        y: yCarga + 8,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page1.drawText('Realizada:', {
        x: 60,
        y: yCarga - 7,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Carga Horária valor
      const cargaLines = splitTextToLines((config.courseData?.cargaHoraria || '').toUpperCase(), helveticaFont, config.fontConfig?.campos || 12, 140);
      let yCargaAtual = yCarga + 1;
      cargaLines.slice(0, 2).forEach((linha) => {
        page1.drawText(linha, {
          x: 156,
          y: yCargaAtual,
          size: config.fontConfig?.campos || 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yCargaAtual -= 12;
      });
      
      // Período de Treinamento
      page1.drawText('Período de', {
        x: 310,
        y: yCarga + 8,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page1.drawText('Treinamento:', {
        x: 310,
        y: yCarga - 7,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Período valor
      const periodoLines = splitTextToLines((config.courseData?.periodo || '').toUpperCase(), helveticaFont, config.fontConfig?.campos || 12, 140);
      let yPeriodoAtual = yCarga + 1;
      periodoLines.slice(0, 2).forEach((linha) => {
        page1.drawText(linha, {
          x: 400,
          y: yPeriodoAtual,
          size: config.fontConfig?.campos || 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yPeriodoAtual -= 12;
      });
      
      // Conformidade
      const maxLinhasCargaPeriodo = Math.max(cargaLines.length, periodoLines.length);
      const ajusteYFinal = (maxLinhasCargaPeriodo - 1) * 12;
      const yConformidade = yCarga - 40 - ajusteYFinal;
      
      page1.drawText('Em conformidade:', {
        x: 60,
        y: yConformidade,
        size: config.fontConfig?.campos || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Conformidade texto
      if (config.conformidade) {
        const confLines = splitTextToLines(config.conformidade.toUpperCase(), helveticaFont, config.fontConfig?.conformidade || 10, 480);
        let yTexto = yConformidade - 15;
        confLines.forEach((linha) => {
          page1.drawText(linha, {
            x: 60,
            y: yTexto,
            size: config.fontConfig?.conformidade || 10,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          yTexto -= (config.fontConfig?.conformidade || 10) + 2;
        });
      }
    }
    
    // Página 2 - Conteúdo e equipe
    if (basePdf.getPageCount() > 1) {
      const page2 = basePdf.getPage(1);
      
      // Conteúdo Programático
      if (config.conteudo) {
        let tamanhoConteudo = config.fontConfig?.conteudo || 12;
        const yLimiteConteudo = 470;
        const yConteudoInicial = 660;
        
        // Ajuste automático de fonte
        while (tamanhoConteudo >= 8) {
          const linhasConteudo = splitTextToLines(config.conteudo, helveticaFont, tamanhoConteudo, 515);
          const alturaNecessaria = linhasConteudo.length * (tamanhoConteudo + 4);
          
          if (yConteudoInicial - alturaNecessaria >= yLimiteConteudo) {
            break;
          }
          tamanhoConteudo -= 1;
        }
        
        const conteudoLines = splitTextToLines(config.conteudo, helveticaFont, tamanhoConteudo, 515);
        let yConteudo = yConteudoInicial;
        
        conteudoLines.forEach((linha) => {
          if (yConteudo >= yLimiteConteudo) {
            page2.drawText(linha, {
              x: 40,
              y: yConteudo,
              size: tamanhoConteudo,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
            yConteudo -= (tamanhoConteudo + 4);
          }
        });
      }
      
      // Instrutores
      if (config.instructors && config.instructors.length > 0) {
        let yInst = 430;
        config.instructors.forEach((instrutor) => {
          const registroInfo = instrutor.registro ? ` - ${instrutor.registro}` : '';
          const textoInstrutor = `${instrutor.nome}${registroInfo}`;
          const instLines = splitTextToLines(textoInstrutor, helveticaFont, config.fontConfig?.instrutores || 12, 515);
          
          instLines.forEach((linha) => {
            if (yInst > 50) {
              page2.drawText(linha, {
                x: 40,
                y: yInst,
                size: config.fontConfig?.instrutores || 12,
                font: helveticaFont,
                color: rgb(0, 0, 0),
              });
              yInst -= (config.fontConfig?.instrutores || 12) + 4;
            }
          });
          yInst -= 4;
        });
      }
      
      // Responsáveis Técnicos
      if (config.responsibles && config.responsibles.length > 0) {
        let yResp = 320;
        config.responsibles.forEach((responsavel) => {
          const registroInfo = responsavel.registro ? ` - ${responsavel.registro}` : '';
          const textoResponsavel = `${responsavel.nome}${registroInfo}`;
          const respLines = splitTextToLines(textoResponsavel, helveticaFont, config.fontConfig?.responsaveis || 12, 515);
          
          respLines.forEach((linha) => {
            if (yResp > 50) {
              page2.drawText(linha, {
                x: 40,
                y: yResp,
                size: config.fontConfig?.responsaveis || 12,
                font: helveticaFont,
                color: rgb(0, 0, 0),
              });
              yResp -= (config.fontConfig?.responsaveis || 12) + 4;
            }
          });
          yResp -= 4;
        });
      }
      
      // Aproveitamento
      if (config.courseData?.aproveitamento) {
        const aprovLines = splitTextToLines(config.courseData.aproveitamento, helveticaFont, config.fontConfig?.aproveitamento || 12, 515);
        let yAproveitamento = 220;
        
        aprovLines.forEach((linha) => {
          if (yAproveitamento > 50) {
            page2.drawText(linha, {
              x: 40,
              y: yAproveitamento,
              size: config.fontConfig?.aproveitamento || 12,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
            yAproveitamento -= (config.fontConfig?.aproveitamento || 12) + 4;
          }
        });
      }
    }
    
    // Linhas de assinatura na primeira página - Responsáveis Técnicos e Aluno
    if (page1) {
      const numResponsaveis = config.responsibles ? config.responsibles.length : 0;
      
      if (numResponsaveis > 0) {
        let yAssinaturaBase;
        
        if (numResponsaveis === 1) {
          // Uma assinatura: responsável e aluno na mesma linha
          yAssinaturaBase = 130;
          const larguraAssinatura = 180;
          const xResponsavel = 80;
          
          // Linha do responsável
          page1.drawLine({
            start: { x: xResponsavel, y: yAssinaturaBase },
            end: { x: xResponsavel + larguraAssinatura, y: yAssinaturaBase },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          // Imagem da assinatura do responsável (se disponível)
          const responsavel = config.responsibles[0];
          if (responsavel?.assinatura && responsavel.assinatura instanceof File) {
            try {
              console.log('Processando assinatura:', responsavel.assinatura.name);
              // Processar imagem com alta qualidade
              const processedImage = await processSignatureImage(responsavel.assinatura);
              const assinaturaBytes = await processedImage.arrayBuffer();
              let assinaturaImage;
              
              // Tentar diferentes formatos de imagem
              try {
                assinaturaImage = await basePdf.embedPng(assinaturaBytes);
              } catch {
                try {
                  assinaturaImage = await basePdf.embedJpg(assinaturaBytes);
                } catch {
                  console.warn('Formato de imagem não suportado');
                }
              }
              
              if (assinaturaImage) {
                const maxWidth = config.signatureConfig?.width || 120;
                const maxHeight = config.signatureConfig?.height || 40;
                const offsetY = config.signatureConfig?.offsetY || 15;
                
                console.log('Signature config:', { maxWidth, maxHeight, offsetY });
                
                // Calcular dimensões mantendo proporção
                const originalWidth = assinaturaImage.width;
                const originalHeight = assinaturaImage.height;
                const aspectRatio = originalWidth / originalHeight;
                
                let finalWidth = maxWidth;
                let finalHeight = maxWidth / aspectRatio;
                
                if (finalHeight > maxHeight) {
                  finalHeight = maxHeight;
                  finalWidth = maxHeight * aspectRatio;
                }
                
                page1.drawImage(assinaturaImage, {
                  x: xResponsavel + (larguraAssinatura - finalWidth) / 2,
                  y: yAssinaturaBase + offsetY,
                  width: finalWidth,
                  height: finalHeight,
                });
              }
            } catch (error) {
              console.error('Erro ao carregar assinatura:', error);
            }
          } else if (responsavel?.assinatura) {
            console.warn('Assinatura não é um File válido:', typeof responsavel.assinatura);
          }
          
          // Texto do responsável
          const textoResponsavel = 'RESPONSÁVEL TÉCNICO';
          const textoLargura = helveticaFont.widthOfTextAtSize(textoResponsavel, 10);
          const textoX = xResponsavel + (larguraAssinatura - textoLargura) / 2;
          page1.drawText(textoResponsavel, {
            x: textoX,
            y: yAssinaturaBase - 15,
            size: 10,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          
          // Linha do aluno (lado direito)
          const xAluno = 320;
          const larguraAluno = 200;
          page1.drawLine({
            start: { x: xAluno, y: yAssinaturaBase },
            end: { x: xAluno + larguraAluno, y: yAssinaturaBase },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          page1.drawText('ALUNO', {
            x: xAluno + 80,
            y: yAssinaturaBase - 15,
            size: 10,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          
        } else {
          // Múltiplas assinaturas: responsáveis em uma linha, aluno abaixo
          yAssinaturaBase = 150;
          const larguraDisponivel = 480;
          const larguraAssinatura = Math.min(140, larguraDisponivel / numResponsaveis);
          const espacoTotal = larguraDisponivel - (numResponsaveis * larguraAssinatura);
          const espacoEntre = Math.max(20, espacoTotal / (numResponsaveis + 1));
          const xInicial = 60 + espacoEntre;
          
          // Desenhar linhas dos responsáveis
          for (let i = 0; i < numResponsaveis; i++) {
            const xPos = xInicial + i * (larguraAssinatura + espacoEntre);
            
            // Linha do responsável
            page1.drawLine({
              start: { x: xPos, y: yAssinaturaBase },
              end: { x: xPos + larguraAssinatura, y: yAssinaturaBase },
              thickness: 1,
              color: rgb(0, 0, 0),
            });
            
            // Imagem da assinatura do responsável (se disponível)
            const responsavel = config.responsibles[i];
            if (responsavel?.assinatura && responsavel.assinatura instanceof File) {
              try {
                console.log('Processando assinatura múltipla:', responsavel.assinatura.name);
                // Processar imagem com alta qualidade
                const processedImage = await processSignatureImage(responsavel.assinatura);
                const assinaturaBytes = await processedImage.arrayBuffer();
                let assinaturaImage;
                
                // Tentar diferentes formatos de imagem
                try {
                  assinaturaImage = await basePdf.embedPng(assinaturaBytes);
                } catch {
                  try {
                    assinaturaImage = await basePdf.embedJpg(assinaturaBytes);
                  } catch {
                    console.warn('Formato de imagem não suportado');
                  }
                }
                
                if (assinaturaImage) {
                  const maxWidth = config.signatureConfig?.width || 100;
                  const maxHeight = config.signatureConfig?.height || 35;
                  const offsetY = config.signatureConfig?.offsetY || 15;
                  
                  console.log('Signature config (multiple):', { maxWidth, maxHeight, offsetY });
                  
                  // Calcular dimensões mantendo proporção
                  const originalWidth = assinaturaImage.width;
                  const originalHeight = assinaturaImage.height;
                  const aspectRatio = originalWidth / originalHeight;
                  
                  let finalWidth = maxWidth;
                  let finalHeight = maxWidth / aspectRatio;
                  
                  if (finalHeight > maxHeight) {
                    finalHeight = maxHeight;
                    finalWidth = maxHeight * aspectRatio;
                  }
                  
                  page1.drawImage(assinaturaImage, {
                    x: xPos + (larguraAssinatura - finalWidth) / 2,
                    y: yAssinaturaBase + offsetY,
                    width: finalWidth,
                    height: finalHeight,
                  });
                }
              } catch (error) {
                console.error('Erro ao carregar assinatura múltipla:', error);
              }
            } else if (responsavel?.assinatura) {
              console.warn('Assinatura múltipla não é um File válido:', typeof responsavel.assinatura);
            }
            
            // Texto do responsável
            const textoResponsavel = 'RESPONSÁVEL TÉCNICO';
            const textoLargura = helveticaFont.widthOfTextAtSize(textoResponsavel, 10);
            const textoX = xPos + (larguraAssinatura - textoLargura) / 2;
            page1.drawText(textoResponsavel, {
              x: textoX,
              y: yAssinaturaBase - 15,
              size: 10,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
          }
          
          // Linha do aluno abaixo dos responsáveis
          const yAluno = yAssinaturaBase - 60;
          const xAluno = 220;
          const larguraAluno = 200;
          page1.drawLine({
            start: { x: xAluno, y: yAluno },
            end: { x: xAluno + larguraAluno, y: yAluno },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          page1.drawText('ALUNO', {
            x: xAluno + 75,
            y: yAluno - 15,
            size: 10,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        }
      }
    }
    
    // Página 3 - Observações (se habilitada)
    if (config.useObservacoes && config.observacoes && basePdf.getPageCount() > 2) {
      const page3 = basePdf.getPage(2);
      
      const obsLines = splitTextToLines(config.observacoes, helveticaFont, config.fontConfig?.observacoes || 12, 515);
      let yObs = 630;
      
      obsLines.forEach((linha) => {
        if (yObs > 50) {
          page3.drawText(linha, {
            x: 40,
            y: yObs,
            size: config.fontConfig?.observacoes || 12,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          yObs -= (config.fontConfig?.observacoes || 12) + 4;
        }
      });
    }
    
    const pdfBytes = await basePdf.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error(`Erro ao gerar certificado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

export const generateAllCertificates = async (
  employees: Employee[],
  config: CertificateConfig,
  onProgress?: (current: number, total: number) => void
): Promise<Blob[]> => {
  const certificates: Blob[] = [];
  
  for (let i = 0; i < employees.length; i++) {
    const certificate = await generateCertificatePDF(employees[i], config);
    certificates.push(certificate);
    
    if (onProgress) {
      onProgress(i + 1, employees.length);
    }
  }
  
  return certificates;
};

export const downloadCertificate = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const previewCertificate = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};