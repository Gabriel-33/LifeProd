// app/tools/curriculo-ia/page.tsx (VERSÃO CORRIGIDA)
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { FileText, Loader2, Copy, Download, Sparkles } from 'lucide-react';

interface CurriculoResultado {
  resumoProfissional: string;
  descricoesMelhoradas: string;
  palavrasChaveATS: string[];
  conquistasSugeridas: string[];
}

export default function CurriculoIAPage() {
  const [formData, setFormData] = useState({
    profissao: '',
    experiencia: '',
    habilidades: '',
    nivel: 'pleno'
  });
  
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<CurriculoResultado | null>(null);
  const [error, setError] = useState<string | null>(null);

  const niveis = [
    { value: 'estagiario', label: 'Estagiário' },
    { value: 'junior', label: 'Júnior' },
    { value: 'pleno', label: 'Pleno' },
    { value: 'senior', label: 'Sênior' },
    { value: 'especialista', label: 'Especialista' },
  ];

  async function gerarCurriculo() {
    if (!formData.profissao || !formData.experiencia) {
      setError('Preencha pelo menos a profissão e a experiência');
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    const habilidadesArray = formData.habilidades
      .split(',')
      .map(h => h.trim())
      .filter(h => h);

    const prompt = `Você é um especialista em recrutamento e currículos ATS.
    
      Dados do usuário:
      - Profissão: ${formData.profissao}
      - Experiência: ${formData.experiencia}
      - Habilidades: ${habilidadesArray.join(', ') || 'Não informado'}
      - Nível: ${formData.nivel}

      Gere um JSON com o seguinte formato (responda APENAS com o JSON, sem markdown):
      {
        "resumoProfissional": "string (2-3 frases impactantes com palavras-chave da área)",
        "descricoesMelhoradas": "string (versão melhorada da experiência, adicionando conquistas mensuráveis quando possível)",
        "palavrasChaveATS": ["string"] (máximo 8 palavras-chave importantes para a área),
        "conquistasSugeridas": ["string"] (3 sugestões de conquistas com métricas para incluir)
      }

      Regras importantes:
      - Não invente informações que não foram fornecidas
      - Seja profissional e objetivo
      - Use termos da área de ${formData.profissao}
      - As conquistas sugeridas devem ser realistas para o nível ${formData.nivel}`;

    try {
      // 🔧 CORREÇÃO AQUI: Adicionei os headers!
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // ← ESSA LINHA ESTAVA FALTANDO
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar currículo');
      }

      // O retorno agora já é o objeto parseado (se você ajustou o route.ts)
      let parsedResult;
      
      if (typeof data.data === 'string') {
        // Se veio string, faz o parse
        const cleanJson = data.data.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        parsedResult = JSON.parse(cleanJson);
      } else {
        // Se já veio objeto
        parsedResult = data.data;
      }

      setResultado(parsedResult);
      
      // Scroll para o resultado
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
      experiencia: '',
      habilidades: '',
      nivel: 'pleno'
    });
    setResultado(null);
    setError(null);
  }

  return (
    <div className="space-y-2">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Currículo com IA
        </h1>
        <p className="text-gray-500 mt-1">
          Crie um currículo profissional otimizado para ATS em segundos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Suas informações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Profissão *</Label>
              <Input
                placeholder="Ex: Desenvolvedor Front-end, Analista de Marketing..."
                value={formData.profissao}
                onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Experiência profissional *</Label>
              <Textarea
                placeholder="Descreva suas experiências anteriores, empresas, tempo de atuação..."
                value={formData.experiencia}
                onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                className="mt-1"
                rows={5}
              />
            </div>

            <div>
              <Label>Habilidades técnicas</Label>
              <Input
                placeholder="React, TypeScript, Python, Gestão de projetos (separadas por vírgula)"
                value={formData.habilidades}
                onChange={(e) => setFormData({ ...formData, habilidades: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">
                Separe as habilidades por vírgula
              </p>
            </div>

            <div>
              <Label>Nível profissional</Label>
              <select
                value={formData.nivel}
                onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                {niveis.map(n => (
                  <option key={n.value} value={n.value} className="text-black">{n.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                onClick={gerarCurriculo} 
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando currículo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Currículo com IA
                  </>
                )}
              </Button>
              <Button onClick={limparFormulario} variant="outline">
                Limpar
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultado */}
        {resultado && (
          <Card className="resultado lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Currículo gerado pela IA
                </span>
                <Button variant="outline" size="sm" onClick={() => copiarTexto(JSON.stringify(resultado, null, 2))}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar tudo
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumo Profissional */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">📌 Resumo Profissional</h3>
                <p className="text-gray-700">{resultado.resumoProfissional}</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => copiarTexto(resultado.resumoProfissional)}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar
                </Button>
              </div>

              {/* Descrições Melhoradas */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">💼 Experiência Otimizada</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{resultado.descricoesMelhoradas}</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => copiarTexto(resultado.descricoesMelhoradas)}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar
                </Button>
              </div>

              {/* Palavras-chave ATS */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">🔑 Palavras-chave ATS</h3>
                <div className="flex flex-wrap gap-2">
                  {resultado.palavrasChaveATS.map((kw, i) => (
                    <span key={i} className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm">
                      {kw}
                    </span>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => copiarTexto(resultado.palavrasChaveATS.join(', '))}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar lista
                </Button>
              </div>

              {/* Conquistas Sugeridas */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">🏆 Conquistas para destacar</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {resultado.conquistasSugeridas.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => copiarTexto(resultado.conquistasSugeridas.join('\n'))}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar
                </Button>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar como PDF
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  Salvar currículo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dica de uso */}
      {!resultado && !loading && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">
              💡 <span className="font-semibold">Dica:</span> Quanto mais detalhada for sua experiência, 
              melhor será o currículo gerado. Inclua empresas, tempo de atuação e projetos relevantes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}