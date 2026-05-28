export interface Tarefa {
  id: string;
  titulo: string;
  horario: string;
  concluida: boolean;
  prioridade: 'alta' | 'media' | 'baixa';
}

export interface DiaPlanner {
  nome: string;
  data: string;
  tarefas: Tarefa[];
}

export interface PlanejamentoSemanal {
  semana: string;
  dias: DiaPlanner[];
  metasSemanais: string[];
  dicaMotivacional: string;
}

export interface FormDataPDF {
  semana: string;
  dias: DiaPlanner[];
  metasSemanais: string[];
  dicaMotivacional: string;
}