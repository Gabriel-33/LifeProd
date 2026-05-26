// app/tools/curriculo-ia/components/GeneratePDF.tsx
'use client';

import { jsPDF } from 'jspdf';
import {CurriculoResultado, FormDataPDF, RedeSocial, Experiencia, Educacao, Idioma, Projeto} from './CurriculoInterfaces';

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

  // Margens maiores
  const margemEsq = 15;
  const margemDir = 195;
  const larguraUtil = margemDir - margemEsq;
  let y = 25;

  // Cores
  const azul: [number, number, number] = [37, 99, 235];
  const roxo: [number, number, number] = [124, 58, 237];
  const cinzaEscuro: [number, number, number] = [31, 41, 55];
  const cinzaMedio: [number, number, number] = [75, 85, 99];
  const branco: [number, number, number] = [255, 255, 255];

  // ── Cabeçalho ──
  doc.setFillColor(...azul);
  doc.rect(0, 0, 210, 45, 'F');
  doc.setFillColor(...roxo);
  doc.rect(140, 0, 70, 45, 'F');

  doc.setTextColor(...branco);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(formData.nome.toUpperCase() || 'CURRÍCULO', margemEsq, 22);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.profissao}  •  Nível: ${formData.nivel.charAt(0).toUpperCase() + formData.nivel.slice(1)}`, margemEsq, 35);

  doc.setFontSize(9);
  doc.setTextColor(200, 210, 255);
  doc.text('Gerado com LifeProd IA', margemDir - 5, 40, { align: 'right' });

  y = 55;

  // ── Helper: título de seção ──
  const secao = (titulo: string, corFundo: [number, number, number]) => {
    if (y > 265) { doc.addPage(); y = 25; }
    doc.setFillColor(...corFundo);
    doc.roundedRect(margemEsq, y, larguraUtil, 9, 2, 2, 'F');
    doc.setTextColor(...branco);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, margemEsq + 5, y + 6.5);
    y += 15;
    doc.setTextColor(...cinzaEscuro);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
  };

  // ── Helper: texto com quebra automática ──
  const addTexto = (texto: string, corTexto: [number, number, number] = cinzaEscuro) => {
    if (!texto) return;
    doc.setTextColor(...corTexto);
    doc.setFontSize(11);
    const linhas = doc.splitTextToSize(texto, larguraUtil - 6);
    linhas.forEach((linha: string) => {
      if (y > 265) { doc.addPage(); y = 25; }
      doc.text(linha, margemEsq + 3, y);
      y += 6.5;
    });
    y += 3;
  };

  // ── Helper: campo com label ──
  const addCampo = (label: string, valor: string) => {
    if (!valor) return;
    if (y > 265) { doc.addPage(); y = 25; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...cinzaEscuro);
    doc.text(`${label}:`, margemEsq + 4, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cinzaMedio);
    const larguraLabel = doc.getTextWidth(`${label}: `);
    const linhas = doc.splitTextToSize(valor, larguraUtil - 12 - larguraLabel);
    doc.text(linhas[0], 20 + larguraLabel, y);
    for (let i = 1; i < linhas.length; i++) {
      y += 5.5;
      if (y > 265) { doc.addPage(); y = 25; }
      doc.text(linhas[i], 19, y);
    }
    y += 7;
  };

  // ── INFORMAÇÕES PESSOAIS ──
  secao('INFORMAÇÕES PESSOAIS', [37, 99, 235]);
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(margemEsq, y - 5, larguraUtil, 32, 2, 2, 'F');
  
  addCampo('Nome', formData.nome || 'Não informado');
  if (formData.dataNascimento) addCampo('Data de Nascimento', new Date(formData.dataNascimento).toLocaleDateString('pt-BR'));
  if (formData.endereco) addCampo('Endereço', formData.endereco);
  
  y += 3;

  // ── REDES SOCIAIS ──
  if (redesSociais.length > 0) {
    secao('REDES SOCIAIS', [37, 99, 235]);
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(margemEsq, y - 5, larguraUtil, redesSociais.length * 7.5 + 8, 2, 2, 'F');
    
    redesSociais.forEach(rede => {
      if (y > 265) { doc.addPage(); y = 25; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...cinzaEscuro);
      doc.text(`${rede.tipo.charAt(0).toUpperCase() + rede.tipo.slice(1)}:`, margemEsq + 3, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(37, 99, 235);
      doc.textWithLink(rede.url, margemEsq + 22, y, { url: rede.url });
      y += 7.5;
    });
    y += 5;
  }

  // ── RESUMO PROFISSIONAL ──
  secao('RESUMO PROFISSIONAL', [37, 99, 235]);
  doc.setFillColor(239, 246, 255);
  const linhasResumo = doc.splitTextToSize(resultado.resumoProfissional, larguraUtil - 6);
  const alturaResumo = linhasResumo.length * 6.5 + 8;
  doc.roundedRect(margemEsq, y - 5, larguraUtil, alturaResumo, 2, 2, 'F');
  addTexto(resultado.resumoProfissional, [30, 64, 175]);
  y += 3;

  // ── EXPERIÊNCIAS ──
  if (experiencias.length > 0) {
    secao('EXPERIÊNCIAS PROFISSIONAIS', [16, 185, 129]);
    
    experiencias.forEach(exp => {
      if (y > 265) { doc.addPage(); y = 25; }
      doc.setFillColor(220, 250, 240);
      doc.roundedRect(margemEsq, y - 3, larguraUtil, 9, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11.5);
      doc.setTextColor(16, 185, 129);
      doc.text(`${exp.cargo} - ${exp.empresa}`, margemEsq + 5, y + 3.5);
      y += 10;
      
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...cinzaMedio);
      doc.text(`${exp.dataInicio} - ${exp.dataFim || 'atual'}`, margemEsq + 5, y);
      y += 7;
      
      if (exp.descricao) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...cinzaEscuro);
        doc.setFontSize(10.5);
        const descLinhas = doc.splitTextToSize(exp.descricao, larguraUtil - 12);
        descLinhas.forEach((linha: string) => {
          if (y > 265) { doc.addPage(); y = 25; }
          doc.text(`• ${linha}`, margemEsq + 7, y);
          y += 6;
        });
      }
      y += 5;
    });
  } else {
    secao('EXPERIÊNCIAS PROFISSIONAIS', [16, 185, 129]);
    addTexto(resultado.descricoesMelhoradas);
  }
  y += 3;

  // ── FORMAÇÃO ACADÊMICA ──
  if (educacoes.length > 0) {
    secao('FORMAÇÃO ACADÊMICA', [124, 58, 237]);
    
    educacoes.forEach(edu => {
      if (y > 265) { doc.addPage(); y = 25; }
      doc.setFillColor(240, 235, 255);
      doc.roundedRect(margemEsq, y - 3, larguraUtil, 9, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11.5);
      doc.setTextColor(124, 58, 237);
      doc.text(edu.curso, margemEsq + 5, y + 3.5);
      y += 10;
      
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...cinzaMedio);
      doc.text(`${edu.instituicao} | ${edu.dataInicio} - ${edu.dataFim}`, margemEsq + 5, y);
      y += 10;
    });
  }

  // ── IDIOMAS ──
  if (idiomas.length > 0) {
    secao('IDIOMAS', [124, 58, 237]);
    
    idiomas.forEach(idioma => {
      if (y > 265) { doc.addPage(); y = 25; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...cinzaEscuro);
      doc.text(idioma.nome, margemEsq + 3, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...cinzaMedio);
      const nivelTexto = idioma.nivel.charAt(0).toUpperCase() + idioma.nivel.slice(1);
      doc.text(`- ${nivelTexto}`, margemEsq + 45, y);
      y += 8;
    });
    y += 4;
  }

  // ── PROJETOS ──
  if (projetos.length > 0) {
    secao('PROJETOS', [249, 115, 22]);
    
    projetos.forEach(projeto => {
      if (y > 265) { doc.addPage(); y = 25; }
      doc.setFillColor(255, 240, 220);
      doc.roundedRect(margemEsq, y - 3, larguraUtil, 9, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11.5);
      doc.setTextColor(249, 115, 22);
      doc.text(projeto.nome, margemEsq + 5, y + 3.5);
      y += 10;
      
      if (projeto.descricao) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...cinzaEscuro);
        doc.setFontSize(10.5);
        const descLinhas = doc.splitTextToSize(projeto.descricao, larguraUtil - 12);
        descLinhas.forEach((linha: string) => {
          if (y > 265) { doc.addPage(); y = 25; }
          doc.text(`• ${linha}`, margemEsq + 7, y);
          y += 6;
        });
      }
      
      if (projeto.link) {
        y += 2;
        doc.setTextColor(37, 99, 235);
        doc.setFontSize(9);
        doc.textWithLink(projeto.link, margemEsq + 7, y, { url: projeto.link });
        y += 7;
      }
      y += 5;
    });
  }

  // ── HABILIDADES PRINCIPAIS ──
  if (resultado.habilidadesPrincipais?.length > 0) {
    secao('HABILIDADES PRINCIPAIS', [124, 58, 237]);
    
    let linhaAtual = '';
    resultado.habilidadesPrincipais.forEach((hab, idx) => {
      const texto = idx === 0 ? hab : ` • ${hab}`;
      const larguraTexto = doc.getTextWidth(linhaAtual + texto);
      if (larguraTexto > larguraUtil - 15) {
        if (y > 265) { doc.addPage(); y = 25; }
        doc.text(linhaAtual, margemEsq + 5, y);
        y += 7;
        linhaAtual = hab;
      } else {
        linhaAtual += texto;
      }
    });
    if (linhaAtual) {
      if (y > 265) { doc.addPage(); y = 25; }
      doc.text(linhaAtual, margemEsq + 5, y);
      y += 10;
    }
  }

  // ── PALAVRAS-CHAVE ATS ──
  secao('PALAVRAS-CHAVE ATS', [124, 58, 237]);
  
  let linhaAtualTags = '';
  let xAtual = margemEsq + 5;
  const yInicial = y;
  
  resultado.palavrasChaveATS.forEach((kw, idx) => {
    doc.setFillColor(237, 233, 254);
    doc.setTextColor(109, 40, 217);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const largKw = doc.getTextWidth(kw) + 10;
    
    if (xAtual + largKw > margemDir - 5) {
      y += 9;
      xAtual = margemEsq + 5;
    }
    
    if (y > 265) { doc.addPage(); y = 25; xAtual = margemEsq + 5; }
    
    doc.roundedRect(xAtual, y - 4, largKw, 8, 2, 2, 'F');
    doc.text(kw, xAtual + 5, y + 1);
    xAtual += largKw + 5;
  });
  
  y += 12;

  // ── Rodapé ──
  const totalPaginas = doc.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setDrawColor(200, 200, 210);
    doc.line(margemEsq, 287, margemDir - 5, 287);
    doc.setFontSize(9);
    doc.setTextColor(...cinzaMedio);
    doc.setFont('helvetica', 'normal');
    doc.text('Gerado por LifeProd — lifeprod.com', margemEsq, 292);
    doc.text(`Página ${i} de ${totalPaginas}`, margemDir - 5, 292, { align: 'right' });
  }

  doc.save(`curriculo-${formData.profissao.toLowerCase().replace(/\s+/g, '-') || 'profissional'}.pdf`);
}