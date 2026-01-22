import { create } from 'zustand';
import { FormData, FormTemplate, FormConfig, FormResponse, FormFontConfig, FormLayoutConfig } from '@/types/form';

interface FormStore {
  // Form Data
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  
  // Templates
  selectedTemplate: FormTemplate | null;
  setSelectedTemplate: (template: FormTemplate | null) => void;
  
  // Responses
  responses: FormResponse[];
  setResponses: (responses: FormResponse[]) => void;
  
  // Configuration
  formConfig: FormConfig;
  setFormConfig: (config: Partial<FormConfig>) => void;
  
  // Files
  excelFile: File | null;
  setExcelFile: (file: File | null) => void;
  
  // Actions
  clearAll: () => void;
}

const defaultFormData: FormData = {
  titulo: '',
  descricao: '',
  empresa: '',
  tipo: 'padrao'
};

const defaultFontConfig: FormFontConfig = {
  titulo: 18,
  campos: 12,
  labels: 14,
  conteudo: 12
};

const defaultLayoutConfig: FormLayoutConfig = {
  margens: {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
  },
  espacamento: 15
};

const defaultFormConfig: FormConfig = {
  fontConfig: defaultFontConfig,
  layoutConfig: defaultLayoutConfig
};

export const useFormStore = create<FormStore>((set) => ({
  // Form Data
  formData: defaultFormData,
  setFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),
  
  // Templates
  selectedTemplate: null,
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  
  // Responses
  responses: [],
  setResponses: (responses) => set({ responses }),
  
  // Configuration
  formConfig: defaultFormConfig,
  setFormConfig: (config) => set((state) => ({ 
    formConfig: { 
      ...state.formConfig, 
      ...config,
      fontConfig: config.fontConfig ? { ...state.formConfig.fontConfig, ...config.fontConfig } : state.formConfig.fontConfig,
      layoutConfig: config.layoutConfig ? { ...state.formConfig.layoutConfig, ...config.layoutConfig } : state.formConfig.layoutConfig
    } 
  })),
  
  // Files
  excelFile: null,
  setExcelFile: (file) => set({ excelFile: file }),
  
  // Actions
  clearAll: () => set({
    formData: defaultFormData,
    selectedTemplate: null,
    responses: [],
    formConfig: defaultFormConfig,
    excelFile: null
  })
}));