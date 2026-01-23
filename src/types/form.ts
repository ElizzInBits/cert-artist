export interface FormData {
  titulo: string;
  descricao: string;
  empresa: string;
  tipo: 'padrao' | 'personalizado';
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'checkbox-group';
  required: boolean;
  options?: string[]; // Para campos select, radio ou checkbox-group
  placeholder?: string;
  group?: string; // Para agrupar campos relacionados
}

export interface FormTemplate {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'padrao' | 'personalizado';
  campos: FormField[];
  configuracao: FormConfig;
}

export interface FormConfig {
  fontConfig: FormFontConfig;
  layoutConfig: FormLayoutConfig;
}

export interface FormFontConfig {
  titulo: number;
  campos: number;
  labels: number;
  conteudo: number;
}

export interface FormLayoutConfig {
  margens: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  espacamento: number;
}

export interface FormResponse {
  [fieldId: string]: any;
}