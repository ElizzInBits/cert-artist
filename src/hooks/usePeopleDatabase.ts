import { useState, useEffect } from 'react';
import { 
  saveInstructor, 
  getInstructors, 
  updateInstructor, 
  deleteInstructor, 
  markInstructorAsUsed,
  saveResponsible,
  getResponsibles,
  updateResponsible,
  deleteResponsible,
  markResponsibleAsUsed,
  SavedInstructor,
  SavedResponsible,
  InstructorData,
  ResponsibleData,
  base64ToFile
} from '@/lib/peopleService';
import { toast } from '@/hooks/use-toast';

export const usePeopleDatabase = () => {
  const [instructors, setInstructors] = useState<SavedInstructor[]>([]);
  const [responsibles, setResponsibles] = useState<SavedResponsible[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados iniciais
  const loadData = async () => {
    setLoading(true);
    try {
      const [instructorsData, responsiblesData] = await Promise.all([
        getInstructors(),
        getResponsibles()
      ]);
      
      // Converter strings de data para objetos Date
      const instructorsWithDates = instructorsData.map(instructor => ({
        ...instructor,
        createdAt: new Date(instructor.createdAt),
        updatedAt: new Date(instructor.updatedAt),
        lastUsed: new Date(instructor.lastUsed)
      }));
      
      const responsiblesWithDates = responsiblesData.map(responsible => ({
        ...responsible,
        createdAt: new Date(responsible.createdAt),
        updatedAt: new Date(responsible.updatedAt),
        lastUsed: new Date(responsible.lastUsed)
      }));
      
      setInstructors(instructorsWithDates);
      setResponsibles(responsiblesWithDates);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar instrutores e responsáveis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // INSTRUTORES
  const addInstructor = async (data: InstructorData) => {
    try {
      const savedInstructor = await saveInstructor(data);
      const newInstructor = {
        ...savedInstructor,
        createdAt: new Date(savedInstructor.createdAt),
        updatedAt: new Date(savedInstructor.updatedAt),
        lastUsed: new Date(savedInstructor.lastUsed)
      };
      setInstructors(prev => [newInstructor, ...prev]);
      toast({
        title: "Sucesso",
        description: "Instrutor salvo com sucesso"
      });
      return newInstructor;
    } catch (error) {
      console.error('Erro ao salvar instrutor:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar instrutor",
        variant: "destructive"
      });
      throw error;
    }
  };

  const editInstructor = async (id: string, data: Partial<InstructorData>) => {
    try {
      const updated = await updateInstructor(id, data);
      const updatedInstructor = {
        ...updated,
        createdAt: new Date(updated.createdAt),
        updatedAt: new Date(updated.updatedAt),
        lastUsed: new Date(updated.lastUsed)
      };
      setInstructors(prev => prev.map(i => i.id === id ? updatedInstructor : i));
      toast({
        title: "Sucesso",
        description: "Instrutor atualizado com sucesso"
      });
      return updatedInstructor;
    } catch (error) {
      console.error('Erro ao atualizar instrutor:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar instrutor",
        variant: "destructive"
      });
      throw error;
    }
  };

  const removeInstructor = async (id: string) => {
    try {
      await deleteInstructor(id);
      setInstructors(prev => prev.filter(i => i.id !== id));
      toast({
        title: "Sucesso",
        description: "Instrutor removido com sucesso"
      });
    } catch (error) {
      console.error('Erro ao remover instrutor:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover instrutor",
        variant: "destructive"
      });
    }
  };

  const useInstructor = async (id: string) => {
    try {
      await markInstructorAsUsed(id);
      // Atualizar ordem local
      setInstructors(prev => {
        const instructor = prev.find(i => i.id === id);
        if (instructor) {
          const updated = { ...instructor, lastUsed: new Date() };
          return [updated, ...prev.filter(i => i.id !== id)];
        }
        return prev;
      });
    } catch (error) {
      console.error('Erro ao marcar instrutor como usado:', error);
    }
  };

  // RESPONSÁVEIS
  const addResponsible = async (data: ResponsibleData) => {
    try {
      const savedResponsible = await saveResponsible(data);
      const newResponsible = {
        ...savedResponsible,
        createdAt: new Date(savedResponsible.createdAt),
        updatedAt: new Date(savedResponsible.updatedAt),
        lastUsed: new Date(savedResponsible.lastUsed)
      };
      setResponsibles(prev => [newResponsible, ...prev]);
      toast({
        title: "Sucesso",
        description: "Responsável salvo com sucesso"
      });
      return newResponsible;
    } catch (error) {
      console.error('Erro ao salvar responsável:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar responsável",
        variant: "destructive"
      });
      throw error;
    }
  };

  const editResponsible = async (id: string, data: Partial<ResponsibleData>) => {
    try {
      const updated = await updateResponsible(id, data);
      const updatedResponsible = {
        ...updated,
        createdAt: new Date(updated.createdAt),
        updatedAt: new Date(updated.updatedAt),
        lastUsed: new Date(updated.lastUsed)
      };
      setResponsibles(prev => prev.map(r => r.id === id ? updatedResponsible : r));
      toast({
        title: "Sucesso",
        description: "Responsável atualizado com sucesso"
      });
      return updatedResponsible;
    } catch (error) {
      console.error('Erro ao atualizar responsável:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar responsável",
        variant: "destructive"
      });
      throw error;
    }
  };

  const removeResponsible = async (id: string) => {
    try {
      await deleteResponsible(id);
      setResponsibles(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Sucesso",
        description: "Responsável removido com sucesso"
      });
    } catch (error) {
      console.error('Erro ao remover responsável:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover responsável",
        variant: "destructive"
      });
    }
  };

  const useResponsible = async (id: string) => {
    try {
      await markResponsibleAsUsed(id);
      // Atualizar ordem local
      setResponsibles(prev => {
        const responsible = prev.find(r => r.id === id);
        if (responsible) {
          const updated = { ...responsible, lastUsed: new Date() };
          return [updated, ...prev.filter(r => r.id !== id)];
        }
        return prev;
      });
    } catch (error) {
      console.error('Erro ao marcar responsável como usado:', error);
    }
  };

  // Converter dados salvos para formato usado nos certificados
  const getInstructorForCertificate = (instructor: SavedInstructor) => {
    return {
      nome: instructor.nome,
      registro: instructor.registro
    };
  };

  const getResponsibleForCertificate = (responsible: SavedResponsible) => {
    let assinatura: File | undefined;
    
    if (responsible.assinatura && responsible.mimeType) {
      assinatura = base64ToFile(
        responsible.assinatura, 
        responsible.mimeType, 
        `signature-${responsible.id}.${responsible.mimeType.split('/')[1]}`
      );
    }

    return {
      nome: responsible.nome,
      registro: responsible.registro,
      assinatura
    };
  };

  return {
    // Estado
    instructors,
    responsibles,
    loading,
    
    // Ações
    loadData,
    
    // Instrutores
    addInstructor,
    editInstructor,
    removeInstructor,
    useInstructor,
    getInstructorForCertificate,
    
    // Responsáveis
    addResponsible,
    editResponsible,
    removeResponsible,
    useResponsible,
    getResponsibleForCertificate
  };
};