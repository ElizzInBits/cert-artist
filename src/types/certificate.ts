export interface CourseData {
  empresa: string;
  curso: string;
  modalidade: string;
  tipo: string;
  cargaHoraria: string;
  periodo: string;
  aproveitamento: string;
}

export interface CertificateLabels {
  documentoIdentificacao: string;
  nomeCurso: string;
  nomeEmpresa: string;
  modalidadeTreinamento: string;
  cargaHorariaRealizada: string;
  tipoTreinamento: string;
  periodoTreinamento: string;
  emConformidade: string;
  responsavelTecnico: string;
  aluno: string;
}

export interface Instructor {
  nome: string;
  registro?: string;
}

export interface Responsible {
  nome: string;
  registro?: string;
  assinatura?: File;
}

export interface SavedPerson {
  id: string;
  nome: string;
  registro?: string;
  assinatura?: string; // Base64
  mimeType?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastUsed: Date;
}

export interface Employee {
  nome: string;
  cpf: string;
  [key: string]: any;
}

export interface CertificateConfig {
  courseData: CourseData;
  conformidade: string;
  conteudo: string;
  observacoes?: string;
  useObservacoes: boolean;
  instructors: Instructor[];
  responsibles: Responsible[];
  employees: Employee[];
  excelFile?: File;
  fontConfig?: FontConfig;
  signatureConfig?: SignatureConfig;
  conferidoA?: string;
}

export interface FontConfig {
  nome: number;
  campos: number;
  conformidade: number;
  conteudo: number;
  instrutores: number;
  responsaveis: number;
  aproveitamento: number;
  observacoes: number;
  cpf: number;
  nome_curso: number;
}

export interface SignatureConfig {
  width: number;
  height: number;
  offsetY: number;
}