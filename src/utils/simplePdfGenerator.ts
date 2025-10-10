import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Employee, CertificateConfig } from '@/types/certificate';

export const generateSimpleCertificatePDF = async (
  employee: Employee,
  config: CertificateConfig
): Promise<Blob> => {
  try {
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    
    // PÁGINA 1 - Certificado Principal
    const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
    
    // Título
    page1.drawText('CERTIFICADO', {
      x: pageWidth / 2 - 60,
      y: pageHeight - 100,
      size: 24,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });
    
    // Texto introdutório
    page1.drawText('Certificamos que', {
      x: pageWidth / 2 - 50,
      y: pageHeight - 200,
      size: 14,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Nome do funcionário (centralizado e em destaque)
    const nome = employee.nome.toUpperCase();
    const nomeWidth = helveticaBoldFont.widthOfTextAtSize(nome, 18);
    page1.drawText(nome, {
      x: (pageWidth - nomeWidth) / 2,
      y: pageHeight - 240,
      size: 18,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });
    
    // CPF
    page1.drawText(`CPF: ${employee.cpf || 'XXX.XXX.XXX-XX'}`, {
      x: 60,
      y: pageHeight - 300,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Curso
    page1.drawText(`Curso: ${config.courseData.curso}`, {
      x: 60,
      y: pageHeight - 330,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Empresa
    page1.drawText(`Empresa: ${config.courseData.empresa}`, {
      x: 60,
      y: pageHeight - 360,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Modalidade
    page1.drawText(`Modalidade: ${config.courseData.modalidade}`, {
      x: 60,
      y: pageHeight - 390,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Tipo
    page1.drawText(`Tipo: ${config.courseData.tipo}`, {
      x: 60,
      y: pageHeight - 420,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Carga Horária
    page1.drawText(`Carga Horária: ${config.courseData.cargaHoraria}`, {
      x: 60,
      y: pageHeight - 450,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Período
    page1.drawText(`Período: ${config.courseData.periodo}`, {
      x: 60,
      y: pageHeight - 480,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Conformidade
    if (config.conformidade) {
      page1.drawText('Em conformidade:', {
        x: 60,
        y: pageHeight - 520,
        size: 12,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });
      
      const confLines = splitTextToLines(config.conformidade, helveticaFont, 10, 480);
      let yConf = pageHeight - 540;
      confLines.forEach((linha) => {
        page1.drawText(linha, {
          x: 60,
          y: yConf,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yConf -= 12;
      });
    }
    
    // PÁGINA 2 - Conteúdo e Equipe
    const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
    
    // Conteúdo Programático
    page2.drawText('CONTEÚDO PROGRAMÁTICO', {
      x: 60,
      y: pageHeight - 80,
      size: 16,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });
    
    if (config.conteudo) {
      const conteudoLines = splitTextToLines(config.conteudo, helveticaFont, 12, pageWidth - 120);
      let yConteudo = pageHeight - 120;
      conteudoLines.forEach((linha) => {
        if (yConteudo > 400) {
          page2.drawText(linha, {
            x: 60,
            y: yConteudo,
            size: 12,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          yConteudo -= 16;
        }
      });
    }
    
    // Instrutores
    if (config.instructors.length > 0) {
      page2.drawText('INSTRUTORES:', {
        x: 60,
        y: 350,
        size: 14,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });
      
      let yInst = 320;
      config.instructors.forEach((instrutor) => {
        const registro = instrutor.registro ? ` - ${instrutor.registro}` : '';
        const texto = `• ${instrutor.nome}${registro}`;
        page2.drawText(texto, {
          x: 60,
          y: yInst,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yInst -= 20;
      });
    }
    
    // Responsáveis Técnicos
    if (config.responsibles.length > 0) {
      page2.drawText('RESPONSÁVEIS TÉCNICOS:', {
        x: 60,
        y: 220,
        size: 14,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });
      
      let yResp = 190;
      config.responsibles.forEach((responsavel) => {
        const registro = responsavel.registro ? ` - ${responsavel.registro}` : '';
        const texto = `• ${responsavel.nome}${registro}`;
        page2.drawText(texto, {
          x: 60,
          y: yResp,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yResp -= 20;
      });
    }
    
    // Aproveitamento
    if (config.courseData.aproveitamento) {
      page2.drawText('APROVEITAMENTO:', {
        x: 60,
        y: 120,
        size: 14,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });
      
      page2.drawText(config.courseData.aproveitamento, {
        x: 60,
        y: 90,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    }
    
    // PÁGINA 3 - Observações (se habilitada)
    if (config.useObservacoes && config.observacoes) {
      const page3 = pdfDoc.addPage([pageWidth, pageHeight]);
      
      page3.drawText('OBSERVAÇÕES', {
        x: 60,
        y: pageHeight - 80,
        size: 16,
        font: helveticaBoldFont,
        color: rgb(0, 128, 0),
      });
      
      const obsLines = splitTextToLines(config.observacoes, helveticaFont, 12, pageWidth - 120);
      let yObs = pageHeight - 120;
      obsLines.forEach((linha) => {
        if (yObs > 50) {
          page3.drawText(linha, {
            x: 60,
            y: yObs,
            size: 12,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          yObs -= 16;
        }
      });
    }
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
    
  } catch (error) {
    console.error('Erro ao gerar PDF simples:', error);
    throw error;
  }
};

// Função auxiliar para quebrar texto em linhas
const splitTextToLines = (text: string, font: any, fontSize: number, maxWidth: number): string[] => {
  const words = text.split(' ');
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