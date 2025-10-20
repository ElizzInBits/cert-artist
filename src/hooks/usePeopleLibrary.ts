import { useState, useEffect } from 'react';
import { Instructor, Responsible } from '@/types/certificate';

interface SavedPerson {
  id: string;
  type: 'instructor' | 'responsible';
  nome: string;
  registro?: string;
  assinatura?: File;
  createdAt: Date;
  lastUsed: Date;
}

const STORAGE_KEY = 'cert-artist-people-library';

export const usePeopleLibrary = () => {
  const [savedPeople, setSavedPeople] = useState<SavedPerson[]>([]);

  // Carregar dados do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('localStorage data:', stored);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        const peopleWithDates = parsed.map((person: any) => ({
          ...person,
          createdAt: new Date(person.createdAt),
          lastUsed: new Date(person.lastUsed)
        }));
        console.log('Loaded people:', peopleWithDates);
        setSavedPeople(peopleWithDates);
      } else {
        // Adicionar dados de exemplo se não houver nada
        const exampleData: SavedPerson[] = [
          {
            id: '1',
            type: 'instructor',
            nome: 'João Silva',
            registro: 'CREA 123456',
            createdAt: new Date(),
            lastUsed: new Date()
          },
          {
            id: '2', 
            type: 'responsible',
            nome: 'Maria Santos',
            registro: 'CRQ 789012',
            createdAt: new Date(),
            lastUsed: new Date()
          }
        ];
        setSavedPeople(exampleData);
        saveToStorage(exampleData);
      }
    } catch (error) {
      console.error('Erro ao carregar biblioteca de pessoas:', error);
    }
  }, []);

  // Salvar no localStorage
  const saveToStorage = (people: SavedPerson[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
    } catch (error) {
      console.error('Erro ao salvar biblioteca de pessoas:', error);
    }
  };

  // Salvar pessoa
  const savePerson = (person: Instructor | Responsible, type: 'instructor' | 'responsible') => {
    const newPerson: SavedPerson = {
      id: Date.now().toString(),
      type,
      nome: person.nome,
      registro: person.registro,
      assinatura: 'assinatura' in person ? person.assinatura : undefined,
      createdAt: new Date(),
      lastUsed: new Date()
    };

    const updated = [...savedPeople, newPerson];
    setSavedPeople(updated);
    saveToStorage(updated);
    return newPerson.id;
  };

  // Atualizar pessoa
  const updatePerson = (id: string, updates: Partial<SavedPerson>) => {
    const updated = savedPeople.map(person => 
      person.id === id 
        ? { ...person, ...updates, lastUsed: new Date() }
        : person
    );
    setSavedPeople(updated);
    saveToStorage(updated);
  };

  // Remover pessoa
  const removePerson = (id: string) => {
    const updated = savedPeople.filter(person => person.id !== id);
    setSavedPeople(updated);
    saveToStorage(updated);
  };

  // Marcar como usado recentemente
  const markAsUsed = (id: string) => {
    updatePerson(id, { lastUsed: new Date() });
  };

  // Obter pessoas por tipo
  const getInstructors = () => savedPeople.filter(p => p.type === 'instructor');
  const getResponsibles = () => savedPeople.filter(p => p.type === 'responsible');

  // Obter pessoas usadas recentemente
  const getRecentlyUsed = (type?: 'instructor' | 'responsible', limit = 5) => {
    let filtered = savedPeople;
    if (type) {
      filtered = savedPeople.filter(p => p.type === type);
    }
    return filtered
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
      .slice(0, limit);
  };

  console.log('Current savedPeople:', savedPeople);

  return {
    savedPeople,
    savePerson,
    updatePerson,
    removePerson,
    markAsUsed,
    getInstructors,
    getResponsibles,
    getRecentlyUsed
  };
};