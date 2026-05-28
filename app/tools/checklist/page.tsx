// app/tools/checklist/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { FullDatePickerBlock } from '../../components/FullDatePicker';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Check, 
  Calendar,
  Flag,
  Star,
  Loader2,
  Save,
  RefreshCw
} from 'lucide-react';
import { describe } from 'node:test';

interface Tarefa {
  id: string;
  titulo: string;
  concluida: boolean;
  prioridade: 'alta' | 'media' | 'baixa';
  dataCriacao: string;
  dataLimite?: string;
}

export default function ChecklistPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [prioridade, setPrioridade] = useState<'alta' | 'media' | 'baixa'>('media');
  const [dataLimite, setDataLimite] = useState('');
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'ativas' | 'concluidas'>('todas');

  // Carregar tarefas do localStorage ao iniciar
  useEffect(() => {
    const tarefasSalvas = localStorage.getItem('lifeprod_checklist');
    if (tarefasSalvas) {
      try {
        const parsed = JSON.parse(tarefasSalvas);
        setTarefas(parsed);
      } catch (e) {
        console.error('Erro ao carregar tarefas:', e);
      }
    }
    setLoading(false);
  }, []);

  // Salvar tarefas no localStorage sempre que mudar
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('lifeprod_checklist', JSON.stringify(tarefas));
    }
  }, [tarefas, loading]);

  function adicionarTarefa() {
    if (!novaTarefa.trim()) return;

    const nova: Tarefa = {
      id: Date.now().toString(),
      titulo: novaTarefa,
      concluida: false,
      prioridade: prioridade,
      dataCriacao: new Date().toISOString(),
      dataLimite: dataLimite || undefined
    };

    setTarefas([nova, ...tarefas]);
    setNovaTarefa('');
    setDataLimite('');
    setPrioridade('media');
  }

  function toggleTarefa(id: string) {
    setTarefas(tarefas.map(tarefa =>
      tarefa.id === id
        ? { ...tarefa, concluida: !tarefa.concluida }
        : tarefa
    ));
  }

  function removerTarefa(id: string) {
    if (confirm('Tem certeza que deseja remover esta tarefa?')) {
      setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
    }
  }

  function limparConcluidas() {
    if (confirm('Remover todas as tarefas concluídas?')) {
      setTarefas(tarefas.filter(tarefa => !tarefa.concluida));
    }
  }

  function getPrioridadeIcon(prioridade: string) {
    switch (prioridade) {
      case 'alta':
        return <Flag className="w-4 h-4 text-red-500" />;
      case 'media':
        return <Flag className="w-4 h-4 text-yellow-500" />;
      case 'baixa':
        return <Flag className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  }

  function getPrioridadeTexto(prioridade: string) {
    switch (prioridade) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return '';
    }
  }

  function formatarData(dataString: string) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  }

  const tarefasFiltradas = tarefas.filter(tarefa => {
    if (filtro === 'ativas') return !tarefa.concluida;
    if (filtro === 'concluidas') return tarefa.concluida;
    return true;
  });

  const estatisticas = {
    total: tarefas.length,
    concluidas: tarefas.filter(t => t.concluida).length,
    ativas: tarefas.filter(t => !t.concluida).length,
    progresso: tarefas.length > 0 
      ? Math.round((tarefas.filter(t => t.concluida).length / tarefas.length) * 100)
      : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CheckSquare className="w-8 h-8 text-green-600" />
          Checklist Diário
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Organize suas tarefas do dia a dia com prioridades e prazos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
        
        {/* Formulário de adicionar tarefa */}
        <Card className="lg:col-span-1">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Plus className="w-5 h-5 text-green-500" />
              Nova tarefa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            <div>
              <Label>Descrição da tarefa</Label>
              <Input
                maxLength={45}
                placeholder="Ex: Estudar React, Fazer exercícios, Comprar pão..."
                value={novaTarefa}
                onChange={(e) => setNovaTarefa(e.target.value)}
                className="mt-1"
                onKeyPress={(e) => e.key === 'Enter' && adicionarTarefa()}
              />
            </div>

            <div>
              <Label>Prioridade</Label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value as 'alta' | 'media' | 'baixa')}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              >
                <option value="alta" className='text-black'>Alta</option>
                <option value="media" className='text-black'>Média</option>
                <option value="baixa" className='text-black'>Baixa</option>
              </select>
            </div>

            <div>
              <Label>Data limite (opcional)</Label>

              <FullDatePickerBlock
                  value={dataLimite}
                  onChange={(value) => setDataLimite(
                    value
                  )}
                  placeholder="Dia/Mês/Ano"
                />
            </div>

            <Button onClick={adicionarTarefa} disabled={loading || novaTarefa.length === 0} className="w-full bg-green-600 hover:bg-green-700">
              Adicionar tarefa
            </Button>
          </CardContent>
        </Card>

        {/* Lista de tarefas */}
        <Card className="lg:col-span-1">
          <CardHeader className="p-3">
            <div className="flex-col flex-center justify-center sm:flex-row sm:items-center sm:justify-center gap-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                Minhas tarefas
              </CardTitle>
              
              <div className="flex gap-1 items-center justify-center">
                <Button 
                  variant={filtro === 'todas' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFiltro('todas')}
                  className={filtro === 'todas' ? 'bg-green-600' : ''}
                >
                  Todas
                </Button>
                <Button 
                  variant={filtro === 'ativas' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFiltro('ativas')}
                  className={filtro === 'ativas' ? 'bg-green-600' : ''}
                >
                  Ativas
                </Button>
                <Button 
                  variant={filtro === 'concluidas' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFiltro('concluidas')}
                  className={filtro === 'concluidas' ? 'bg-green-600' : ''}
                >
                  Feitas
                </Button>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{estatisticas.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{estatisticas.ativas}</p>
                <p className="text-xs text-gray-500">Pendentes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{estatisticas.concluidas}</p>
                <p className="text-xs text-gray-500">Concluídas</p>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progresso</span>
                <span>{estatisticas.progresso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${estatisticas.progresso}%` }}
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 pt-0">
            {tarefasFiltradas.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma tarefa encontrada</p>
                <p className="text-sm">Adicione sua primeira tarefa acima</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tarefasFiltradas.map((tarefa) => (
                  <div
                    key={tarefa.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      tarefa.concluida ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white hover:shadow-sm'
                    }`}
                  >
                    <button
                      onClick={() => toggleTarefa(tarefa.id)}
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        tarefa.concluida
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {tarefa.concluida && <Check className="w-3 h-3 text-white" />}
                    </button>
                    
                    <div className="flex-1">
                      <p className={`font-medium ${tarefa.concluida ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {tarefa.titulo}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs">
                        <span className="flex items-center gap-1">
                          {getPrioridadeIcon(tarefa.prioridade)}
                          <span className="text-gray-500">{getPrioridadeTexto(tarefa.prioridade)}</span>
                        </span>
                        {tarefa.dataLimite && (
                          <span className="flex items-center gap-1 text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatarData(tarefa.dataLimite)}
                          </span>
                        )}
                        <span className="text-gray-400">
                          Criado: {formatarData(tarefa.dataCriacao)}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removerTarefa(tarefa.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Botões de ação */}
            {tarefas.length > 0 && (
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={limparConcluidas}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar concluídas
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (confirm('Remover TODAS as tarefas?')) {
                      setTarefas([]);
                    }
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Limpar tudo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dica de uso */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 w-full">
        <CardContent className="p-6">
          <p className="text-base text-gray-700">
            💡 <span className="font-semibold">Dica:</span> Use prioridades para organizar suas tarefas mais importantes. 
            As tarefas são salvas automaticamente no seu navegador e não serão perdidas ao fechar a página!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}