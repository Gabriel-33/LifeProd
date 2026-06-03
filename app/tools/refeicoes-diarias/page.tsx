// app/tools/refeicoes-diarias/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Utensils, 
  Plus, 
  Trash2, 
  Apple, 
  Coffee, 
  Sun, 
  Moon,
  Beef,
  Wheat,
  Flame,
  Loader2,
  Sparkles
} from 'lucide-react';

// Interfaces
interface Alimento {
  id: string;
  nome: string;
  proteinas: number;
  carboidratos: number;
  calorias: number;
}

interface ItemRefeicao {
  alimentoId: string;
  quantidade: number;
  alimento?: Alimento;
}

interface Refeicao {
  id: string;
  nome: string;
  tipo: 'cafe' | 'almoco' | 'janta' | 'lancheManha' | 'lancheTarde';
  itens: ItemRefeicao[];
  horario: string;
}

const MAX_ITENS_POR_REFEICAO = 4;

// Configurações das refeições
const refeicoesConfig = [
  { id: 'cafe', nome: 'Café da Manhã', tipo: 'obrigatoria', icone: Coffee, cor: 'bg-yellow-100', textCor: 'text-yellow-700', horarioPadrao: '08:00' },
  { id: 'lancheManha', nome: 'Lanche da Manhã', tipo: 'opcional', icone: Apple, cor: 'bg-orange-100', textCor: 'text-orange-700', horarioPadrao: '10:30' },
  { id: 'almoco', nome: 'Almoço', tipo: 'obrigatoria', icone: Sun, cor: 'bg-green-100', textCor: 'text-green-700', horarioPadrao: '12:30' },
  { id: 'lancheTarde', nome: 'Lanche da Tarde', tipo: 'opcional', icone: Apple, cor: 'bg-orange-100', textCor: 'text-orange-700', horarioPadrao: '16:00' },
  { id: 'janta', nome: 'Jantar', tipo: 'obrigatoria', icone: Moon, cor: 'bg-blue-100', textCor: 'text-blue-700', horarioPadrao: '19:30' },
];

export default function RefeicoesDiariasPage() {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [novoAlimento, setNovoAlimento] = useState({ nome: '', proteinas: '', carboidratos: '', calorias: '' });
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<'alimentos' | 'refeicoes'>('alimentos');
  const [mensagemLimite, setMensagemLimite] = useState<string | null>(null);
  const [buscandoIA, setBuscandoIA] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    const alimentosSalvos = localStorage.getItem('lifeprod_alimentos');
    const refeicoesSalvas = localStorage.getItem('lifeprod_refeicoes');
    
    if (alimentosSalvos) {
      try {
        setAlimentos(JSON.parse(alimentosSalvos));
      } catch (e) { console.error('Erro ao carregar alimentos:', e); }
    }
    
    if (refeicoesSalvas) {
      try {
        const parsed = JSON.parse(refeicoesSalvas);
        const refeicoesComAlimentos = parsed.map((ref: Refeicao) => ({
          ...ref,
          itens: ref.itens.map((item: ItemRefeicao) => ({
            ...item,
            alimento: JSON.parse(alimentosSalvos || '[]').find((a: Alimento) => a.id === item.alimentoId)
          }))
        }));
        setRefeicoes(refeicoesComAlimentos);
      } catch (e) { console.error('Erro ao carregar refeições:', e); }
    }
    
    setLoading(false);
  }, []);

  // Salvar alimentos no localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('lifeprod_alimentos', JSON.stringify(alimentos));
    }
  }, [alimentos, loading]);

  // Salvar refeições no localStorage
  useEffect(() => {
    if (!loading) {
      const refeicoesToSave = refeicoes.map(ref => ({
        ...ref,
        itens: ref.itens.map(item => ({ alimentoId: item.alimentoId, quantidade: item.quantidade }))
      }));
      localStorage.setItem('lifeprod_refeicoes', JSON.stringify(refeicoesToSave));
    }
  }, [refeicoes, loading]);

  // Limpar mensagem após 3 segundos
  useEffect(() => {
    if (mensagemLimite) {
      const timer = setTimeout(() => setMensagemLimite(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagemLimite]);

  // Buscar informações nutricionais com IA
  async function buscarInfoNutricional(nomeAlimento: string) {
    setBuscandoIA(true);
    
    const prompt = `Responda APENAS com JSON. Para 100 gramas de ${nomeAlimento}, informe:
{
  "proteinas": numero,
  "carboidratos": numero,
  "calorias": numero
}

Use valores aproximados e realistas. Apenas o JSON, sem texto adicional.`;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar informações');
      }

      let parsedResult;
      if (typeof data.data === 'string') {
        const cleanJson = data.data.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        parsedResult = JSON.parse(cleanJson);
      } else {
        parsedResult = data.data;
      }

      setNovoAlimento({
        nome: novoAlimento.nome,
        proteinas: parsedResult.proteinas?.toString() || '',
        carboidratos: parsedResult.carboidratos?.toString() || '',
        calorias: parsedResult.calorias?.toString() || ''
      });
    } catch (err) {
      console.error('Erro ao buscar informações:', err);
      alert('Não foi possível buscar as informações nutricionais. Preencha manualmente.');
    } finally {
      setBuscandoIA(false);
    }
  }

  function adicionarAlimento() {
    if (!novoAlimento.nome.trim()) return;
    if (alimentos.length >= 6) {
      alert('Limite de 6 alimentos atingido!');
      return;
    }
    
    const proteinas = parseFloat(novoAlimento.proteinas) || 0;
    const carboidratos = parseFloat(novoAlimento.carboidratos) || 0;
    const calorias = parseFloat(novoAlimento.calorias) || 0;
    
    if (proteinas < 0 || carboidratos < 0 || calorias < 0) {
      alert('Valores devem ser positivos');
      return;
    }
    
    const novo: Alimento = {
      id: Date.now().toString(),
      nome: novoAlimento.nome.trim(),
      proteinas,
      carboidratos,
      calorias,
    };
    
    setAlimentos([...alimentos, novo]);
    setNovoAlimento({ nome: '', proteinas: '', carboidratos: '', calorias: '' });
  }

  function removerAlimento(id: string) {
    if (confirm('Remover este alimento? Todas as refeições que o utilizam serão afetadas.')) {
      setAlimentos(alimentos.filter(a => a.id !== id));
      setRefeicoes(refeicoes.map(ref => ({
        ...ref,
        itens: ref.itens.filter(item => item.alimentoId !== id)
      })));
    }
  }

  function inicializarRefeicoes() {
    const refeicoesIniciais: Refeicao[] = refeicoesConfig.map(config => ({
      id: config.id,
      nome: config.nome,
      tipo: config.id as any,
      itens: [],
      horario: config.horarioPadrao
    }));
    setRefeicoes(refeicoesIniciais);
  }

  function adicionarItemRefeicao(refeicaoId: string, alimentoId: string, quantidade: number) {
    if (!alimentoId || quantidade <= 0) return;
    
    const refeicao = refeicoes.find(r => r.id === refeicaoId);
    if (refeicao && refeicao.itens.length >= MAX_ITENS_POR_REFEICAO) {
      setMensagemLimite(`Máximo de ${MAX_ITENS_POR_REFEICAO} alimentos por refeição!`);
      return;
    }
    
    const alimento = alimentos.find(a => a.id === alimentoId);
    if (!alimento) return;
    
    setRefeicoes(refeicoes.map(ref => {
      if (ref.id !== refeicaoId) return ref;
      
      const itemExistente = ref.itens.find(item => item.alimentoId === alimentoId);
      if (itemExistente) {
        return {
          ...ref,
          itens: ref.itens.map(item => 
            item.alimentoId === alimentoId 
              ? { ...item, quantidade: item.quantidade + quantidade }
              : item
          )
        };
      }
      
      return {
        ...ref,
        itens: [...ref.itens, { alimentoId, quantidade, alimento }]
      };
    }));
  }

  function removerItemRefeicao(refeicaoId: string, alimentoId: string) {
    setRefeicoes(refeicoes.map(ref => {
      if (ref.id !== refeicaoId) return ref;
      return {
        ...ref,
        itens: ref.itens.filter(item => item.alimentoId !== alimentoId)
      };
    }));
  }

  function atualizarHorario(refeicaoId: string, horario: string) {
    setRefeicoes(refeicoes.map(ref => 
      ref.id === refeicaoId ? { ...ref, horario } : ref
    ));
  }

  function calcularNutrientes(refeicao: Refeicao) {
    let proteinas = 0, carboidratos = 0, calorias = 0;
    
    refeicao.itens.forEach(item => {
      const alimento = alimentos.find(a => a.id === item.alimentoId);
      if (alimento) {
        const fator = item.quantidade / 100;
        proteinas += alimento.proteinas * fator;
        carboidratos += alimento.carboidratos * fator;
        calorias += alimento.calorias * fator;
      }
    });
    
    return { proteinas: proteinas.toFixed(1), carboidratos: carboidratos.toFixed(1), calorias: Math.round(calorias) };
  }

  function calcularTotaisDia() {
    let proteinas = 0, carboidratos = 0, calorias = 0;
    
    refeicoes.forEach(ref => {
      const nutri = calcularNutrientes(ref);
      proteinas += parseFloat(nutri.proteinas);
      carboidratos += parseFloat(nutri.carboidratos);
      calorias += nutri.calorias;
    });
    
    return { proteinas: proteinas.toFixed(1), carboidratos: carboidratos.toFixed(1), calorias };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  const totaisDia = calcularTotaisDia();

  return (
    <div className="space-y-6 w-full px-4 sm:px-6 pb-20">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <Utensils className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
          Refeições Diárias
        </h1>
        <p className="text-base sm:text-lg text-gray-500 mt-1 sm:mt-2">
          Cadastre seus alimentos e monte suas refeições do dia (máx. {MAX_ITENS_POR_REFEICAO} alimentos por refeição)
        </p>
      </div>

      {mensagemLimite && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm text-center">
          {mensagemLimite}
        </div>
      )}

      {refeicoes.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-blue-50">
            <CardContent className="p-3 sm:p-4 text-center">
              <Beef className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-gray-500">Proteínas</p>
              <p className="text-lg sm:text-xl font-bold text-blue-600">{totaisDia.proteinas}g</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="p-3 sm:p-4 text-center">
              <Wheat className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-gray-500">Carboidratos</p>
              <p className="text-lg sm:text-xl font-bold text-green-600">{totaisDia.carboidratos}g</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50">
            <CardContent className="p-3 sm:p-4 text-center">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-gray-500">Calorias</p>
              <p className="text-lg sm:text-xl font-bold text-red-600">{totaisDia.calorias}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setAbaAtiva('alimentos')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${abaAtiva === 'alimentos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Alimentos ({alimentos.length}/6)
        </button>
        <button
          onClick={() => setAbaAtiva('refeicoes')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${abaAtiva === 'refeicoes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Refeições
        </button>
      </div>

      {abaAtiva === 'alimentos' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Apple className="w-5 h-5 text-green-600" />
                Cadastrar Alimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label>Nome do alimento</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Ex: Ovo, Frango, Arroz, Banana..."
                      value={novoAlimento.nome}
                      onChange={(e) => setNovoAlimento({ ...novoAlimento, nome: e.target.value })}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => buscarInfoNutricional(novoAlimento.nome)}
                      disabled={!novoAlimento.nome.trim() || buscandoIA}
                      variant="outline"
                      className="flex whitespace-nowrap"
                    >
                      {buscandoIA ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="flex w-4 h-4" />
                      )}
                      <span className="flex flex-1 ml-2 hidden sm:inline">Buscar com IA</span>
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Digite o nome e clique em "Buscar com IA" para preencher automaticamente</p>
                </div>
                <div>
                  <Label>Proteínas (g por 100g)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 13"
                    value={novoAlimento.proteinas}
                    onChange={(e) => setNovoAlimento({ ...novoAlimento, proteinas: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Carboidratos (g por 100g)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 1.1"
                    value={novoAlimento.carboidratos}
                    onChange={(e) => setNovoAlimento({ ...novoAlimento, carboidratos: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Calorias (kcal por 100g)</Label>
                  <Input
                    type="number"
                    step="1"
                    placeholder="Ex: 155"
                    value={novoAlimento.calorias}
                    onChange={(e) => setNovoAlimento({ ...novoAlimento, calorias: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={adicionarAlimento} disabled={alimentos.length >= 6} className="flex w-full bg-green-600 hover:bg-green-700 justify-center">
                Adicionar Alimento
              </Button>
              {alimentos.length >= 6 && <p className="text-red-500 text-sm text-center">Limite de 6 alimentos atingido!</p>}
            </CardContent>
          </Card>

          {alimentos.length > 0 && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Lista de Alimentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 sm:p-6 pt-0">
                {alimentos.map((alimento) => (
                  <div key={alimento.id} className="flex flex-wrap items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{alimento.nome}</p>
                      <p className="text-xs text-gray-500">
                        Prot: {alimento.proteinas}g | Carb: {alimento.carboidratos}g | Cal: {alimento.calorias} kcal (por 100g)
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removerAlimento(alimento.id)} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {alimentos.length === 0 && (
            <Card className="bg-yellow-50">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">Cadastre pelo menos um alimento para começar a montar suas refeições!</p>
              </CardContent>
            </Card>
          )}

          {alimentos.length > 0 && refeicoes.length === 0 && (
            <Button onClick={inicializarRefeicoes} className="w-full bg-blue-600 hover:bg-blue-700">
              Iniciar Refeições
            </Button>
          )}
        </div>
      )}

      {abaAtiva === 'refeicoes' && refeicoes.length > 0 && (
        <div className="space-y-6">
          {refeicoes.map((refeicao) => {
            const config = refeicoesConfig.find(c => c.id === refeicao.id);
            const Icone = config?.icone || Utensils;
            const nutri = calcularNutrientes(refeicao);
            const limiteAtingido = refeicao.itens.length >= MAX_ITENS_POR_REFEICAO;
            
            return (
              <Card key={refeicao.id} className={`${config?.cor} border-none`}>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icone className={`w-5 h-5 ${config?.textCor}`} />
                      <CardTitle className={`text-lg sm:text-xl ${config?.textCor}`}>{refeicao.nome}</CardTitle>
                      {config?.tipo === 'opcional' && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Opcional</span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {refeicao.itens.length}/{MAX_ITENS_POR_REFEICAO}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={refeicao.horario}
                        onChange={(e) => atualizarHorario(refeicao.id, e.target.value)}
                        className="w-28 h-8 text-sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                  {refeicao.itens.length > 0 && (
                    <div className="space-y-2">
                      {refeicao.itens.map((item) => {
                        const alimento = alimentos.find(a => a.id === item.alimentoId);
                        if (!alimento) return null;
                        return (
                          <div key={item.alimentoId} className="flex flex-wrap items-center justify-between p-2 bg-white rounded-lg gap-2">
                            <div>
                              <span className="font-medium text-black">{alimento.nome}</span>
                              <span className="text-sm text-gray-500 ml-2">{item.quantidade}g</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{((alimento.proteinas * item.quantidade) / 100).toFixed(1)}g prot</span>
                              <span>{((alimento.carboidratos * item.quantidade) / 100).toFixed(1)}g carb</span>
                              <span>{Math.round((alimento.calorias * item.quantidade) / 100)} kcal</span>
                              <Button variant="ghost" size="sm" onClick={() => removerItemRefeicao(refeicao.id, item.alimentoId)} className="text-red-500 p-1">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {alimentos.length > 0 && !limiteAtingido && (
                    <div className="flex flex-wrap items-end gap-2 pt-2">
                      <div className="flex-1 min-w-[120px]">
                        <Label className="text-xs">Adicionar alimento</Label>
                        <select
                          onChange={(e) => {
                            const alimentoId = e.target.value;
                            if (!alimentoId) return;
                            const quantidade = prompt('Quantidade em gramas:', '100');
                            if (quantidade && !isNaN(parseFloat(quantidade))) {
                              adicionarItemRefeicao(refeicao.id, alimentoId, parseFloat(quantidade));
                            }
                            e.target.value = '';
                          }}
                          value=""
                          className="w-full px-2 py-1 text-sm border rounded-lg text-black"
                        >
                          <option value="">Selecione...</option>
                          {alimentos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {limiteAtingido && (
                    <p className="text-xs text-red-500 text-center">Limite de {MAX_ITENS_POR_REFEICAO} alimentos atingido!</p>
                  )}

                  {(refeicao.itens.length > 0 || parseFloat(nutri.proteinas) > 0) && (
                    <div className="pt-3 border-t flex flex-wrap justify-between gap-2 text-sm">
                      <span className="text-gray-600">Totais:</span>
                      <span className="text-blue-600">{nutri.proteinas}g prot</span>
                      <span className="text-green-600">{nutri.carboidratos}g carb</span>
                      <span className="text-red-600">{nutri.calorias} kcal</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-bold text-gray-800 mb-3">Resumo do Dia</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500">Proteínas</p>
                  <p className="text-xl font-bold text-blue-600">{totaisDia.proteinas}g</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Carboidratos</p>
                  <p className="text-xl font-bold text-green-600">{totaisDia.carboidratos}g</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Calorias</p>
                  <p className="text-xl font-bold text-red-600">{totaisDia.calorias}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}