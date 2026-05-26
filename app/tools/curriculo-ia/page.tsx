// app/tools/curriculo-ia/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {generatePDF} from './GeneratePdf';
import {CurriculoResultado, FormDataPDF, RedeSocial, Experiencia, Educacao, Idioma, Projeto} from './CurriculoInterfaces';

import { 
  FileText, 
  Loader2, 
  Copy, 
  Download, 
  Sparkles, 
  Plus, 
  Trash2,
  FolderGit,
  NetworkIcon,
  User2Icon,
  Briefcase,
  GraduationCap,
  Globe,
  FolderGit2
} from 'lucide-react';

// ─── Componente Principal ──────────────────────────────────────────────────
export default function CurriculoIAPage() {
  // ─── Estados dos arrays dinâmicos ────────────────────────────────────────
  const [redesSociais, setRedesSociais] = useState<RedeSocial[]>([]);
  const [novaRedeTipo, setNovaRedeTipo] = useState<'linkedin' | 'github' | 'instagram'>('linkedin');
  const [novaRedeUrl, setNovaRedeUrl] = useState('');

  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [novaExperiencia, setNovaExperiencia] = useState<Omit<Experiencia, 'id'>>({
    empresa: '',
    cargo: '',
    dataInicio: '',
    dataFim: '',
    descricao: ''
  });

  const [educacoes, setEducacoes] = useState<Educacao[]>([]);
  const [novaEducacao, setNovaEducacao] = useState<Omit<Educacao, 'id'>>({
    instituicao: '',
    curso: '',
    dataInicio: '',
    dataFim: ''
  });

  const [idiomas, setIdiomas] = useState<Idioma[]>([]);
  const [novoIdioma, setNovoIdioma] = useState({ nome: '', nivel: 'intermediario' as const });

  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [novoProjeto, setNovoProjeto] = useState({ nome: '', descricao: '', link: '' });

  // ─── Estados simples ─────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    endereco: '',
    profissao: '',
    habilidades: '',
    nivel: 'pleno',
  });

  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [resultado, setResultado] = useState<CurriculoResultado | null>(null);
  const [error, setError] = useState<string | null>(null);

  const niveis = [
    { value: 'estagiario', label: 'Estagiário' },
    { value: 'junior', label: 'Júnior' },
    { value: 'pleno', label: 'Pleno' },
    { value: 'senior', label: 'Sênior' },
    { value: 'especialista', label: 'Especialista' },
  ];

  // ─── Funções para Redes Sociais ──────────────────────────────────────────
  function adicionarRedeSocial() {
    if (!novaRedeUrl.trim()) return;
    setRedesSociais([
      ...redesSociais,
      { id: Date.now().toString(), tipo: novaRedeTipo, url: novaRedeUrl }
    ]);
    setNovaRedeUrl('');
  }

  function removerRedeSocial(id: string) {
    setRedesSociais(redesSociais.filter(r => r.id !== id));
  }

  // ─── Funções para Experiências ───────────────────────────────────────────
  function adicionarExperiencia() {
    if (!novaExperiencia.empresa || !novaExperiencia.cargo) return;
    setExperiencias([...experiencias, { ...novaExperiencia, id: Date.now().toString() }]);
    setNovaExperiencia({ empresa: '', cargo: '', dataInicio: '', dataFim: '', descricao: '' });
  }

  function removerExperiencia(id: string) {
    setExperiencias(experiencias.filter(e => e.id !== id));
  }

  // ─── Funções para Educação ───────────────────────────────────────────────
  function adicionarEducacao() {
    if (!novaEducacao.instituicao || !novaEducacao.curso) return;
    setEducacoes([...educacoes, { ...novaEducacao, id: Date.now().toString() }]);
    setNovaEducacao({ instituicao: '', curso: '', dataInicio: '', dataFim: '' });
  }

  function removerEducacao(id: string) {
    setEducacoes(educacoes.filter(e => e.id !== id));
  }

  // ─── Funções para Idiomas ────────────────────────────────────────────────
  function adicionarIdioma() {
    if (!novoIdioma.nome.trim()) return;
    setIdiomas([...idiomas, { ...novoIdioma, id: Date.now().toString() }]);
    setNovoIdioma({ nome: '', nivel: 'intermediario' });
  }

  function removerIdioma(id: string) {
    setIdiomas(idiomas.filter(i => i.id !== id));
  }

  // ─── Funções para Projetos ───────────────────────────────────────────────
  function adicionarProjeto() {
    if (!novoProjeto.nome.trim()) return;
    setProjetos([...projetos, { ...novoProjeto, id: Date.now().toString() }]);
    setNovoProjeto({ nome: '', descricao: '', link: '' });
  }

  function removerProjeto(id: string) {
    setProjetos(projetos.filter(p => p.id !== id));
  }

  // ─── Formatar dados para o prompt da IA ──────────────────────────────────
  function formatarDadosParaPrompt() {
    const redesTexto = redesSociais.map(r => `${r.tipo}: ${r.url}`).join('\n');
    const experienciasTexto = experiencias.map(e => 
      `${e.empresa} - ${e.cargo} (${e.dataInicio} a ${e.dataFim || 'atual'}): ${e.descricao}`
    ).join('\n');
    const educacoesTexto = educacoes.map(e => 
      `${e.instituicao} - ${e.curso} (${e.dataInicio} a ${e.dataFim})`
    ).join('\n');
    const idiomasTexto = idiomas.map(i => `${i.nome} - ${i.nivel}`).join('\n');
    const projetosTexto = projetos.map(p => `${p.nome}: ${p.descricao} - ${p.link}`).join('\n');

    return {
      redesTexto,
      experienciasTexto,
      educacoesTexto,
      idiomasTexto,
      projetosTexto
    };
  }

  // ─── Gerar currículo com IA ──────────────────────────────────────────────
  async function gerarCurriculo() {
    if (!formData.profissao) {
      setError('Preencha pelo menos a profissão');
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    const { redesTexto, experienciasTexto, educacoesTexto, idiomasTexto, projetosTexto } = formatarDadosParaPrompt();

    const habilidadesArray = formData.habilidades
      .split(',')
      .map((h) => h.trim())
      .filter((h) => h);

    const prompt = `
      Você é um especialista em recrutamento e currículos ATS.

      Com base nas informações do usuário, gere um currículo profissional moderno e objetivo.

      DADOS DO USUÁRIO:

      Nome: ${formData.nome}
      Profissão: ${formData.profissao}
      Nível: ${formData.nivel}
      Habilidades informadas: ${formData.habilidades}

      REDES SOCIAIS:
      ${redesTexto || 'Não informado'}

      EXPERIÊNCIAS:
      ${experienciasTexto || 'Não informado'}

      EDUCAÇÃO:
      ${educacoesTexto || 'Não informado'}

      IDIOMAS:
      ${idiomasTexto || 'Não informado'}

      PROJETOS:
      ${projetosTexto || 'Não informado'}

      Retorne APENAS um JSON válido:

      {
        "resumoProfissional": "string com resumo profissional impactante",
        "habilidadesPrincipais": ["string", "string"],
        "descricoesMelhoradas": "string com a experiência profissional otimizada",
        "palavrasChaveATS": ["string", "string"]
      }

      REGRAS:
      - Não invente empresas ou experiências
      - O resumo deve ser profissional e otimizado para ATS
      - Use palavras-chave relevantes para a área
      - Seja objetivo e direto
    `;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erro ao gerar currículo');

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

  // ─── Download PDF (simplificado) ─────────────────────────────────────────
  async function handleDownloadPDF() {
  if (!resultado) return;
  setDownloadLoading(true);
  try {
    await generatePDF(
      resultado,
      {
        nome: formData.nome,
        profissao: formData.profissao,
        nivel: formData.nivel,
        dataNascimento: formData.dataNascimento,
        endereco: formData.endereco,
      },
      redesSociais,
      experiencias,
      educacoes,
      idiomas,
      projetos
    );
  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
    setError('Erro ao gerar o PDF. Tente novamente.');
  } finally {
    setDownloadLoading(false);
  }
}

  function copiarTexto(texto: string) {
    navigator.clipboard.writeText(texto);
    alert('Texto copiado para a área de transferência!');
  }

  function limparFormulario() {
    setFormData({
      nome: '',
      dataNascimento: '',
      endereco: '',
      profissao: '',
      habilidades: '',
      nivel: 'pleno',
    });
    setRedesSociais([]);
    setExperiencias([]);
    setEducacoes([]);
    setIdiomas([]);
    setProjetos([]);
    setResultado(null);
    setError(null);
  }

  // ─── Renderização ────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 w-full">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-500" />
          Currículo com IA
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Crie um currículo profissional otimizado para ATS com campos dinâmicos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Formulário Principal */}
        <Card>
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="w-5 h-5 text-blue-500" />
              Suas informações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6 pt-0">
            {/* Informações Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome completo *</Label>
                <Input
                  placeholder="Ex: Gabriel Ennos da Silva"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Data de nascimento</Label>
                <Input
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Endereço</Label>
              <Input
                placeholder="Cidade - Estado"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Redes Sociais - DINÂMICO */}
            <div className="border rounded-lg p-4">
              <Label className="font-semibold mb-2 block"> Redes Sociais</Label>
              {redesSociais.map((rede) => (
                <div key={rede.id} className="flex items-center gap-2 mb-2">
                  {rede.tipo === 'linkedin' && <FolderGit className="w-4 h-4 text-blue-600" />}
                  {rede.tipo === 'github' && <NetworkIcon className="w-4 h-4 text-gray-800" />}
                  {rede.tipo === 'instagram' && <User2Icon className="w-4 h-4 text-pink-600" />}
                  <span className="text-sm flex-1">{rede.url}</span>
                  <Button variant="ghost" size="sm" onClick={() => removerRedeSocial(rede.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <select
                  value={novaRedeTipo}
                  onChange={(e) => setNovaRedeTipo(e.target.value as any)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="instagram">Instagram</option>
                </select>
                <Input
                  placeholder="URL completa"
                  value={novaRedeUrl}
                  onChange={(e) => setNovaRedeUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={adicionarRedeSocial} variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Profissão e Nível */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Profissão *</Label>
                <Input
                  placeholder="Ex: Desenvolvedor Front-end"
                  value={formData.profissao}
                  onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Nível profissional</Label>
                <select
                  value={formData.nivel}
                  onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                >
                  {niveis.map((n) => (
                    <option key={n.value} value={n.value}>{n.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Habilidades */}
            <div>
              <Label>Habilidades técnicas</Label>
              <Input
                placeholder="React, TypeScript, Python (separadas por vírgula)"
                value={formData.habilidades}
                onChange={(e) => setFormData({ ...formData, habilidades: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Experiências - DINÂMICO */}
            <div className="border rounded-lg p-4">
              <Label className="font-semibold mb-2 block flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Experiências Profissionais
              </Label>
              {experiencias.map((exp) => (
                <div key={exp.id} className="bg-gray-50 p-3 rounded-lg mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{exp.cargo} @ {exp.empresa}</p>
                      <p className="text-sm text-gray-500">{exp.dataInicio} - {exp.dataFim || 'atual'}</p>
                      <p className="text-sm mt-1">{exp.descricao}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removerExperiencia(exp.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <Input placeholder="Empresa" value={novaExperiencia.empresa} onChange={(e) => setNovaExperiencia({ ...novaExperiencia, empresa: e.target.value })} />
                <Input placeholder="Cargo" value={novaExperiencia.cargo} onChange={(e) => setNovaExperiencia({ ...novaExperiencia, cargo: e.target.value })} />
                <Input placeholder="Mês/Ano início" value={novaExperiencia.dataInicio} onChange={(e) => setNovaExperiencia({ ...novaExperiencia, dataInicio: e.target.value })} />
                <Input placeholder="Mês/Ano fim (ou 'atual')" value={novaExperiencia.dataFim} onChange={(e) => setNovaExperiencia({ ...novaExperiencia, dataFim: e.target.value })} />
                <Textarea placeholder="Descrição das atividades" className="md:col-span-2" value={novaExperiencia.descricao} onChange={(e) => setNovaExperiencia({ ...novaExperiencia, descricao: e.target.value })} rows={2} />
                <Button onClick={adicionarExperiencia} variant="outline" className="md:col-span-2">
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Experiência
                </Button>
              </div>
            </div>

            {/* Educação - DINÂMICO */}
            <div className="border rounded-lg p-4">
              <Label className="font-semibold mb-2 block flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Formação Acadêmica
              </Label>
              {educacoes.map((edu) => (
                <div key={edu.id} className="bg-gray-50 p-3 rounded-lg mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{edu.curso}</p>
                      <p className="text-sm text-gray-500">{edu.instituicao}</p>
                      <p className="text-xs text-gray-400">{edu.dataInicio} - {edu.dataFim}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removerEducacao(edu.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <Input placeholder="Instituição" value={novaEducacao.instituicao} onChange={(e) => setNovaEducacao({ ...novaEducacao, instituicao: e.target.value })} />
                <Input placeholder="Curso" value={novaEducacao.curso} onChange={(e) => setNovaEducacao({ ...novaEducacao, curso: e.target.value })} />
                <Input placeholder="Mês/Ano início" value={novaEducacao.dataInicio} onChange={(e) => setNovaEducacao({ ...novaEducacao, dataInicio: e.target.value })} />
                <Input placeholder="Mês/Ano fim" value={novaEducacao.dataFim} onChange={(e) => setNovaEducacao({ ...novaEducacao, dataFim: e.target.value })} />
                <Button onClick={adicionarEducacao} variant="outline" className="md:col-span-2">
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Formação
                </Button>
              </div>
            </div>

            {/* Idiomas - DINÂMICO */}
            <div className="border rounded-lg p-4">
              <Label className="font-semibold mb-2 block flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Idiomas
              </Label>
              {idiomas.map((idioma) => (
                <div key={idioma.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg mb-2">
                  <span>{idioma.nome} - <span className="capitalize">{idioma.nivel}</span></span>
                  <Button variant="ghost" size="sm" onClick={() => removerIdioma(idioma.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input placeholder="Idioma (ex: Inglês)" value={novoIdioma.nome} onChange={(e) => setNovoIdioma({ ...novoIdioma, nome: e.target.value })} className="flex-1" />
                <select value={novoIdioma.nivel} onChange={(e) => setNovoIdioma({ ...novoIdioma, nivel: e.target.value as any })} className="px-3 py-2 border rounded-lg">
                  <option value="basico">Básico</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                  <option value="fluente">Fluente</option>
                </select>
                <Button onClick={adicionarIdioma} variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Projetos - DINÂMICO */}
            <div className="border rounded-lg p-4">
              <Label className="font-semibold mb-2 block flex items-center gap-2">
                <FolderGit2 className="w-4 h-4" />
                Projetos
              </Label>
              {projetos.map((projeto) => (
                <div key={projeto.id} className="bg-gray-50 p-3 rounded-lg mb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold">{projeto.nome}</p>
                      <p className="text-sm text-gray-600">{projeto.descricao}</p>
                      {projeto.link && <a href={projeto.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">{projeto.link}</a>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removerProjeto(projeto.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="space-y-2 mt-2">
                <Input placeholder="Nome do projeto" value={novoProjeto.nome} onChange={(e) => setNovoProjeto({ ...novoProjeto, nome: e.target.value })} />
                <Textarea placeholder="Descrição do projeto" value={novoProjeto.descricao} onChange={(e) => setNovoProjeto({ ...novoProjeto, descricao: e.target.value })} rows={2} />
                <Input placeholder="Link do projeto (GitHub, deploy...)" value={novoProjeto.link} onChange={(e) => setNovoProjeto({ ...novoProjeto, link: e.target.value })} />
                <Button onClick={adicionarProjeto} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Projeto
                </Button>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-4 pt-4">
              <Button onClick={gerarCurriculo} disabled={loading} className="flex-1 bg-purple-600 hover:bg-purple-700">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {loading ? 'Gerando...' : 'Gerar Currículo com IA'}
              </Button>
              <Button onClick={limparFormulario} variant="outline" className="flex-1">Limpar tudo</Button>
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>}
          </CardContent>
        </Card>

        {/* Resultado */}
        {resultado && (
          <Card className="resultado">
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                <span className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" /> Currículo gerado pela IA</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copiarTexto(JSON.stringify(resultado, null, 2))}><Copy className="w-4 h-4 mr-1" /> Copiar tudo</Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={downloadLoading}>
                    {downloadLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span className="ml-1">PDF</span>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2"> Resumo Profissional</h3>
                <p className="text-gray-700">{resultado.resumoProfissional}</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => copiarTexto(resultado.resumoProfissional)}><Copy className="w-3 h-3 mr-1" /> Copiar</Button>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2"> Experiência Otimizada</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{resultado.descricoesMelhoradas}</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => copiarTexto(resultado.descricoesMelhoradas)}><Copy className="w-3 h-3 mr-1" /> Copiar</Button>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2"> Palavras-chave ATS</h3>
                <div className="flex flex-wrap gap-2 mb-2">{resultado.palavrasChaveATS.map((kw, i) => (<span key={i} className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm">{kw}</span>))}</div>
                <Button variant="ghost" size="sm" onClick={() => copiarTexto(resultado.palavrasChaveATS.join(', '))}><Copy className="w-3 h-3 mr-1" /> Copiar lista</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dica */}
      {!resultado && !loading && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-4"><p className="text-sm text-gray-600">💡 <span className="font-semibold">Dica:</span> Adicione suas experiências, formações e projetos. Quanto mais completo, melhor será o currículo gerado!</p></CardContent>
        </Card>
      )}
    </div>
  );
}