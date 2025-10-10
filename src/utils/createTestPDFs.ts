import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const createTestBasePDF = async (): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  
  // Página 1 - Certificado
  const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
  
  // Título do certificado
  page1.drawText('CERTIFICADO', {
    x: pageWidth / 2 - 60,
    y: pageHeight - 100,
    size: 24,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  // Texto base do certificado
  page1.drawText('Certificamos que', {
    x: pageWidth / 2 - 50,
    y: pageHeight - 580,
    size: 14,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  // Página 2 - Conteúdo
  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
  
  page2.drawText('CONTEÚDO PROGRAMÁTICO', {
    x: 50,
    y: pageHeight - 100,
    size: 16,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  return await pdfDoc.save();
};

export const createTestBase2PDF = async (): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  
  // Página 1 - Certificado
  const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
  
  page1.drawText('CERTIFICADO', {
    x: pageWidth / 2 - 60,
    y: pageHeight - 100,
    size: 24,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  page1.drawText('Certificamos que', {
    x: pageWidth / 2 - 50,
    y: pageHeight - 580,
    size: 14,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  // Página 2 - Conteúdo
  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
  
  page2.drawText('CONTEÚDO PROGRAMÁTICO', {
    x: 50,
    y: pageHeight - 100,
    size: 16,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  // Página 3 - Observações
  const page3 = pdfDoc.addPage([pageWidth, pageHeight]);
  
  page3.drawText('OBSERVAÇÕES', {
    x: 50,
    y: pageHeight - 100,
    size: 16,
    font: helveticaBoldFont,
    color: rgb(0, 128, 0),
  });
  
  return await pdfDoc.save();
};

export const initializeTestPDFs = async () => {
  try {
    // Criar PDFs de teste se não existirem
    const basePdfBytes = await createTestBasePDF();
    const base2PdfBytes = await createTestBase2PDF();
    
    // Salvar no localStorage para uso temporário
    localStorage.setItem('testBasePDF', btoa(String.fromCharCode(...basePdfBytes)));
    localStorage.setItem('testBase2PDF', btoa(String.fromCharCode(...base2PdfBytes)));
    
    console.log('PDFs de teste criados com sucesso');
  } catch (error) {
    console.error('Erro ao criar PDFs de teste:', error);
  }
};