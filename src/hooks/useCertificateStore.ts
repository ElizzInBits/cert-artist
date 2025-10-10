import { create } from 'zustand';
import { CourseData, Instructor, Responsible, Employee, FontConfig, SignatureConfig, CertificateLabels } from '@/types/certificate';

interface CertificateStore {
  // Course Data
  courseData: CourseData;
  setCourseData: (data: Partial<CourseData>) => void;
  
  // Details
  conformidade: string;
  conteudo: string;
  observacoes: string;
  useObservacoes: boolean;
  setConformidade: (text: string) => void;
  setConteudo: (text: string) => void;
  setObservacoes: (text: string) => void;
  setUseObservacoes: (use: boolean) => void;
  
  // Certificate Text Fields
  conferidoA: string;
  setConferidoA: (text: string) => void;
  
  // Output Format
  outputFormat: 'PDF' | 'PPTX' | 'BOTH';
  setOutputFormat: (format: 'PDF' | 'PPTX' | 'BOTH') => void;
  
  // Certificate Labels
  labels: CertificateLabels;
  setLabels: (labels: Partial<CertificateLabels>) => void;
  
  // Team
  instructors: Instructor[];
  responsibles: Responsible[];
  addInstructor: (instructor: Instructor) => void;
  removeInstructor: (index: number) => void;
  addResponsible: (responsible: Responsible) => void;
  removeResponsible: (index: number) => void;
  
  // Files
  excelFile: File | null;
  setExcelFile: (file: File | null) => void;
  
  // Employees
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  
  // Font Config
  fontConfig: FontConfig;
  setFontConfig: (config: Partial<FontConfig>) => void;
  
  // Signature Config
  signatureConfig: SignatureConfig;
  setSignatureConfig: (config: Partial<SignatureConfig>) => void;
  
  // Actions
  clearAll: () => void;
}

const defaultCourseData: CourseData = {
  empresa: '',
  curso: '',
  modalidade: '',
  tipo: '',
  cargaHoraria: '',
  periodo: '',
  aproveitamento: ''
};

const defaultFontConfig: FontConfig = {
  nome: 16,
  campos: 12,
  conformidade: 10,
  conteudo: 12,
  instrutores: 12,
  responsaveis: 12,
  aproveitamento: 12,
  observacoes: 12,
  cpf: 12,
  nome_curso: 12
};

const defaultSignatureConfig: SignatureConfig = {
  width: 150,
  height: 100,
  offsetY: 10
};

const defaultLabels: CertificateLabels = {
  documentoIdentificacao: 'Documento de Identificação:',
  nomeCurso: 'Nome do Curso:',
  nomeEmpresa: 'Empresa:',
  modalidadeTreinamento: 'Modalidade de treinamento:',
  cargaHorariaRealizada: 'Carga Horária Realizada:',
  tipoTreinamento: 'Tipo de Treinamento:',
  periodoTreinamento: 'Período de Treinamento:',
  emConformidade: 'Em conformidade:',
  responsavelTecnico: 'RESPONSÁVEL TÉCNICO',
  aluno: 'ALUNO'
};

export const useCertificateStore = create<CertificateStore>((set) => ({
  // Course Data
  courseData: defaultCourseData,
  setCourseData: (data) => set((state) => ({ 
    courseData: { ...state.courseData, ...data } 
  })),
  
  // Details
  conformidade: '',
  conteudo: '',
  observacoes: '',
  useObservacoes: false,
  setConformidade: (text) => set({ conformidade: text }),
  setConteudo: (text) => set({ conteudo: text }),
  setObservacoes: (text) => set({ observacoes: text }),
  setUseObservacoes: (use) => set({ useObservacoes: use }),
  
  // Certificate Text Fields
  conferidoA: 'Conferido a:',
  setConferidoA: (text) => set({ conferidoA: text }),
  
  // Output Format
  outputFormat: 'PDF',
  setOutputFormat: (format) => set({ outputFormat: format }),
  
  // Certificate Labels
  labels: defaultLabels,
  setLabels: (labels) => set((state) => ({ 
    labels: { ...state.labels, ...labels } 
  })),
  
  // Team
  instructors: [],
  responsibles: [],
  addInstructor: (instructor) => set((state) => ({ 
    instructors: [...state.instructors, instructor] 
  })),
  removeInstructor: (index) => set((state) => ({ 
    instructors: state.instructors.filter((_, i) => i !== index) 
  })),
  addResponsible: (responsible) => set((state) => ({ 
    responsibles: [...state.responsibles, responsible] 
  })),
  removeResponsible: (index) => set((state) => ({ 
    responsibles: state.responsibles.filter((_, i) => i !== index) 
  })),
  
  // Files
  excelFile: null,
  setExcelFile: (file) => set({ excelFile: file }),
  
  // Employees
  employees: [],
  setEmployees: (employees) => {
    console.log('Store setEmployees chamado com:', employees);
    set({ employees });
    console.log('Store atualizado, employees agora:', employees.length);
  },
  
  // Font Config
  fontConfig: defaultFontConfig,
  setFontConfig: (config) => set((state) => ({ 
    fontConfig: { ...state.fontConfig, ...config } 
  })),
  
  // Signature Config
  signatureConfig: defaultSignatureConfig,
  setSignatureConfig: (config) => set((state) => ({ 
    signatureConfig: { ...state.signatureConfig, ...config } 
  })),
  
  // Actions
  clearAll: () => set({
    courseData: defaultCourseData,
    conformidade: '',
    conteudo: '',
    observacoes: '',
    useObservacoes: false,
    instructors: [],
    responsibles: [],
    excelFile: null,
    employees: [],
    fontConfig: defaultFontConfig,
    signatureConfig: defaultSignatureConfig,
    outputFormat: 'PDF',
    labels: defaultLabels,
    conferidoA: 'Conferido a:'
  })
}));