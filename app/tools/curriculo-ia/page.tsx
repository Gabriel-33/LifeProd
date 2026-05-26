// app/tools/curriculo-ia/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
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

// ─── Interfaces ─────────────────────────────────────────────────────────────
interface CurriculoResultado {
  resumoProfissional: string;
  habilidadesPrincipais: string[];
  descricoesMelhoradas: string;
  palavrasChaveATS: string[];
}

interface RedeSocial {
  id: string;
  tipo: 'linkedin' | 'github' | 'instagram';
  url: string;
}

interface Experiencia {
  id: string;
  empresa: string;
  cargo: string;
  dataInicio: string;
  dataFim: string;
  descricao: string;
}

interface Educacao {
  id: string;
  instituicao: string;
  curso: string;
  dataInicio: string;
  dataFim: string;
}

interface Idioma {
  id: string;
  nome: string;
  nivel: 'basico' | 'intermediario' | 'avancado' | 'fluente';
}

interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  link: string;
}

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

  // ─── Construtor PDF (simplificado) ─────────────────────────────────────────

    async function baixarPDF(
      resultado: CurriculoResultado,
      redesSociais: RedeSocial[],
      experiencias: Experiencia[],
      educacoes: Educacao[],
      idiomas: Idioma[],
      projetos: Projeto[]
    ) {
      // Carrega jsPDF dinamicamente
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF({ unit: 'mm', format: 'a4' });

      const margemEsq = 20;
      const margemDir = 190;
      const larguraUtil = margemDir - margemEsq;
      let y = 20;

      // Cores
      const azul: [number, number, number] = [37, 99, 235];
      const roxo: [number, number, number] = [124, 58, 237];
      const cinzaEscuro: [number, number, number] = [31, 41, 55];
      const cinzaMedio: [number, number, number] = [107, 114, 128];
      const branco: [number, number, number] = [255, 255, 255];

      // ── Cabeçalho com gradiente simulado ──
      doc.setFillColor(...azul);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFillColor(...roxo);
      doc.rect(140, 0, 70, 40, 'F');

      doc.setTextColor(...branco);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(formData.nome.toLocaleUpperCase(), margemEsq, 18);

      doc.setFontSize(15);
      doc.setFont('helvetica', 'normal');
      doc.text(`${formData.profissao}  •  Nível: ${formData.nivel.charAt(0).toUpperCase() + formData.nivel.slice(1)}`, margemEsq, 30);

      doc.setFontSize(12);
      doc.setTextColor(200, 210, 255);
      doc.text('Gerado com LifeProd IA', margemDir, 36, { align: 'right' });

      y = 50;

      // ── Helper: título de seção ──
      const secao = (titulo: string, corFundo: [number, number, number]) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFillColor(...corFundo);
        doc.roundedRect(margemEsq, y, larguraUtil, 8, 2, 2, 'F');
        doc.setTextColor(...branco);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(titulo, margemEsq + 4, y + 5.5);
        y += 12;
        doc.setTextColor(...cinzaEscuro);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
      };

      // ── Helper: texto com quebra automática ──
      const addTexto = (texto: string, corTexto: [number, number, number] = cinzaEscuro) => {
        if (!texto) return;
        doc.setTextColor(...corTexto);
        const linhas = doc.splitTextToSize(texto, larguraUtil);
        linhas.forEach((linha: string) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(linha, margemEsq, y);
          y += 6;
        });
        y += 3;
      };

      // ── Helper: campo com label ──
      const addCampo = (label: string, valor: string) => {
        if (!valor) return;
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...cinzaEscuro);
        doc.text(`${label}:`, margemEsq, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...cinzaMedio);
        const larguraLabel = doc.getTextWidth(`${label}: `);
        const linhas = doc.splitTextToSize(valor, larguraUtil - larguraLabel);
        doc.text(linhas[0], margemEsq + larguraLabel, y);
        for (let i = 1; i < linhas.length; i++) {
          y += 5;
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(linhas[i], margemEsq, y);
        }
        y += 8;
      };

      // ── INFORMAÇÕES PESSOAIS ──
      secao('INFORMAÇÕES PESSOAIS', [37, 99, 235]);
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(margemEsq, y - 2, larguraUtil, 35, 2, 2, 'F');
      
      addCampo('Nome', formData.nome || 'Não informado');
      if (formData.dataNascimento) addCampo('Data de Nascimento', new Date(formData.dataNascimento).toLocaleDateString('pt-BR'));
      if (formData.endereco) addCampo('Endereço', formData.endereco);
      
      y += 5;

      // ── REDES SOCIAIS ──
      if (redesSociais.length > 0) {
        secao('REDES SOCIAIS', [37, 99, 235]);
        doc.setFillColor(239, 246, 255);
        const alturaRedes = Math.min(redesSociais.length * 8 + 8, 60);
        doc.roundedRect(margemEsq, y - 2, larguraUtil, alturaRedes, 2, 2, 'F');
        
        redesSociais.forEach(rede => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...cinzaEscuro);
          doc.text(`${rede.tipo.charAt(0).toUpperCase() + rede.tipo.slice(1)}:`, margemEsq, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(37, 99, 235);
          doc.textWithLink(rede.url, margemEsq + 35, y, { url: rede.url });
          y += 7;
        });
        y += 5;
      }

      // ── RESUMO PROFISSIONAL ──
      secao('RESUMO PROFISSIONAL', [37, 99, 235]);
      doc.setFillColor(239, 246, 255);
      const linhasResumo = doc.splitTextToSize(resultado.resumoProfissional, larguraUtil);
      const alturaResumo = linhasResumo.length * 6 + 8;
      doc.roundedRect(margemEsq, y - 2, larguraUtil, alturaResumo, 2, 2, 'F');
      addTexto(resultado.resumoProfissional, [30, 64, 175]);
      y += 4;

      // ── EXPERIÊNCIAS ──
      if (experiencias.length > 0) {
        secao('EXPERIÊNCIAS PROFISSIONAIS', [16, 185, 129]);
        
        experiencias.forEach(exp => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.setFillColor(220, 250, 240);
          doc.roundedRect(margemEsq, y - 2, larguraUtil, 8, 2, 2, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(16, 185, 129);
          doc.text(`${exp.cargo} - ${exp.empresa}`, margemEsq + 4, y + 4);
          y += 8;
          
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(...cinzaMedio);
          doc.setFontSize(15);
          doc.text(`${exp.dataInicio} - ${exp.dataFim || 'atual'}`, margemEsq + 4, y);
          y += 6;
          
          if (exp.descricao) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...cinzaEscuro);
            doc.setFontSize(12);
            const descLinhas = doc.splitTextToSize(exp.descricao, larguraUtil - 8);
            descLinhas.forEach((linha: string) => {
              if (y > 270) { doc.addPage(); y = 20; }
              doc.text(`• ${linha}`, margemEsq + 6, y);
              y += 5;
            });
          }
          y += 6;
        });
      } else {
        secao('EXPERIÊNCIAS PROFISSIONAIS', [16, 185, 129]);
        addTexto(resultado.descricoesMelhoradas);
      }
      y += 4;

      // ── FORMAÇÃO ACADÊMICA ──
      if (educacoes.length > 0) {
        secao('FORMAÇÃO ACADÊMICA', [124, 58, 237]);
        
        educacoes.forEach(edu => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.setFillColor(240, 235, 255);
          doc.roundedRect(margemEsq, y - 2, larguraUtil, 8, 2, 2, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(124, 58, 237);
          doc.text(edu.curso, margemEsq + 4, y + 4);
          y += 8;
          
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(...cinzaMedio);
          doc.setFontSize(12);
          doc.text(`${edu.instituicao} | ${edu.dataInicio} - ${edu.dataFim}`, margemEsq + 4, y);
          y += 10;
        });
      }

      // ── IDIOMAS ──
      if (idiomas.length > 0) {
        secao('IDIOMAS', [124, 58, 237]);
        
        idiomas.forEach(idioma => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...cinzaEscuro);
          doc.text(idioma.nome, margemEsq, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...cinzaMedio);
          const nivelTexto = idioma.nivel.charAt(0).toUpperCase() + idioma.nivel.slice(1);
          doc.text(`- ${nivelTexto}`, margemEsq + 40, y);
          y += 7;
        });
        y += 4;
      }

      // ── PROJETOS ──
      if (projetos.length > 0) {
        secao('PROJETOS', [249, 115, 22]);
        
        projetos.forEach(projeto => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.setFillColor(255, 240, 220);
          doc.roundedRect(margemEsq, y - 2, larguraUtil, 8, 2, 2, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(249, 115, 22);
          doc.text(projeto.nome, margemEsq + 4, y + 4);
          y += 8;
          
          if (projeto.descricao) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...cinzaEscuro);
            const descLinhas = doc.splitTextToSize(projeto.descricao, larguraUtil - 8);
            descLinhas.forEach((linha: string) => {
              if (y > 270) { doc.addPage(); y = 20; }
              doc.text(`• ${linha}`, margemEsq + 6, y);
              y += 5;
            });
          }
          
          if (projeto.link) {
            y += 2;
            doc.setTextColor(37, 99, 235);
            doc.setFontSize(12);
            doc.textWithLink(projeto.link, margemEsq + 6, y, { url: projeto.link });
            y += 6;
          }
          y += 4;
        });
      }

      // ── HABILIDADES PRINCIPAIS ──
      if (resultado.habilidadesPrincipais?.length > 0) {
        secao('HABILIDADES PRINCIPAIS', [124, 58, 237]);
        
        let linhaAtual = '';
        resultado.habilidadesPrincipais.forEach((hab, idx) => {
          const texto = idx === 0 ? hab : ` • ${hab}`;
          if (doc.getTextWidth(linhaAtual + texto) > larguraUtil - 10) {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.text(linhaAtual, margemEsq + 4, y);
            y += 6;
            linhaAtual = hab;
          } else {
            linhaAtual += texto;
          }
        });
        if (linhaAtual) {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(linhaAtual, margemEsq + 4, y);
          y += 8;
        }
      }

      // ── PALAVRAS-CHAVE ATS ──
      secao('PALAVRAS-CHAVE ATS', [124, 58, 237]);
      
      resultado.palavrasChaveATS.forEach((kw) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFillColor(237, 233, 254);
        doc.setTextColor(109, 40, 217);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const largKw = doc.getTextWidth(kw) + 8;
        doc.roundedRect(margemEsq, y - 4, largKw, 7, 2, 2, 'F');
        doc.text(kw, margemEsq + 4, y + 0.5);
        y += 9;
      });

      // ── Rodapé ──
      const totalPaginas = doc.getNumberOfPages();
      for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setDrawColor(229, 231, 235);
        doc.line(margemEsq, 285, margemDir, 285);
        doc.setFontSize(12);
        doc.setTextColor(...cinzaMedio);
        doc.setFont('helvetica', 'normal');
        doc.text('Gerado por LifeProd — lifeprod.com', margemEsq, 290);
        doc.text(`Página ${i} de ${totalPaginas}`, margemDir, 290, { align: 'right' });
      }

      doc.save(`curriculo-${formData.profissao.toLowerCase().replace(/\s+/g, '-') || 'profissional'}.pdf`);
    }

  // ─── Download PDF (simplificado) ─────────────────────────────────────────
  async function handleDownloadPDF() {
  if (!resultado) return;
    setDownloadLoading(true);
    try {
      await baixarPDF(
        resultado,
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