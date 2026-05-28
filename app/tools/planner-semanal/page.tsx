// app/tools/planner-semanal/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {generatePdfPlanner} from "./ExportPlannerPdf"
import {Tarefa, PlanejamentoSemanal} from './InterfacePlanner';

import { 
  Calendar, 
  Loader2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check,
  Clock,
  Target,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';


export default function PlannerSemanalPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planejamento, setPlanejamento] = useState<PlanejamentoSemanal | null>(null);
  const [semanaAtual, setSemanaAtual] = useState(0);
  const [objetivos, setObjetivos] = useState('');
  const [horasDia, setHorasDia] = useState('');
  const [compromissosFixos, setCompromissosFixos] = useState('');

  // Carregar planejamento salvo do localStorage
  useEffect(() => {
    const salvo = localStorage.getItem('lifeprod_planner');
    if (salvo) {
      try {
        const parsed = JSON.parse(salvo);
        setPlanejamento(parsed);
      } catch (e) {
        console.error('Erro ao carregar planner:', e);
      }
    }
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    if (planejamento) {
      localStorage.setItem('lifeprod_planner', JSON.stringify(planejamento));
    }
  }, [planejamento]);

  function obterDatasSemana(semanasOffset: number = 0) {
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const diff = (diaSemana === 0 ? -6 : 1 - diaSemana);
    const segunda = new Date(hoje);
    segunda.setDate(hoje.getDate() + diff + (semanasOffset * 7));
    
    const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const datas = [];
    
    for (let i = 0; i < 7; i++) {
      const data = new Date(segunda);
      data.setDate(segunda.getDate() + i);
      datas.push({
        nome: dias[i],
        data: data.toISOString().split('T')[0],
        dataFormatada: data.toLocaleDateString('pt-BR')
      });
    }
    return datas;
  }

  async function gerarPlanejamento() {
    setLoading(true);
    setError(null);

    const prompt = `Você é um especialista em produtividade e organização pessoal.

    Crie um planejamento semanal personalizado com os seguintes dados:

    OBJETIVOS DA SEMANA: ${objetivos || 'Produtividade geral'}
    HORAS DISPONÍVEIS POR DIA: ${horasDia || '8'} horas
    COMPROMISSOS FIXOS: ${compromissosFixos || 'Nenhum'}

    Responda APENAS com um JSON válido, sem markdown.

    O JSON deve ter EXATAMENTE esta estrutura:
    {
      "metasSemanais": ["Meta 1", "Meta 2", "Meta 3"],
      "dicaMotivacional": "Uma frase motivacional para a semana",
      "tarefasSugeridas": [
        {
          "dia": "Segunda",
          "tarefas": [
            {"titulo": "Tarefa exemplo", "horario": "09:00", "prioridade": "alta"}
          ]
        }
      ]
    }

    Regras:
    - Distribua as tarefas ao longo da semana de forma equilibrada
    - Cada dia deve ter entre 3-8 tarefas
    - Horários sugeridos: 09:00, 10:30, 14:00, 15:30, etc.
    - Prioridades: alta, media, baixa
    - As tarefas devem estar alinhadas com os objetivos informados

    Retorne APENAS o JSON solicitado.`;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar planejamento');
      }

      let parsedResult;
      if (typeof data.data === 'string') {
        const cleanJson = data.data.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        parsedResult = JSON.parse(cleanJson);
      } else {
        parsedResult = data.data;
      }

      const datasSemana = obterDatasSemana(semanaAtual);
      
      const novoPlanejamento: PlanejamentoSemanal = {
        semana: `Semana ${new Date().toLocaleDateString('pt-BR')}`,
        metasSemanais: parsedResult.metasSemanais,
        dicaMotivacional: parsedResult.dicaMotivacional,
        dias: datasSemana.map(dia => {
          const tarefasGeradas = parsedResult.tarefasSugeridas?.find(
            (t: any) => t.dia === dia.nome
          );
          
          return {
            nome: dia.nome,
            data: dia.data,
            tarefas: (tarefasGeradas?.tarefas || []).map((t: any, idx: number) => ({
              id: `${dia.nome}-${idx}-${Date.now()}`,
              titulo: t.titulo,
              horario: t.horario || '09:00',
              concluida: false,
              prioridade: t.prioridade || 'media'
            }))
          };
        })
      };

      setPlanejamento(novoPlanejamento);
      
    } catch (err) {
      console.error('Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  function adicionarTarefa(diaIndex: number) {
    const titulo = prompt('Digite o título da tarefa:');
    if (!titulo) return;
    
    const horario = prompt('Horário (ex: 09:00):', '09:00');
    const prioridade = prompt('Prioridade (alta/media/baixa):', 'media') as 'alta' | 'media' | 'baixa';
    
    const novaTarefa: Tarefa = {
      id: Date.now().toString(),
      titulo,
      horario: horario || '09:00',
      concluida: false,
      prioridade: prioridade === 'alta' || prioridade === 'media' || prioridade === 'baixa' ? prioridade : 'media'
    };
    
    const novosDias = [...planejamento!.dias];
    novosDias[diaIndex].tarefas.push(novaTarefa);
    setPlanejamento({ ...planejamento!, dias: novosDias });
  }

  function toggleTarefa(diaIndex: number, tarefaId: string) {
    const novosDias = [...planejamento!.dias];
    const tarefa = novosDias[diaIndex].tarefas.find(t => t.id === tarefaId);
    if (tarefa) {
      tarefa.concluida = !tarefa.concluida;
      setPlanejamento({ ...planejamento!, dias: novosDias });
    }
  }

  function removerTarefa(diaIndex: number, tarefaId: string) {
    const novosDias = [...planejamento!.dias];
    novosDias[diaIndex].tarefas = novosDias[diaIndex].tarefas.filter(t => t.id !== tarefaId);
    setPlanejamento({ ...planejamento!, dias: novosDias });
  }

  function mudarSemana(direcao: number) {
    const novaSemana = semanaAtual + direcao;
    setSemanaAtual(novaSemana);
    
    const novasDatas = obterDatasSemana(novaSemana);
    if (planejamento) {
      const novosDias = novasDatas.map((novaData, idx) => {
        const diaExistente = planejamento.dias[idx];
        return {
          ...diaExistente,
          nome: novaData.nome,
          data: novaData.data,
          dataFormatada: novaData.dataFormatada
        };
      });
      setPlanejamento({ ...planejamento, dias: novosDias as any });
    }
  }

  function getPrioridadeCor(prioridade: string) {
    switch (prioridade) {
      case 'alta': return 'border-l-4 border-l-red-500 bg-red-50';
      case 'media': return 'border-l-4 border-l-yellow-500 bg-yellow-50';
      case 'baixa': return 'border-l-4 border-l-green-500 bg-green-50';
      default: return '';
    }
  }

  function limparFormulario() {
    setObjetivos('');
    setHorasDia('');
    setCompromissosFixos('');
    setPlanejamento(null);
    setSemanaAtual(0);
    setError(null);
  }

  const diasSemana = planejamento?.dias || [];

  function exportarSemanaPdf(){
    generatePdfPlanner(planejamento);
  }

  return (
    <div className="space-y-8 w-full">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          Planner Semanal com IA
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Organize sua semana com planejamento inteligente e acompanhamento de tarefas
        </p>
      </div>

      {/* Formulário de configuração (só aparece se não tem planejamento) */}
      {!planejamento && (
        <Card className="w-full">
          <CardHeader className="p-8">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="w-6 h-6 text-blue-500" />
              Configure sua semana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-0">
            <div>
              <Label className="text-base font-semibold">Objetivos da semana *</Label>
              <Textarea
                placeholder="Ex: Estudar React, Finalizar projeto, Fazer exercícios..."
                value={objetivos}
                onChange={(e) => setObjetivos(e.target.value)}
                className="mt-2"
                rows={3}
                maxLength={100}
              />
            </div>

            <div>
              <Label className="text-base font-semibold">Horas disponíveis por dia *</Label>
              <Input
                type="number"
                placeholder="Ex: 8"
                value={horasDia}
                onChange={(e) => setHorasDia(e.target.value)}
                className="mt-2"
                min={1}
                max={6}
              />
            </div>

            <div>
              <Label className="text-base font-semibold">Compromissos fixos</Label>
              <Textarea
                placeholder="Ex: Trabalho 9h-18h, Academia 19h..."
                value={compromissosFixos}
                onChange={(e) => setCompromissosFixos(e.target.value)}
                className="mt-2"
                rows={2}
                maxLength={100}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={gerarPlanejamento} 
                disabled={loading || objetivos.length === 0 || horasDia.length === 0}
                className="flex-1 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando planejamento semanal...
                  </>
                ) : (
                  <>
                    Gerar Planner
                  </>
                )}
              </Button>
              <Button onClick={limparFormulario} variant="outline" className='hover:bg-purple-200 flex-1 justify-center'>
                Limpar
              </Button>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-base">
                  {error}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visualização do Planner */}
      {planejamento && (
        <>
          {/* Navegação da semana */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => mudarSemana(-1)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Semana anterior
            </Button>
            <h2 className="text-xl font-semibold text-gray-800">
              {planejamento.semana}
            </h2>
            <Button variant="outline" onClick={() => mudarSemana(1)}>
              Próxima semana
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Metas da semana */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Metas da semana
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {planejamento.metasSemanais.map((meta, i) => (
                  <li key={i}>{meta}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-600 italic">
                 {planejamento.dicaMotivacional}
              </p>
            </CardContent>
          </Card>

          {/* Grid de dias da semana */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {diasSemana.map((dia, diaIndex) => (
              <Card key={diaIndex} className="overflow-hidden">
                <CardHeader className="bg-blue-50 p-4">
                  <CardTitle className="text-lg">
                    {dia.nome}
                    <p className="text-sm text-gray-500 font-normal mt-1">
                      {new Date(dia.data).toLocaleDateString('pt-BR')}
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
                  {dia.tarefas.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 text-sm">
                      Nenhuma tarefa
                    </p>
                  ) : (
                    dia.tarefas.map((tarefa) => (
                      <div
                        key={tarefa.id}
                        className={`p-3 rounded-lg ${getPrioridadeCor(tarefa.prioridade)} transition-all ${
                          tarefa.concluida ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => toggleTarefa(diaIndex, tarefa.id)}
                            className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center ${
                              tarefa.concluida
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {tarefa.concluida && <Check className="w-3 h-3 text-white" />}
                          </button>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${tarefa.concluida ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                              {tarefa.titulo}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{tarefa.horario}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                tarefa.prioridade === 'alta' ? 'bg-red-100 text-red-700' :
                                tarefa.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {tarefa.prioridade}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removerTarefa(diaIndex, tarefa.id)}
                            className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adicionarTarefa(diaIndex)}
                    className="w-full mt-2 text-blue-600 border-dashed"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar tarefa
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setPlanejamento(null)}>
              <Sparkles className="w-4 h-4 mr-2" />
              Novo planejamento
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => exportarSemanaPdf()}>
              <Download className="w-4 h-4 mr-2"/>
              Exportar semana
            </Button>
          </div>
        </>
      )}

      {/* Dica de uso */}
      {!planejamento && !loading && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 w-full">
          <CardContent className="p-6">
            <p className="text-base text-gray-700">
              <span className="font-semibold">Dica:</span> Quanto mais detalhados forem seus objetivos, 
              mais personalizado será o planejamento gerado pela IA. Inclua metas específicas e prazos!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}