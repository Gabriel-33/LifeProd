// app/tools/organizador-estudos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { exportCalendarioEstudosPdf } from './exportCalendario';
import { Materia, EstudoResultado } from './estudosInterfaces';
import { Label } from '../../components/ui/label';
import { Brain, Loader2, Copy, Sparkles, BookOpen, Calendar, Clock, Target, Plus, Trash2, Save, PlusCircle } from 'lucide-react';

// Interface para salvar no localStorage
interface PlanoSalvo {
  materias: Materia[];
  horasPorDia: string;
  dataProva: string;
  resultado: EstudoResultado | null;
  dataCriacao: string;
}

export default function OrganizadorEstudosPage() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [novaMateria, setNovaMateria] = useState('');
  const [dificuldade, setDificuldade] = useState<1 | 2 | 3 | 4>(3);
  const [horasPorDia, setHorasPorDia] = useState('');
  const [dataProva, setDataProva] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<EstudoResultado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [temPlanoSalvo, setTemPlanoSalvo] = useState(false);

  // Carregar plano salvo do localStorage ao iniciar
  useEffect(() => {
    const planosSalvos = localStorage.getItem('lifeprod_planos_estudos');
    if (planosSalvos) {
      try {
        const planos: PlanoSalvo[] = JSON.parse(planosSalvos);
        if (planos.length > 0) {
          setTemPlanoSalvo(true);
          const ultimoPlano = planos[planos.length - 1];
          setMaterias(ultimoPlano.materias);
          setHorasPorDia(ultimoPlano.horasPorDia);
          setDataProva(ultimoPlano.dataProva);
          setResultado(ultimoPlano.resultado);
          setMostrarFormulario(false);
        } else {
          setTemPlanoSalvo(false);
          setMostrarFormulario(true);
        }
      } catch (e) {
        console.error('Erro ao carregar planos:', e);
        setTemPlanoSalvo(false);
        setMostrarFormulario(true);
      }
    } else {
      setTemPlanoSalvo(false);
      setMostrarFormulario(true);
    }
  }, []);

  // Salvar plano no localStorage
  function salvarPlano() {
    if (!resultado && materias.length === 0) {
      setError('Nada para salvar. Gere um plano primeiro ou adicione matérias.');
      return;
    }

    setSaveLoading(true);
    try {
      const planoAtual: PlanoSalvo = {
        materias: materias,
        horasPorDia: horasPorDia,
        dataProva: dataProva,
        resultado: resultado,
        dataCriacao: new Date().toISOString()
      };

      const planosExistentes = localStorage.getItem('lifeprod_planos_estudos');
      let planos: PlanoSalvo[] = planosExistentes ? JSON.parse(planosExistentes) : [];
      
      // Limita a 10 planos salvos
      if (planos.length >= 10) {
        planos = planos.slice(-9);
      }
      
      planos.push(planoAtual);
      localStorage.setItem('lifeprod_planos_estudos', JSON.stringify(planos));
      setTemPlanoSalvo(true);
      alert('Plano salvo com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro ao salvar o plano.');
    } finally {
      setSaveLoading(false);
    }
  }

  function criarNovoPlano() {
    setMaterias([]);
    setHorasPorDia('');
    setDataProva('');
    setResultado(null);
    setError(null);
    setMostrarFormulario(true);
    setTemPlanoSalvo(false);
  }

  function adicionarMateria() {
    if (!novaMateria.trim()) return;
    
    setMaterias([
      ...materias,
      {
        id: Date.now().toString(),
        nome: novaMateria,
        dificuldade: dificuldade as 1 | 2 | 3 | 4 | 5
      }
    ]);
    setNovaMateria('');
    setDificuldade(3);
  }

  function removerMateria(id: string) {
    setMaterias(materias.filter(m => m.id !== id));
  }

  function calcularDiasAteProva() {
    if (!dataProva) return 30;
    const hoje = new Date();
    const prova = new Date(dataProva);
    const diffTime = prova.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 30;
  }

  async function gerarPlano() {
    if (materias.length === 0) {
      setError('Adicione pelo menos uma matéria');
      return;
    }
    if (!horasPorDia) {
      setError('Informe quantas horas por dia pode estudar');
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    const diasAteProva = Math.min(calcularDiasAteProva(), 14);

    const materiasTexto = materias.map(m => 
      `${m.nome}`
    ).join(', ');

    // 🔧 PROMPT OTIMIZADO - mais curto e direto para resposta mais rápida
    const prompt = `Crie um plano de estudos em JSON para 15 dias.

    Matérias: ${materiasTexto}
    Horas/dia: ${horasPorDia}

    Responda APENAS com JSON:
    {
      "cronograma": [{"dia":1,"materia":"nome","tempoMinutos":120,"topicos":["topico1"]}],
      "revisoes": ["Dia X: revisar Y"],
      "metaDiaria": "frase curta",
      "dicaEstudo": "dica curta",
      "materiasPrioridade": [{"nome":"Matéria","horasSemanais":8}]
    }`;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar plano de estudos');
      }

      let parsedResult;
      if (typeof data.data === 'string') {
        const cleanJson = data.data.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        parsedResult = JSON.parse(cleanJson);
      } else {
        parsedResult = data.data;
      }

      setResultado(parsedResult);
      setMostrarFormulario(false);
      
      setTimeout(() => {
        document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (err) {
      console.error('Erro detalhado:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  function copiarTexto(texto: string) {
    navigator.clipboard.writeText(texto);
    alert('Texto copiado para a área de transferência!');
  }

  function limparFormulario() {
    if (confirm('Tem certeza que deseja limpar tudo? O plano não salvo será perdido.')) {
      setMaterias([]);
      setHorasPorDia('');
      setDataProva('');
      setResultado(null);
      setError(null);
    }
  }

  const diasSemana = [
    { key: 'seg', label: 'Seg', emoji: '🇩🇪' },
    { key: 'ter', label: 'Ter', emoji: '🇹🇪' },
    { key: 'qua', label: 'Qua', emoji: '🇶🇺' },
    { key: 'qui', label: 'Qui', emoji: '🇶🇮' },
    { key: 'sex', label: 'Sex', emoji: '🇸🇪' },
    { key: 'sab', label: 'Sáb', emoji: '🇸🇦' },
    { key: 'dom', label: 'Dom', emoji: '🇩🇴' },
  ];

  async function handleExportPDF() {
    if (!resultado) return;
    setPdfLoading(true);
    try {

      const pdfFormData = {
        materias: materias,
        horasPorDia: horasPorDia,
        dataProva: dataProva,
        diasAteProva: calcularDiasAteProva()
      };

      await exportCalendarioEstudosPdf(resultado, pdfFormData, materias);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      setError('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="space-y-8 w-full">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          Organizador de Estudos com IA
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Crie um plano de estudos personalizado baseado nas suas matérias e tempo disponível
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 w-full">
        
        {/* Formulário - só mostra se mostrarFormulario for true */}
        {mostrarFormulario && (
          <Card className="w-full">
            <CardHeader className="p-8">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="w-6 h-6 text-purple-500" />
                Configure seu plano de estudos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8 pt-0">
              
              {/* Matérias */}
              <div>
                <Label className="text-base font-semibold mb-2 block">Matérias para estudar *</Label>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <Input
                    placeholder="Ex: Matemática, Português, História..."
                    value={novaMateria}
                    onChange={(e) => setNovaMateria(e.target.value)}
                    className="mt-2 text-base py-3 w-full"
                    onKeyPress={(e) => e.key === 'Enter' && adicionarMateria()}
                  />
                  <div className="flex gap-1 mt-0">
                    <select
                      value={dificuldade}
                      onChange={(e) => setDificuldade(Number(e.target.value) as 1|2|3|4)}
                      className="mt-2 text-base py-3 w-full border border-gray-300 rounded-lg text-black"
                    >
                      <option value={1}>Fácil</option>
                      <option value={2}>Médio</option>
                      <option value={3}>Difícil</option>
                      <option value={4}>Muito difícil</option>
                    </select>
                    
                    {materias.length < 5 ? (
                      <Button onClick={adicionarMateria} variant="outline" size="sm" className='mt-2 text-base py-3'>
                        <Plus className="w-3 h-3" />
                      </Button>
                    ) : (
                      <div className='flex items-center text-red-600 text-sm whitespace-nowrap'>
                        ⚠️ Máximo 5 matérias
                      </div>
                    )}
                  </div>
                </div>
                
                {materias.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {materias.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{m.nome}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                            {'L'.repeat(m.dificuldade)}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removerMateria(m.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Horas por dia */}
              <div>
                <Label className="text-base font-semibold">Horas disponíveis por dia *</Label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="Ex: 4"
                  value={horasPorDia}
                  onChange={(e) => setHorasPorDia(e.target.value)}
                  className="mt-2 text-base py-3 w-full"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Quantas horas você consegue estudar por dia?
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={gerarPlano} 
                  disabled={loading || materias.length == 0 || horasPorDia.length == 0}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2 h-9"
                >
                  {loading ? (
                    <>
                      <Loader2 className="flex w-4 h-4 animate-spin" />
                      Gerando plano...
                    </>
                  ) : (
                    <>
                      Gerar
                    </>
                  )}
                </Button>
                <Button onClick={limparFormulario} variant="outline" className='hover:bg-purple-200 flex-1 justify-center h-9'>
                  Limpar
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-base">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Resultado para PLANO RECÉM CRIADO - tem botão Salvar */}
        {resultado && !mostrarFormulario && !temPlanoSalvo && (
          <>
            <Card className="resultado w-full">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center justify-between text-xl flex-wrap gap-2">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    Seu plano de estudos personalizado
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => copiarTexto(JSON.stringify(resultado, null, 2))} className="flex h-9">
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                
                {/* Meta diária */}
                <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-l-purple-500">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Meta diária
                  </h3>
                  <p className="text-gray-800">{resultado.metaDiaria}</p>
                  <Button variant="ghost" size="sm" className="mt-2 h-8" onClick={() => copiarTexto(resultado.metaDiaria)}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar
                  </Button>
                </div>

                {/* Dica de estudo */}
                <div className="bg-yellow-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Dica de estudo</h3>
                  <p className="text-gray-700">{resultado.dicaEstudo}</p>
                  <Button variant="ghost" size="sm" className="mt-2 h-8" onClick={() => copiarTexto(resultado.dicaEstudo)}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar
                  </Button>
                </div>

                {/* Prioridade de matérias */}
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Distribuição de horas por semana
                  </h3>
                  <div className="space-y-2">
                    {resultado.materiasPrioridade.map((m, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-white rounded">
                        <span className="font-medium text-black">{m.nome}</span>
                        <span className="text-purple-600 font-semibold">{m.horasSemanais}h/semana</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-3 h-8" onClick={() => copiarTexto(resultado.materiasPrioridade.map(m => `${m.nome}: ${m.horasSemanais}h`).join('\n'))}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar distribuição
                  </Button>
                </div>

                {/* Cronograma */}
                <div className="bg-green-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Cronograma de estudos (próximos {resultado.cronograma.length} dias)
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {resultado.cronograma.slice(0, 14).map((item, i) => (
                      <div key={i} className="p-3 bg-white rounded-lg border">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-purple-600">Dia {item.dia}</span>
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                            {item.tempoMinutos} minutos
                          </span>
                        </div>
                        <p className="font-medium mt-1 text-black">{item.materia}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.topicos.slice(0, 3).map((topico, j) => (
                            <span key={j} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {topico}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {resultado.cronograma.length > 14 && (
                      <p className="text-sm text-gray-500 text-center pt-2">
                        + {resultado.cronograma.length - 14} dias restantes
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-3 h-8" onClick={() => copiarTexto(JSON.stringify(resultado.cronograma, null, 2))}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar cronograma
                  </Button>
                </div>

                {/* Revisões */}
                <div className="bg-red-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Dias de revisão sugeridos</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {resultado.revisoes.map((rev, i) => (
                      <li key={i}>{rev}</li>
                    ))}
                  </ul>
                  <Button variant="ghost" size="sm" className="mt-2 h-8" onClick={() => copiarTexto(resultado.revisoes.join('\n'))}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar revisões
                  </Button>
                </div>

                {/* Botões de ação - plano NOVO tem botão Salvar */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex flex-1 bg-purple-600 hover:bg-purple-700 h-9 justify-center"
                    onClick={handleExportPDF}
                    disabled={pdfLoading}
                  >
                    {pdfLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Calendar className="w-4 h-4 mr-2" />
                    )}
                    Exportar PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-1 h-9 justify-center"
                    onClick={salvarPlano}
                    disabled={saveLoading}
                  >
                    {saveLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Salvar plano
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Botão para criar novo plano */}
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={criarNovoPlano}
                className="flex gap-2 h-9"
              >
                <PlusCircle className="flex w-4 h-4" />
                Novo plano de estudos
              </Button>
            </div>
          </>
        )}

        {/* Resultado para PLANO JÁ SALVO - NÃO tem botão Salvar */}
        {resultado && !mostrarFormulario && temPlanoSalvo && (
          <>
            <Card className="resultado w-full">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center justify-between text-xl flex-wrap gap-2">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    Seu plano de estudos (salvo)
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => copiarTexto(JSON.stringify(resultado, null, 2))} className="flex h-9">
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                
                {/* Meta diária */}
                <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-l-purple-500">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Meta diária
                  </h3>
                  <p className="text-gray-800">{resultado.metaDiaria}</p>
                  <Button variant="ghost" size="sm" className="mt-2 h-8" onClick={() => copiarTexto(resultado.metaDiaria)}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar
                  </Button>
                </div>

                {/* Dica de estudo */}
                <div className="bg-yellow-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Dica de estudo</h3>
                  <p className="text-gray-700">{resultado.dicaEstudo}</p>
                  <Button variant="ghost" size="sm" className="mt-2 h-8" onClick={() => copiarTexto(resultado.dicaEstudo)}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar
                  </Button>
                </div>

                {/* Prioridade de matérias */}
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Distribuição de horas por semana
                  </h3>
                  <div className="space-y-2">
                    {resultado.materiasPrioridade.map((m, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-white rounded">
                        <span className="font-medium text-black">{m.nome}</span>
                        <span className="text-purple-600 font-semibold">{m.horasSemanais}h/semana</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-3 h-8" onClick={() => copiarTexto(resultado.materiasPrioridade.map(m => `${m.nome}: ${m.horasSemanais}h`).join('\n'))}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar distribuição
                  </Button>
                </div>

                {/* Cronograma */}
                <div className="bg-green-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Cronograma de estudos (próximos {resultado.cronograma.length} dias)
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {resultado.cronograma.slice(0, 14).map((item, i) => (
                      <div key={i} className="p-3 bg-white rounded-lg border">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-purple-600">Dia {item.dia}</span>
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                            {item.tempoMinutos} minutos
                          </span>
                        </div>
                        <p className="font-medium mt-1 text-black">{item.materia}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.topicos.slice(0, 3).map((topico, j) => (
                            <span key={j} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {topico}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {resultado.cronograma.length > 14 && (
                      <p className="text-sm text-gray-500 text-center pt-2">
                        + {resultado.cronograma.length - 14} dias restantes
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-3 h-8" onClick={() => copiarTexto(JSON.stringify(resultado.cronograma, null, 2))}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar cronograma
                  </Button>
                </div>

                {/* Revisões */}
                <div className="bg-red-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Dias de revisão sugeridos</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {resultado.revisoes.map((rev, i) => (
                      <li key={i}>{rev}</li>
                    ))}
                  </ul>
                  <Button variant="ghost" size="sm" className="mt-2 h-8" onClick={() => copiarTexto(resultado.revisoes.join('\n'))}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar revisões
                  </Button>
                </div>

                {/* Botões de ação - plano SALVO NÃO tem botão Salvar */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex flex-1 bg-purple-600 hover:bg-purple-700 h-9 justify-center"
                    onClick={handleExportPDF}
                    disabled={pdfLoading}
                  >
                    {pdfLoading ? (
                      <Loader2 className="flex w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Calendar className="flex w-4 h-4 mr-2" />
                    )}
                    Exportar PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Botão para criar novo plano */}
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={criarNovoPlano}
                className="flex gap-2 h-9"
              >
                <PlusCircle className="flex w-4 h-4" />
                Novo plano de estudos
              </Button>
            </div>
          </>
        )}

        {/* Loading state */}
        {loading && (
          <Card className="flex w-full text-center justify-center">
            <CardContent className="flex h-9">
              <Loader2 className="w-8 h-7 animate-spin text-purple-600 mx-auto mb-0 justify-center" />
              <p className="text-gray-600 justify-center">Gerando seu plano de estudos personalizado...</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dica de uso */}
      {!resultado && !loading && !mostrarFormulario && !temPlanoSalvo && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 w-full">
          <CardContent className="p-6">
            <p className="text-base text-gray-700">
              <span className="font-semibold">Dica:</span> Quanto mais específico você for sobre as matérias e dificuldades, 
              mais preciso será o plano de estudos. Seus planos são salvos automaticamente e podem ser recuperados!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}