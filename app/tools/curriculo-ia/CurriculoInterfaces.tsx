// Interfaces
export interface CurriculoResultado {
  resumoProfissional: string;
  habilidadesPrincipais: string[];
  descricoesMelhoradas: string;
  palavrasChaveATS: string[];
}

export interface RedeSocial {
  id: string;
  tipo: 'linkedin' | 'github' | 'instagram';
  url: string;
}

export interface Experiencia {
  id: string;
  empresa: string;
  cargo: string;
  dataInicio: string;
  dataFim: string;
  descricao: string;
}

export interface Educacao {
  id: string;
  instituicao: string;
  curso: string;
  dataInicio: string;
  dataFim: string;
}

export interface Idioma {
  id: string;
  nome: string;
  nivel: 'basico' | 'intermediario' | 'avancado' | 'fluente';
}

export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  link: string;
}

export interface FormDataPDF {
  nome: string;
  dataNascimento: string;
  endereco: string;
  profissao: string;
  habilidades?: string;
  nivel: string;
}
