// app/tools/controle-gastos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  Calendar,
  Filter,
  X
} from 'lucide-react';

interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  tipo: 'receita' | 'despesa';
}

// Limite de 20 despesas por mês
const LIMITE_TRANSAÇÕES = 20;

const categorias = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Salário',
  'Investimentos',
  'Outros'
];

export default function ControleGastosPage() {
    const [isFormValid, SetIsFormValid] = useState(true);
    const [transacoes, setTransacoes] = useState<Despesa[]>([]);
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState('Outros');
    const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [filtroMes, setFiltroMes] = useState(new Date().toISOString().slice(0, 7));
    const [filtroCategoria, setFiltroCategoria] = useState('todas');
    const [loading, setLoading] = useState(true);

  // Carregar do localStorage
  useEffect(() => {
    const salvo = localStorage.getItem('lifeprod_gastos');
    if (salvo) {
      try {
        setTransacoes(JSON.parse(salvo));
      } catch (e) {
        console.error('Erro ao carregar gastos:', e);
      }
    }
    setLoading(false);
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('lifeprod_gastos', JSON.stringify(transacoes));
    }
  }, [transacoes, loading]);

  function adicionarTransacao() {

    let valorNumerico = 0;

    if (valor) {
        let valorLimpo = valor.replace(/\./g, '').replace(',', '.');
        valorNumerico = parseFloat(valorLimpo);
    }
    
    const isFormValid = descricao.length > 0 && parseFloat(valor) > 0;

    if (!isFormValid) {
      SetIsFormValid(false);
      return;
    }

    // Verificar limite mensal (apenas para despesas)
    if (tipo === 'despesa') {
      const mesAtual = new Date().toISOString().slice(0, 7);
      const despesasMes = transacoes.filter(t => 
        t.data.startsWith(mesAtual)
      );
      
      if (despesasMes.length >= LIMITE_TRANSAÇÕES) {
        alert(`Limite de ${LIMITE_TRANSAÇÕES} transações por mês atingido!`);
        return;
      }
    }

    SetIsFormValid(true);

    const data = new Date().toISOString().split('T')[0].toString();

    const nova: Despesa = {
      id: Date.now().toString(),
      descricao: descricao.trim(),
      valor: valorNumerico,
      categoria,
      data,
      tipo,
    };

    setTransacoes([nova, ...transacoes]);
    setDescricao('');
    setValor('');
    setCategoria('Outros');
    setTipo('despesa');
  }

  function removerTransacao(id: string) {
    setTransacoes(transacoes.filter(t => t.id !== id));
  }

  // Filtrar transações
  const transacoesFiltradas = transacoes.filter(t => {
    const mesMatch = t.data.startsWith(filtroMes);
    const categoriaMatch = filtroCategoria === 'todas' || t.categoria === filtroCategoria;
    return mesMatch && categoriaMatch;
  });

  // Cálculos
  const receitas = transacoesFiltradas.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
  const despesas = transacoesFiltradas.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0);
  const saldo = receitas - despesas;

  const mesAtual = new Date().toISOString().slice(0, 7);
  const transacoesMesAtual = transacoes.filter(t => 
    t.data.startsWith(mesAtual)
  ).length;
  const limiteRestante = LIMITE_TRANSAÇÕES - transacoesMesAtual;

    // Função para formatar valores no padrão brasileiro
    function formatarMoeda(valor: number): string {
        return valor.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }); 
    }
  return (
    <div className="space-y-8 w-full">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-green-600" />
          Controle de Gastos
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Organize suas finanças pessoais com limite de {LIMITE_TRANSAÇÕES} transações por mês
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Receitas</p>
                <p className="text-2xl font-bold text-green-600">R$ {formatarMoeda(receitas)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Despesas</p>
                <p className="text-2xl font-bold text-red-600">R$ {formatarMoeda(despesas)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className={saldo >= 0 ? 'bg-blue-50' : 'bg-orange-50'}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saldo</p>
                <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  R$ {formatarMoeda(saldo)}
                </p>
              </div>
              <PieChart className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Limite mensal */}
      <Card className="bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Transações neste mês</p>
              <p className="text-lg font-bold">
                {transacoesMesAtual} / {LIMITE_TRANSAÇÕES}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Restam</p>
              <p className="text-lg font-bold text-green-600">{limiteRestante}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all"
              style={{ width: `${(transacoesMesAtual / LIMITE_TRANSAÇÕES) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Formulário */}
        <Card>
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Plus className="w-5 h-5 text-green-500" />
              Nova transação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={tipo === 'despesa' ? 'default' : 'outline'}
                onClick={() => setTipo('despesa')}
                className={tipo === 'despesa' ? 'bg-red-600 hover:bg-red-700 flex-1' : 'flex-1'}
              >
                Despesa
              </Button>
              <Button
                type="button"
                variant={tipo === 'receita' ? 'default' : 'outline'}
                onClick={() => setTipo('receita')}
                className={tipo === 'receita' ? 'bg-green-600 hover:bg-green-700 flex-1' : 'flex-1'}
              >
                Receita
              </Button>
            </div>

            <div>
              <Label>Descrição</Label>
              <Input
                placeholder="Ex: Supermercado, Salário, etc."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                maxLength={50}
              />
                {!isFormValid && descricao.length == 0 && <Label className='text-red-900'>Insira a descrição da transação*</Label>}
            </div>

            <div>
                <div>
                    <Label>Valor (R$)</Label>
                    <Input
                        type="text"
                        placeholder="0,00"
                        value={valor}
                        onChange={(e) => {
                        let raw = e.target.value;
                        
                        // Remove tudo que não for número
                        let numeros = raw.replace(/\D/g, '');
                        
                        // Se não tiver números, mostra 0,00
                        if (numeros.length === 0) {
                            setValor('0,00');
                            return;
                        }
                        
                        // Converte para centavos (inteiro)
                        let centavos = parseInt(numeros, 10);
                        
                        // Divide por 100 para obter o valor real
                        let reais = centavos / 100;
                        
                        // Formata com separador de milhar (ponto) e vírgula para decimal
                        let formatado = reais.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                        
                        setValor(formatado);
                        }}
                    />
                </div>
                {!isFormValid && valor.length == 0 && <Label className='text-red-900'>Insira um valor válido para a transação*</Label>}
            </div>

            <div>
              <Label>Categoria</Label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-black"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <Button 
              onClick={adicionarTransacao} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Adicionar
            </Button>
          </CardContent>
        </Card>

        {/* Filtros e lista */}
        <Card>
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Filter className="w-5 h-5 text-gray-500" />
              Histórico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Mês</Label>
                <Input
                  type="month"
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                />
              </div>
              <div>
                <Label>Categoria</Label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-black"
                >
                  <option value="todas">Todas</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transacoesFiltradas.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhuma transação encontrada</p>
              ) : (
                transacoesFiltradas.map((t) => (
                  <div key={t.id} className={`p-3 rounded-lg flex items-center justify-between
                    ${t.tipo === 'receita' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{t.descricao}</p>
                      <div className="flex gap-3 text-xs text-gray-500 mt-1">
                        <span>{t.categoria}</span>
                        <span>{new Date(t.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${t.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.tipo === 'receita' ? '+' : '-'} R$ {formatarMoeda(t.valor)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removerTransacao(t.id)}
                      className="ml-2 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}