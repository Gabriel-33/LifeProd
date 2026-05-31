// app/tools/curriculo-ia/components/GeneratePDF.tsx
'use client';

import { jsPDF } from 'jspdf';
import { CurriculoResultado, FormDataPDF, RedeSocial, Experiencia, Educacao, Idioma, Projeto } from './CurriculoInterfaces';

// Função para formatar data de YYYY-MM para MM/YYYY
function formatarData(dataStr: string): string {
  if (!dataStr) return '';
  const partes = dataStr.split('-');
  if (partes.length === 2) {
    return `${partes[1]}/${partes[0]}`;
  }
  return dataStr;
}

export async function generatePDF(
  resultado: CurriculoResultado,
  formData: FormDataPDF,
  redesSociais: RedeSocial[],
  experiencias: Experiencia[],
  educacoes: Educacao[],
  idiomas: Idioma[],
  projetos: Projeto[]
) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Margens
  const margemEsq = 20;
  const margemDir = 190;
  const larguraUtil = margemDir - margemEsq;
  let y = 20;

  // Cores
  const azul: [number, number, number] = [37, 99, 235];
  const cinzaEscuro: [number, number, number] = [51, 51, 51];
  const cinzaMedio: [number, number, number] = [102, 102, 102];
  const branco: [number, number, number] = [255, 255, 255];

  // ── Cabeçalho ──
  doc.setFillColor(...azul);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(...branco);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(formData.nome.toUpperCase() || 'CURRÍCULO', margemEsq, 12);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.profissao} • ${formData.email}`, margemEsq, 26);

  y = 45;

  // ── Linha separadora ──
  const linhaHorizontal = () => {
    doc.setDrawColor(200, 200, 210);
    doc.line(margemEsq, y, margemDir, y);
    y += 6;
  };

  // ── Helper: título de seção ──
  const secao = (titulo: string) => {
    if (y > 270) { doc.addPage(); y = 25; linhaHorizontal(); }
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...azul);
    doc.text(titulo, margemEsq, y);
    y += 4;
    doc.setDrawColor(180, 180, 200);
    doc.line(margemEsq, y, margemDir, y);
    y += 8;
    doc.setTextColor(...cinzaEscuro);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
  };

  // ── Helper: texto com quebra ──
  const addTexto = (texto: string) => {
    if (!texto) return;
    doc.setFontSize(14);
    doc.setTextColor(...cinzaEscuro);
    const linhas = doc.splitTextToSize(texto, larguraUtil);
    linhas.forEach((linha: string) => {
      if (y > 270) { doc.addPage(); y = 25; }
      doc.text(linha, margemEsq, y);
      y += 5.5;
    });
    y += 3;
  };

  // ── RESUMO PROFISSIONAL ──
  secao('Resumo Profissional');
  
  doc.setFontSize(14);
  addTexto(resultado.resumoProfissional);

  // ── EXPERIÊNCIAS ──
  if (experiencias.length > 0) {
    secao('Experiência Profissional');
    
    experiencias.forEach(exp => {
      if (y > 270) { doc.addPage(); y = 25; }
      
      // Cargo e empresa em negrito
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...cinzaEscuro);
      const periodo = `${formatarData(exp.dataInicio) || ''} — ${exp.dataFim === 'atual' ? 'atual' : formatarData(exp.dataFim) || ''}`;
      doc.text(`${exp.cargo} — ${exp.empresa} (${periodo})`, margemEsq, y);
      
      y += 6;
      
      // Descrição
      if (exp.descricao) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(13);
        doc.setTextColor(...cinzaEscuro);
        const descLinhas = doc.splitTextToSize(exp.descricao, larguraUtil - 5);
        descLinhas.forEach((linha: string, idx: number) => {
          if (y > 270) { doc.addPage(); y = 25; }
          if (idx === 0) {
            doc.text(`• ${linha}`, margemEsq + 3, y);
          } else {
            doc.text(`  ${linha}`, margemEsq + 3, y);
          }
          y += 5.5;
        });
      }
      y += 4;
    });
  }

  // ── FORMAÇÃO ACADÊMICA ──
  if (educacoes.length > 0) {
    secao('Formação Acadêmica');
    
    educacoes.forEach(edu => {
      if (y > 270) { doc.addPage(); y = 25; }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...cinzaEscuro);
      const periodo = `${formatarData(edu.dataInicio) || ''} — ${formatarData(edu.dataFim) || ''}`;
      doc.text(`${edu.curso} — ${edu.instituicao} (${periodo})`, margemEsq, y);
      
      y += 9;
    });
  }

  // ── PROJETOS ──
  if (projetos.length > 0) {
    secao('Projetos');
    
    projetos.forEach(projeto => {
      if (y > 270) { doc.addPage(); y = 25; }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...cinzaEscuro);
      doc.text(projeto.nome, margemEsq, y);
      y += 5.5;
      
      if (projeto.descricao) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(13);
        doc.setTextColor(...cinzaEscuro);
        const descLinhas = doc.splitTextToSize(projeto.descricao, larguraUtil - 8);
        descLinhas.forEach((linha: string, idx: number) => {
          if (y > 270) { doc.addPage(); y = 25; }
          if (idx === 0) {
            doc.text(`• ${linha}`, margemEsq + 4, y);
          } else {
            doc.text(`  ${linha}`, margemEsq + 4, y);
          }
          y += 5;
        });
      }
      
      if (projeto.link) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(37, 99, 235);
        doc.textWithLink(projeto.link, margemEsq + 4, y, { url: projeto.link });
        y += 5;
      }
      y += 3;
    });
  }

  // ── HABILIDADES ──
  if (resultado.habilidadesPrincipais?.length > 0) {
    secao('Habilidades Técnicas');
    
    let linhaAtual = '';
    resultado.habilidadesPrincipais.forEach((hab, idx) => {
      const texto = idx === 0 ? hab : ` • ${hab}`;
      const larguraTexto = doc.getTextWidth(linhaAtual + texto);
      if (larguraTexto > larguraUtil - 10) {
        if (y > 270) { doc.addPage(); y = 25; }
        doc.setFontSize(13);
        doc.text(linhaAtual, margemEsq, y);
        y += 6;
        linhaAtual = hab;
      } else {
        linhaAtual += texto;
      }
    });
    if (linhaAtual) {
      if (y > 270) { doc.addPage(); y = 25; }
      doc.setFontSize(13);
      doc.text(linhaAtual, margemEsq, y);
      y += 8;
    }
  }

  // ── IDIOMAS ──
  if (idiomas.length > 0) {
    secao('Idiomas');
    
    idiomas.forEach(idioma => {
      if (y > 270) { doc.addPage(); y = 25; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...cinzaEscuro);
      doc.text(idioma.nome, margemEsq, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...cinzaMedio);
      const nivelTexto = idioma.nivel.charAt(0).toUpperCase() + idioma.nivel.slice(1);
      const larguraTexto = doc.getTextWidth(idioma.nome);
      doc.text(`• ${nivelTexto}`, margemEsq + larguraTexto + 5, y);
      y += 6;
    });
  }

  // ── LINKS / CONTATO ──
  if (redesSociais.length > 0) {
    linhaHorizontal();
    const contatos: string[] = [];
    if (formData.email) contatos.push(formData.email);
    redesSociais.forEach(rede => {
      if (rede.tipo === 'github') contatos.push(`github.com/${rede.url.split('/').pop()}`);
      if (rede.tipo === 'linkedin') contatos.push(`linkedin.com/in/${rede.url.split('/').pop()}`);
    });

    if (contatos.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(...cinzaMedio);
      doc.setFont('helvetica', 'normal');
      let linhaContatos = contatos.join('  |  ');
      const maxLargura = larguraUtil;
      if (doc.getTextWidth(linhaContatos) > maxLargura) {
        linhaContatos = contatos.join('\n');
      }
      const linhasContato = doc.splitTextToSize(linhaContatos, maxLargura);
      linhasContato.forEach((linha: string) => {
        if (y > 270) { doc.addPage(); y = 25; }
        doc.text(linha, margemEsq, y);
        y += 5;
      });
      y += 4;
    }
  }

  // ── Rodapé (todas as páginas) ──
  const totalPaginas = doc.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setDrawColor(200, 200, 210);
    doc.line(margemEsq, 285, margemDir, 285);
    doc.setFontSize(8);
    doc.setTextColor(...cinzaMedio);
    doc.setFont('helvetica', 'normal');
    doc.text('Gerado por LifeProd — lifeprod.vercel.app', margemEsq, 292);
    doc.text(`Página ${i} de ${totalPaginas}`, margemDir, 292, { align: 'right' });
  }

  // Salvar PDF
  const nomeArquivo = `Curriculo_${formData.nome.replace(/\s/g, '_')}.pdf`;
  doc.save(nomeArquivo);
}