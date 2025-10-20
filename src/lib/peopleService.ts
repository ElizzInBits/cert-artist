import { prisma } from './prisma';

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
      // Se já é base64, usar diretamente
      assinaturaBase64 = data.assinatura;
      mimeType = 'image/png'; // Assumir PNG por padrão
    }
  }

  const instructor = await prisma.instructor.create({
    data: {
      nome: data.nome,
      registro: data.registro,
      assinatura: assinaturaBase64,
      mimeType,
    },
  });

  return instructor;
};

export const getInstructors = async (activeOnly = true): Promise<SavedInstructor[]> => {
  return await prisma.instructor.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { lastUsed: 'desc' },
  });
};

export const updateInstructor = async (id: string, data: Partial<InstructorData>): Promise<SavedInstructor> => {
  let updateData: any = {
    nome: data.nome,
    registro: data.registro,
    lastUsed: new Date(),
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

  return await prisma.instructor.update({
    where: { id },
    data: updateData,
  });
};

export const deleteInstructor = async (id: string): Promise<void> => {
  await prisma.instructor.update({
    where: { id },
    data: { isActive: false },
  });
};

export const markInstructorAsUsed = async (id: string): Promise<void> => {
  await prisma.instructor.update({
    where: { id },
    data: { lastUsed: new Date() },
  });
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

  const responsible = await prisma.responsible.create({
    data: {
      nome: data.nome,
      registro: data.registro,
      assinatura: assinaturaBase64,
      mimeType,
    },
  });

  return responsible;
};

export const getResponsibles = async (activeOnly = true): Promise<SavedResponsible[]> => {
  return await prisma.responsible.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { lastUsed: 'desc' },
  });
};

export const updateResponsible = async (id: string, data: Partial<ResponsibleData>): Promise<SavedResponsible> => {
  let updateData: any = {
    nome: data.nome,
    registro: data.registro,
    lastUsed: new Date(),
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

  return await prisma.responsible.update({
    where: { id },
    data: updateData,
  });
};

export const deleteResponsible = async (id: string): Promise<void> => {
  await prisma.responsible.update({
    where: { id },
    data: { isActive: false },
  });
};

export const markResponsibleAsUsed = async (id: string): Promise<void> => {
  await prisma.responsible.update({
    where: { id },
    data: { lastUsed: new Date() },
  });
};