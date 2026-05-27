// app/tools/organizador-estudos/estudosInterfaces.ts

export interface Materia {
  id: string;
  nome: string;
  dificuldade: 1 | 2 | 3 | 4 | 5;
}

export interface CronogramaDia {
  dia: number;
  materia: string;
  tempoMinutos: number;
  topicos: string[];
}

export interface EstudoResultado {
  cronograma: CronogramaDia[];
  revisoes: string[];
  metaDiaria: string;
  dicaEstudo: string;
  materiasPrioridade: { nome: string; horasSemanais: number }[];
}

// Interface para os dados do formulário (usado no PDF)
export interface FormDataEstudos {
  materias: Materia[];
  horasPorDia: string;
  dataProva: string;
  diasAteProva: number;
}