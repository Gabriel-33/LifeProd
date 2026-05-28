// app/tools/streak-habits/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { FullDatePickerBlock } from '../../components/FullDatePicker';
import { 
  Calendar as CalendarIcon, 
  Flame, 
  Target, 
  Check, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import React from 'react';

interface Habito {
  id: string;
  nome: string;
  dataInicio: string;
  ultimoCheckin: string;
  streak: number;
  maxStreak: number;
  historico: { [data: string]: boolean };
}

export default function StreakHabitsPage() {
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [novoHabito, setNovoHabito] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [streakValorAux, setStreakValorAux] =  useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [habitoSelecionado, setHabitoSelecionado] = useState<Habito | null>(null);

  // Carregar hábitos do localStorage
  useEffect(() => {
    const salvos = localStorage.getItem('lifeprod_streak_habits');
    if (salvos) {
      try {
        const parsed = JSON.parse(salvos);
        
        setHabitos(parsed);

      } catch (e) {
        console.error('Erro ao carregar hábitos:', e);
      }
    }
    setLoading(false);
  }, []);

  // Salvar hábitos no localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('lifeprod_streak_habits', JSON.stringify(habitos));
    }
    if(habitos.length > 0){
      
      for(let index = 0; index < habitos.length; index++) {
        const streakValorAux = calcularStreak(habitos[index]);
        
        // Atualiza o array de streaks
        setStreakValorAux(prevStreaks => {
          const novas = [...prevStreaks];
          novas[index] = streakValorAux;
          return novas;
        });
      }
    }
  }, [habitos, loading]);

  // Utilitário: formatar data para YYYY-MM-DD
  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Utilitário: criar data com hora zerada
  function createDate(dateStr: string): Date {
    const date = new Date(dateStr);
    return date;
  }

  // Obter todos os dias entre duas datas (INCLUSIVE)
  function getDiasEntreDatas(dataInicioStr: string, dataFimStr: string): string[] {
    const inicio = createDate(dataInicioStr);
    const fim = createDate(dataFimStr);
    
    if (inicio > fim) return [];
    
    const dias: string[] = [];
    const diffTime = fim.getTime() - inicio.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    for (let i = 1; i <= diffDays; i++) {
      const data = new Date(inicio);
      data.setDate(inicio.getDate() + i);
      dias.push(formatDate(data));
    }
    
    return dias;
  }

  // Calcular streak atual baseado no histórico
  function calcularStreak(habito: Habito): number {
    const hoje = formatDate(new Date());
    const dataInicio = habito.dataInicio;
    
    // Se a data de início é futura, streak = 0
    if (dataInicio > hoje) return 0;
    
    let streak = 0;
    let dataAtual = createDate(hoje);
    const dataInicioDate = createDate(dataInicio);
    
    // Verifica dias consecutivos a partir de hoje
    while (dataAtual >= dataInicioDate) {
      const dataStr = formatDate(dataAtual);
      if (habito.historico[dataStr] === true) {
        streak++;
        dataAtual.setDate(dataAtual.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Verificar se pode fazer checkin hoje
  function podeFazerCheckin(habito: Habito): boolean {
    const hoje = formatDate(new Date());
    const dataInicio = habito.dataInicio;
    
    if (dataInicio > hoje) return false;
    return !habito.historico[hoje];
  }

  // Verificar se o check-in de ontem foi feito
  function verificarCheckinOntem(habito: Habito): boolean {
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const ontemStr = formatDate(ontem);
    const dataInicio = habito.dataInicio;
    
    if (dataInicio > ontemStr) return true;
    return !!habito.historico[ontemStr];
  }

  // Fazer checkin
  function fazerCheckin(id: string) {
    setHabitos(habitos.map(habito => {
      if (habito.id !== id) return habito;
      
      const hoje = formatDate(new Date());
      
      if (habito.historico[hoje]) return habito;
      
      const novoHistorico = { ...habito.historico, [hoje]: true };
      const novaStreak = calcularStreak({ ...habito, historico: novoHistorico });
      
      return {
        ...habito,
        ultimoCheckin: hoje,
        streak: novaStreak,
        maxStreak: Math.max(habito.maxStreak, novaStreak),
        historico: novoHistorico
      };
    }));
  }

  // Adicionar novo hábito
  function adicionarHabito() {
    if (!novoHabito.trim()) return;
    
    const hoje = formatDate(new Date());
    const dataInicioDate = dataInicio;
    
    const historicoInicial: { [data: string]: boolean } = {};
    let streakInicial = 0;
    
    if (dataInicioDate <= hoje) {
      const dias = getDiasEntreDatas(dataInicioDate, hoje);

      dias.forEach(dia => {
        historicoInicial[dia] = true;
      });
      streakInicial = dias.length;
    }
    
    const novaStreakHabito: Habito = {
      id: Date.now().toString(),
      nome: novoHabito,
      dataInicio: dataInicioDate,
      ultimoCheckin: hoje,
      streak: streakInicial + 1,
      maxStreak: streakInicial,
      historico: historicoInicial
    };
    
    setHabitos([...habitos, novaStreakHabito]);
    setNovoHabito('');
    setDataInicio(formatDate(new Date()));
  }

  // Remover hábito
  function removerHabito(id: string) {
    if (confirm('Tem certeza que deseja remover este hábito?')) {
      setHabitos(habitos.filter(h => h.id !== id));
      if (habitoSelecionado?.id === id) {
        setHabitoSelecionado(null);
      }
    }
  }

  // Renderizar calendário do hábito selecionado
  function renderizarCalendario(habito: Habito) {
    const hoje = formatDate(new Date());
    const dias = getDiasEntreDatas(habito.dataInicio, hoje);
    // Agrupar por mês
    const meses: { [key: string]: { dias: string[]; nome: string } } = {};
    
    dias.forEach(dia => {
      const data = new Date(dia);
      const mesKey = `${data.getFullYear()}-${data.getMonth()}`;
      const mesNome = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      if (!meses[mesKey]) {
        meses[mesKey] = { dias: [], nome: mesNome };
      }
      meses[mesKey].dias.push(dia);
    });
    
    return (
      <div className="space-y-6">
        {Object.entries(meses).map(([key, mes]) => (
          <div key={key}>
            <h4 className="font-semibold text-gray-700 mb-3 capitalize">{mes.nome}</h4>
            <div className="grid grid-cols-7 gap-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dia, i) => (
                <div key={i} className="text-center text-xs text-gray-400 font-medium">
                  {dia}
                </div>
              ))}
              {mes.dias.map(dia => {
                const data = new Date(dia);
                const diaSemana = data.getDay();
                const espacos = [];
                if (mes.dias.indexOf(dia) === 0) {
                  for (let i = 0; i < diaSemana; i++) {
                    espacos.push(<div key={`empty-${i}`} className="aspect-square" />);
                  }
                }

                const isHoje = dia === hoje;
                
                return (
                  <React.Fragment key={dia}>
                    {espacos}
                    <div
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all
                        bg-green-500 text-white
                        ${isHoje ? 'border-2 border-purple-500' : ''}
                      `}
                    >
                      {data.getDate()}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Flame className="w-8 h-8 text-orange-500" />
          Streak de Hábitos
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Mantenha uma sequência de dias consecutivos realizando seus hábitos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulário de adicionar hábito */}
        <Card className="lg:col-span-1">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="w-5 h-5 text-orange-500" />
              Novo hábito
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            <div>
              <Label>Nome do hábito</Label>
              <Input
                maxLength={15}
                placeholder="Ex: Beber água, Ler, Meditar, Estudar..."
                value={novoHabito}
                onChange={(e) => setNovoHabito(e.target.value)}
                className="mt-1"
                onKeyPress={(e) => e.key === 'Enter' && adicionarHabito()}
              />
            </div>
            <div>
              <Label>Data de início</Label>

              <FullDatePickerBlock
                value={dataInicio}
                onChange={(value) => setDataInicio(
                  value
                )}
                placeholder="Dia/Mês/Ano"
              />
              <p className="text-xs text-gray-400 mt-1">
                Todos os dias desde esta data serão marcados como concluídos
              </p>
            </div>
            {habitos.length < 3 ? (
              <Button onClick={adicionarHabito} className="w-full bg-orange-600 hover:bg-orange-700">
                Criar hábito
              </Button>
            ):(
              <p className="text-xs text-red-400 mt-1">
                Apenas 3 hábitos por versão!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Lista de hábitos */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Flame className="w-5 h-5 text-orange-500" />
              Seus hábitos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {habitos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Flame className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum hábito criado</p>
                <p className="text-sm">Adicione seu primeiro hábito acima</p>
              </div>
            ) : (
              <div className="space-y-3">
                {habitos.map((habito, key) => {
                  const streakAtual = calcularStreak(habito);
                  const perdeuOntem = !verificarCheckinOntem(habito);
                  const dataInicioObj = createDate(habito.dataInicio);
                  const hoje = new Date();
                  hoje.setHours(0, 0, 0, 0);
                  const podeComecar = hoje >= dataInicioObj;
                  
                  return (
                    <div
                      key={habito.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        habitoSelecionado?.id === habito.id
                          ? 'bg-orange-50 border-orange-300'
                          : 'bg-white hover:shadow-sm'
                      }`}
                      onClick={() => setHabitoSelecionado(habito)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{habito.nome}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Flame className={`w-4 h-4 ${streakAtual > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                              <span className="text-sm font-bold text-orange-600">{streakValorAux[key]}</span>
                              <span className="text-xs text-gray-500">dias</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Início: {new Date(habito.dataInicio).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          {perdeuOntem && podeComecar && streakAtual === 0 && habito.maxStreak > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <AlertCircle className="w-3 h-3 text-red-500" />
                              <span className="text-xs text-red-500">Streak perdida! Recomece hoje</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {podeFazerCheckin(habito) && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                fazerCheckin(habito.id);
                              }}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Check-in
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removerHabito(habito.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calendário do hábito selecionado */}
      {habitoSelecionado && (
        <Card>
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarIcon className="w-5 h-5 text-purple-500" />
                Calendário: {habitoSelecionado.nome}
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-xs text-gray-600">Concluído</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 rounded border" />
                  <span className="text-xs text-gray-600">Pendente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-purple-500 rounded" />
                  <span className="text-xs text-gray-600">Hoje</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {renderizarCalendario(habitoSelecionado)}
            
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Status atual
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Streak atual</p>
                  <p className="text-2xl font-bold text-orange-600">{calcularStreak(habitoSelecionado)} dias</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Maior sequência</p>
                  <p className="text-2xl font-bold text-green-600">{habitoSelecionado.maxStreak} dias</p>
                </div>
              </div>
              {calcularStreak(habitoSelecionado) === 0 && habitoSelecionado.maxStreak === 0 && (
                <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Faça seu primeiro check-in hoje para começar sua streak!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dica de uso */}
      {habitos.length === 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 w-full">
          <CardContent className="p-6">
            <p className="text-base text-gray-700">
               <span className="font-semibold">Dica:</span> A streak (sequência) é uma ótima forma de manter a consistência. 
              Tente não quebrar sua streak diária! Quanto maior a sequência, mais motivado você fica.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}