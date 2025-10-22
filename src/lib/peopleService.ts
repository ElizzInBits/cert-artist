import { processSignatureImage, validateImageFile, optimizeForPDF, base64ToFile as utilBase64ToFile } from '@/utils/imageProcessor';

export interface InstructorData {
  nome: string;
  registro?: string;
  assinatura?: File | string;
}

export interface ResponsibleData {
  nome: string;
  registro?: string;
  assinatura?: File | string;
}

export interface SavedInstructor {
  id: string;
  nome: string;
  registro?: string;
  assinatura?: string;
  mimeType?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastUsed: Date;
}

export interface SavedResponsible {
  id: string;
  nome: string;
  registro?: string;
  assinatura?: string;
  mimeType?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastUsed: Date;
}

// Processar e converter File para base64 com alta qualidade
const processAndConvertFile = async (file: File): Promise<{ base64: string; mimeType: string }> => {
  // Validar arquivo
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    // Processar imagem com alta qualidade
    const processed = await optimizeForPDF(file);
    
    return {
      base64: processed.base64,
      mimeType: processed.file.type
    };
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    throw new Error(`Falha no processamento da imagem: ${error.message}`);
  }
};

// Converter base64 para File (usando utilitário otimizado)
export const base64ToFile = utilBase64ToFile;

// INSTRUTORES
export const saveInstructor = async (data: InstructorData): Promise<SavedInstructor> => {
  let assinaturaBase64: string | undefined;
  let mimeType: string | undefined;

  if (data.assinatura) {
    if (data.assinatura instanceof File) {
      const processed = await processAndConvertFile(data.assinatura);
      assinaturaBase64 = processed.base64;
      mimeType = processed.mimeType;
    } else if (typeof data.assinatura === 'string') {
      assinaturaBase64 = data.assinatura;
      mimeType = 'image/png';
    }
  }

  const response = await fetch('/api/instructors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: data.nome,
      registro: data.registro,
      assinatura: assinaturaBase64,
      mimeType,
    }),
  });

  if (!response.ok) throw new Error('Erro ao salvar instrutor');
  return await response.json();
};

export const getInstructors = async (activeOnly = true): Promise<SavedInstructor[]> => {
  const response = await fetch(`/api/instructors?activeOnly=${activeOnly}`);
  if (!response.ok) throw new Error('Erro ao buscar instrutores');
  return await response.json();
};

export const updateInstructor = async (id: string, data: Partial<InstructorData>): Promise<SavedInstructor> => {
  let updateData: any = {
    nome: data.nome,
    registro: data.registro,
  };

  if (data.assinatura) {
    if (data.assinatura instanceof File) {
      const processed = await processAndConvertFile(data.assinatura);
      updateData.assinatura = processed.base64;
      updateData.mimeType = processed.mimeType;
    } else if (typeof data.assinatura === 'string') {
      updateData.assinatura = data.assinatura;
      updateData.mimeType = 'image/png';
    }
  }

  const response = await fetch(`/api/instructors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) throw new Error('Erro ao atualizar instrutor');
  return await response.json();
};

export const deleteInstructor = async (id: string): Promise<void> => {
  const response = await fetch(`/api/instructors/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao deletar instrutor');
};

export const markInstructorAsUsed = async (id: string): Promise<void> => {
  const response = await fetch(`/api/instructors/use?id=${id}`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Erro ao marcar instrutor como usado');
};

// RESPONSÁVEIS
export const saveResponsible = async (data: ResponsibleData): Promise<SavedResponsible> => {
  let assinaturaBase64: string | undefined;
  let mimeType: string | undefined;

  if (data.assinatura) {
    if (data.assinatura instanceof File) {
      const processed = await processAndConvertFile(data.assinatura);
      assinaturaBase64 = processed.base64;
      mimeType = processed.mimeType;
    } else if (typeof data.assinatura === 'string') {
      assinaturaBase64 = data.assinatura;
      mimeType = 'image/png';
    }
  }

  const response = await fetch('/api/responsibles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: data.nome,
      registro: data.registro,
      assinatura: assinaturaBase64,
      mimeType,
    }),
  });

  if (!response.ok) throw new Error('Erro ao salvar responsável');
  return await response.json();
};

export const getResponsibles = async (activeOnly = true): Promise<SavedResponsible[]> => {
  const response = await fetch(`/api/responsibles?activeOnly=${activeOnly}`);
  if (!response.ok) throw new Error('Erro ao buscar responsáveis');
  return await response.json();
};

export const updateResponsible = async (id: string, data: Partial<ResponsibleData>): Promise<SavedResponsible> => {
  let updateData: any = {
    nome: data.nome,
    registro: data.registro,
  };

  if (data.assinatura) {
    if (data.assinatura instanceof File) {
      const processed = await processAndConvertFile(data.assinatura);
      updateData.assinatura = processed.base64;
      updateData.mimeType = processed.mimeType;
    } else if (typeof data.assinatura === 'string') {
      updateData.assinatura = data.assinatura;
      updateData.mimeType = 'image/png';
    }
  }

  const response = await fetch(`/api/responsibles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) throw new Error('Erro ao atualizar responsável');
  return await response.json();
};

export const deleteResponsible = async (id: string): Promise<void> => {
  const response = await fetch(`/api/responsibles/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao deletar responsável');
};

export const markResponsibleAsUsed = async (id: string): Promise<void> => {
  const response = await fetch(`/api/responsibles/use?id=${id}`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Erro ao marcar responsável como usado');
};