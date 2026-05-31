export interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  tipo: 'receita' | 'despesa';
}