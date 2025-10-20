// Prisma não funciona no browser - usar API routes
// import { prisma } from './prisma';

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

// Converter File para base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove o prefixo data:image/...;base64,
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Converter base64 para File
export const base64ToFile = (base64: string, mimeType: string, filename: string): File => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: mimeType });
};

// INSTRUTORES
export const saveInstructor = async (data: InstructorData): Promise<SavedInstructor> => {
  let assinaturaBase64: string | undefined;
  let mimeType: string | undefined;

  if (data.assinatura) {
    if (data.assinatura instanceof File) {
      assinaturaBase64 = await fileToBase64(data.assinatura);
      mimeType = data.assinatura.type;
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
      updateData.assinatura = await fileToBase64(data.assinatura);
      updateData.mimeType = data.assinatura.type;
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
      assinaturaBase64 = await fileToBase64(data.assinatura);
      mimeType = data.assinatura.type;
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
      updateData.assinatura = await fileToBase64(data.assinatura);
      updateData.mimeType = data.assinatura.type;
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