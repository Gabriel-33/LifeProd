// app/tools/gerador-questoes/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Sparkles, 
  Loader2, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  BookOpen,
  CheckCircle,
  GraduationCap
} from 'lucide-react';

interface Topico {
  id: string;
  nome: string;
}

interface Questao {
  id: string;
  enunciado: string;
  alternativas: string[];
  respostaCorreta: number;
  dificuldade: 'facil' | 'medio' | 'dificil';
  respostaVisivel: boolean;
}

export default function GeradorQuestoesPage() {
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [novoTopico, setNovoTopico] = useState('');
  const [loading, setLoading] = useState(false);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [error, setError] = useState<string | null>(null);

  function adicionarTopico() {
    if (!novoTopico.trim() || topicos.length >= 4) return;
    setTopicos([...topicos, { id: Date.now().toString(), nome: novoTopico.trim() }]);
    setNovoTopico('');
  }

  function removerTopico(id: string) {
    setTopicos(topicos.filter(t => t.id !== id));
  }

  function toggleResposta(questaoId: string) {
    setQuestoes(questoes.map(q => 
      q.id === questaoId ? { ...q, respostaVisivel: !q.respostaVisivel } : q
    ));
  }

  async function gerarQuestoes() {
    if (topicos.length === 0) {
      setError('Adicione pelo menos um tópico');
      return;
    }

    setLoading(true);
    setError(null);

    const topicosTexto = topicos.map(t => t.nome).join(', ');

    const prompt = `9 questões múltipla escolha sobre: ${topicosTexto}. 
4 alternativas A-D. Distribua fácil/médio/difícil.
JSON: {"questoes":[{"enunciado":"","alternativas":["A) ","B) ","C) ","D) "],"respostaCorreta":0,"dificuldade":"facil"}]}
Apenas JSON.`;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erro ao gerar questões');

      let parsedResult;
      if (typeof data.data === 'string') {
        const cleanJson = data.data.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        parsedResult = JSON.parse(cleanJson);
      } else {
        parsedResult = data.data;
      }

      const questoesGeradas: Questao[] = parsedResult.questoes.map((q: any, idx: number) => ({
        id: `${Date.now()}-${idx}`,
        enunciado: q.enunciado,
        alternativas: q.alternativas,
        respostaCorreta: q.respostaCorreta,
        dificuldade: q.dificuldade,
        respostaVisivel: false
      }));

      setQuestoes(questoesGeradas);
      
      setTimeout(() => {
        document.getElementById('questoes')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (err) {
      console.error('Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  function getDificuldadeClass(dificuldade: string) {
    const classes = {
      facil: 'border-l-green-500 bg-green-50',
      medio: 'border-l-yellow-500 bg-yellow-50',
      dificil: 'border-l-red-500 bg-red-50',
    };
    return classes[dificuldade as keyof typeof classes] || 'border-l-gray-500';
  }

  const letras = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6 w-full px-4 sm:px-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          Gerador de Questões
        </h1>
        <p className="text-base sm:text-lg text-gray-500 mt-1 sm:mt-2">
          Crie questões de múltipla escolha sobre qualquer tópico
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-1">
        
        <Card className="flex-1">
          <CardHeader className="p-4 sm:p-3">
            <CardTitle className="flex items-center gap-1 text-lg sm:text-xl">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Configurar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
            
            <div>
              <Label className="text-sm sm:text-base font-semibold mb-2 block">Tópicos (até 4)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Matemática, História..."
                  value={novoTopico}
                  onChange={(e) => setNovoTopico(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarTopico()}
                  maxLength={40}
                />
                {topicos.length < 4 && (
                  <Button onClick={adicionarTopico} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {topicos.length >= 4 && (
                <p className="text-xs text-red-500 mt-1">Máximo de 4 tópicos</p>
              )}

              {topicos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {topicos.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 bg-blue-50 px-2 py-1 sm:px-3 rounded-full">
                      <span className="text-xs sm:text-sm text-blue-700">{t.nome}</span>
                      <button onClick={() => removerTopico(t.id)} className="text-blue-500 hover:text-red-500">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button 
              onClick={gerarQuestoes} 
              disabled={loading || topicos.length === 0}
              className="flex justify-center w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <><Loader2 className="flex w-4 h-4 mr-2 animate-spin" /> Gerando...</>
              ) : (
                <><Sparkles className="flex w-4 h-4 mr-2" /> Gerar Questões</>
              )}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Dicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
            <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
              <p className="font-semibold text-purple-800 text-sm sm:text-base">Seja específico</p>
              <p className="text-xs sm:text-sm text-gray-600">Tópicos detalhados geram questões melhores.</p>
            </div>
            <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
              <p className="font-semibold text-green-800 text-sm sm:text-base">Use para estudo</p>
              <p className="text-xs sm:text-sm text-gray-600">Ótimo para revisão e simulados.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {questoes.length > 0 && (
        <div id="questoes" className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              Questões ({questoes.length})
            </h2>
            <Button variant="outline" onClick={() => setQuestoes([])} size="sm" className="text-red-500">
              Limpar
            </Button>
          </div>

          {(['facil', 'medio', 'dificil'] as const).map((nivel) => {
            const questoesNivel = questoes.filter(q => q.dificuldade === nivel);
            if (questoesNivel.length === 0) return null;
            
            const labels = { facil: 'Fáceis', medio: 'Médias', dificil: 'Difíceis' };
            const cores = { facil: 'text-green-700', medio: 'text-yellow-700', dificil: 'text-red-700' };
            const bg = { facil: 'bg-green-500', medio: 'bg-yellow-500', dificil: 'bg-red-500' };
            
            return (
              <div key={nivel} className="mb-8">
                <h3 className={`text-base sm:text-lg font-semibold ${cores[nivel]} mb-3 flex items-center gap-2`}>
                  <span className={`w-2 h-2 ${bg[nivel]} rounded-full`}></span>
                  {labels[nivel]} ({questoesNivel.length})
                </h3>
                <div className="space-y-4">
                  {questoesNivel.map((questao, idx) => (
                    <Card key={questao.id} className={`border-l-4 ${getDificuldadeClass(questao.dificuldade)}`}>
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">Questão {idx + 1}</h4>
                          <button
                            onClick={() => toggleResposta(questao.id)}
                            className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-blue-600"
                          >
                            {questao.respostaVisivel ? (
                              <><EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> Ocultar</>
                            ) : (
                              <><Eye className="w-3 h-3 sm:w-4 sm:h-4" /> Mostrar</>
                            )}
                          </button>
                        </div>

                        <p className="text-gray-800 text-sm sm:text-base mb-4">{questao.enunciado}</p>

                        <div className="space-y-2 mb-4">
                          {questao.alternativas.map((alt, idxAlt) => (
                            <div 
                              key={idxAlt} 
                              className={`p-2 rounded-lg text-sm sm:text-base ${
                                questao.respostaVisivel && questao.respostaCorreta === idxAlt 
                                  ? 'bg-green-100 border border-green-300' 
                                  : 'bg-gray-50'
                              }`}
                            >
                              <span className="font-medium text-gray-700">{letras[idxAlt]})</span>{' '}
                              <span className="text-gray-600">{alt.substring(2)}</span>
                              {questao.respostaVisivel && questao.respostaCorreta === idxAlt && (
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 inline ml-2" />
                              )}
                            </div>
                          ))}
                        </div>

                        {questao.respostaVisivel && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs sm:text-sm text-green-700">
                              <span className="font-semibold">Resposta:</span> {letras[questao.respostaCorreta]})
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {questoes.length === 0 && !loading && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-gray-700">
              <span className="font-semibold">Dica:</span> Adicione tópicos específicos como "Funções matemáticas" 
              ou "Programação em Python" para questões mais direcionadas. Clique no olho para ver a resposta!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}