// app/tools/bio-linkedin/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Loader2, Copy, Sparkles, User, Briefcase, Hash } from 'lucide-react';

interface BioResultado {
  bioCurta: string;
  bioMedia: string;
  bioLonga: string;
  hashtags: string[];
  fraseAbertura: string;
  habilidadesDestacadas: string[];
}

export default function BioLinkedinPage() {
  const [formData, setFormData] = useState({
    profissao: '',
    conquistas: '',
    tom: 'profissional'
  });
  
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<BioResultado | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tons = [
    { value: 'profissional', label: 'Profissional' },
    { value: 'casual', label: 'Casual / Amigável' },
    { value: 'criativo', label: 'Criativo / Diferente' },
    { value: 'inspirador', label: 'Inspirador / Motivacional' },
    { value: 'direto', label: 'Direto / Impactante' },
  ];

  async function gerarBio() {
    if (!formData.profissao) {
      setError('Preencha pelo menos a profissão');
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    const prompt = `Você é um especialista em marketing pessoal e LinkedIn.

Dados do usuário:
- Profissão: ${formData.profissao}
- Principais conquistas: ${formData.conquistas || 'Não informado'}
- Tom desejado: ${formData.tom}

Gere um JSON com o seguinte formato (responda APENAS com o JSON, sem markdown):
{
  "bioCurta": "string (máximo 120 caracteres - para o resumo que aparece no topo)",
  "bioMedia": "string (máximo 300 caracteres - versão média para o sobre)",
  "bioLonga": "string (máximo 600 caracteres - versão completa e detalhada)",
  "hashtags": ["string"] (5 hashtags relevantes para a área, sem o # na string),
  "fraseAbertura": "string (frase de impacto para começar a bio)",
  "habilidadesDestacadas": ["string"] (5 habilidades principais para destacar)
}

Regras:
- Use o tom ${formData.tom} em todas as respostas
- Seja profissional mas autêntico
- Destaque valor, não apenas tarefas
- Bio curta deve ser extremamente direta ao ponto
- Bio longa pode contar uma breve história/carreira

Retorne APENAS o JSON solicitado.`;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar bio');
      }

      let parsedResult;
      if (typeof data.data === 'string') {
        const cleanJson = data.data.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        parsedResult = JSON.parse(cleanJson);
      } else {
        parsedResult = data.data;
      }

      setResultado(parsedResult);
      
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
    setFormData({
      profissao: '',
      conquistas: '',
      tom: 'profissional'
    });
    setResultado(null);
    setError(null);
  }

  return (
    <div className="space-y-8 w-full">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <User className="w-8 h-8 text-blue-600" />
          Bio para LinkedIn com IA
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Crie uma bio profissional e impactante para seu perfil do LinkedIn
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 w-full">
        
        {/* Formulário */}
        <Card className="w-full">
          <CardHeader className="p-8">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="w-6 h-6 text-blue-500" />
              Suas informações profissionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-0">
            <div>
              <Label className="text-base font-semibold">Profissão / Cargo *</Label>
              <Input
                placeholder="Ex: Desenvolvedor Full Stack, Gerente de Marketing, Consultor de Vendas..."
                value={formData.profissao}
                onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                className="mt-2 text-base py-3 w-full"
              />
            </div>

            <div>
              <Label className="text-base font-semibold">Principais conquistas</Label>
              <Textarea
                placeholder="Ex: Aumentei as vendas em 40% em 6 meses\nLiderei equipe de 10 pessoas\nLançamento de produto com 10k usuários..."
                value={formData.conquistas}
                onChange={(e) => setFormData({ ...formData, conquistas: e.target.value })}
                className="mt-2 text-base w-full"
                rows={6}
              />
              <p className="text-sm text-gray-400 mt-2">
                Inclua números e resultados sempre que possível
              </p>
            </div>

            <div>
              <Label className="text-base font-semibold">Tom da bio</Label>
              <select
                value={formData.tom}
                onChange={(e) => setFormData({ ...formData, tom: e.target.value })}
                className="w-full mt-2 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                {tons.map(t => (
                  <option key={t.value} value={t.value} className="text-black">{t.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                onClick={gerarBio} 
                disabled={loading || formData.profissao.length === 0}
                className="flex-1 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando bio...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar Bio com IA
                  </>
                )}
              </Button>
              <Button onClick={limparFormulario} variant="outline" className='hover:bg-purple-200 flex-1 justify-center'>
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

        {/* Resultado */}
        {resultado && (
          <Card className="resultado w-full">
            <CardHeader className="p-8">
              <CardTitle className="flex items-center justify-between text-xl">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  Bio gerada pela IA
                </span>
                <Button variant="outline" onClick={() => copiarTexto(JSON.stringify(resultado, null, 2))}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar tudo
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8 pt-0">
              
              {/* Frase de abertura */}
              <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-l-purple-500">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Frase de abertura
                </h3>
                <p className="text-gray-800 text-lg italic">"{resultado.fraseAbertura}"</p>
                <Button variant="ghost" size="sm" className="mt-3" onClick={() => copiarTexto(resultado.fraseAbertura)}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar
                </Button>
              </div>

              {/* Bio Curta */}
              <div className="bg-blue-50 p-5 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">📱 Bio Curta (120 caracteres)</h3>
                <p className="text-gray-700">{resultado.bioCurta}</p>
                <div className="text-xs text-gray-400 mt-1">{resultado.bioCurta.length} caracteres</div>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => copiarTexto(resultado.bioCurta)}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar
                </Button>
              </div>

              {/* Bio Média */}
              <div className="bg-green-50 p-5 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">📄 Bio Média (300 caracteres)</h3>
                <p className="text-gray-700">{resultado.bioMedia}</p>
                <div className="text-xs text-gray-400 mt-1">{resultado.bioMedia.length} caracteres</div>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => copiarTexto(resultado.bioMedia)}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar
                </Button>
              </div>

              {/* Bio Longa */}
              <div className="bg-yellow-50 p-5 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">📖 Bio Longa (600 caracteres)</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{resultado.bioLonga}</p>
                <div className="text-xs text-gray-400 mt-1">{resultado.bioLonga.length} caracteres</div>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => copiarTexto(resultado.bioLonga)}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar
                </Button>
              </div>

              {/* Habilidades Destacadas */}
              <div className="bg-indigo-50 p-5 rounded-lg">
                <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Habilidades para destacar
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resultado.habilidadesDestacadas.map((hab, i) => (
                    <span key={i} className="bg-indigo-200 text-indigo-800 px-3 py-1.5 rounded-full text-sm font-medium">
                      {hab}
                    </span>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-3" onClick={() => copiarTexto(resultado.habilidadesDestacadas.join(', '))}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar lista
                </Button>
              </div>

              {/* Hashtags */}
              <div className="bg-gray-100 p-5 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Hashtags sugeridas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resultado.hashtags.map((tag, i) => (
                    <span key={i} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-3" onClick={() => copiarTexto(resultado.hashtags.map(t => `#${t}`).join(' '))}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar hashtags
                </Button>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-4 pt-4 border-t">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <User className="w-4 h-4 mr-2" />
                  Atualizar LinkedIn
                </Button>
                <Button variant="outline" className="flex-1">
                  Salvar para depois
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dica de uso */}
      {!resultado && !loading && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 w-full">
          <CardContent className="p-6">
            <p className="text-base text-gray-700">
              <span className="font-semibold">Dica:</span> Perfis com bios completas recebem até 30% mais visualizações. 
              Use números e resultados nas suas conquistas para destacar seu impacto!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}