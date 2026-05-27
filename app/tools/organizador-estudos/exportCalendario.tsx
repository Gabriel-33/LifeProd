// app/tools/organizador-estudos/exportCalendario.ts
'use client';

import { jsPDF } from 'jspdf';
import { EstudoResultado, FormDataEstudos, Materia } from './estudosInterfaces';

export async function exportCalendarioEstudosPdf(
  resultado: EstudoResultado,
  formData: FormDataEstudos,
  materias: Materia[]
) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Margens
  const margemEsq = 15;
  const margemDir = 195;
  const larguraUtil = margemDir - margemEsq;
  let y = 25;

  // Cores
  const roxo: [number, number, number] = [124, 58, 237];
  const roxoClaro: [number, number, number] = [240, 235, 255];
  const verde: [number, number, number] = [16, 185, 129];
  const verdeClaro: [number, number, number] = [220, 250, 240];
  const cinzaEscuro: [number, number, number] = [31, 41, 55];
  const cinzaMedio: [number, number, number] = [75, 85, 99];
  const branco: [number, number, number] = [255, 255, 255];

  // ── Cabeçalho ──
  doc.setFillColor(...roxo);
  doc.rect(0, 0, 210, 45, 'F');

  doc.setTextColor(...branco);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PLANO DE ESTUDOS', margemEsq, 22);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  const diasAteProva = formData.diasAteProva;
  doc.text(`${diasAteProva} dias ate a prova  •  ${formData.horasPorDia} horas por dia`, margemEsq, 35);

  doc.setFontSize(9);
  doc.setTextColor(200, 180, 255);
  doc.text('Gerado com LifeProd IA', margemDir - 5, 40, { align: 'right' });

  y = 55;

  // ── Helper: título de seção ──
  const secao = (titulo: string, corFundo: [number, number, number]) => {
    if (y > 265) { doc.addPage(); y = 25; }
    doc.setFillColor(...corFundo);
    doc.roundedRect(margemEsq, y, larguraUtil, 10, 2, 2, 'F');
    doc.setTextColor(...branco);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, margemEsq + 5, y + 7);
    y += 16;
    doc.setTextColor(...cinzaEscuro);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
  };

  // ── Helper: texto com quebra ──
  const addTexto = (texto: string, corTexto: [number, number, number] = cinzaEscuro) => {
    if (!texto) return;
    doc.setTextColor(...corTexto);
    doc.setFontSize(11);
    const linhas = doc.splitTextToSize(texto, larguraUtil - 6);
    linhas.forEach((linha: string) => {
      if (y > 265) { doc.addPage(); y = 25; }
      doc.text(linha, margemEsq + 3, y);
      y += 7;
    });
    y += 3;
  };

  // ── MATÉRIAS (em grid de 2 colunas) ──
  secao('MATERIAS PARA ESTUDAR', [124, 58, 237]);
  
  const colunaLargura = (larguraUtil - 10) / 2;
  const coluna1X = margemEsq + 5;
  const coluna2X = margemEsq + 10 + colunaLargura;
  
  materias.forEach((materia, index) => {
    if (y > 265) { doc.addPage(); y = 25; }
    
    const colunaX = index % 2 === 0 ? coluna1X : coluna2X;
    const linhaY = y + Math.floor(index / 2) * 8;
    
    if (linhaY > 265) { doc.addPage(); y = 25; }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...cinzaEscuro);
    doc.text(materia.nome, colunaX, linhaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.setFontSize(10);
  });
  
  const linhasMaterias = Math.ceil(materias.length / 2);
  y += (linhasMaterias * 12) + 10;

  // ── INFORMAÇÕES GERAIS ──
  secao('CONFIGURACAO DO PLANO', [124, 58, 237]);
  doc.setFillColor(...roxoClaro);
  doc.roundedRect(margemEsq, y - 4, larguraUtil, 42, 2, 2, 'F');

  const infoY = y;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...cinzaEscuro);
  doc.text(`Horas por dia:`, margemEsq + 5, infoY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...cinzaMedio);
  doc.text(`${formData.horasPorDia} horas`, margemEsq + 55, infoY);

  doc.setFont('helvetica', 'bold');
  doc.text(`Dias disponiveis:`, margemEsq + 5, infoY + 9);
  doc.setFont('helvetica', 'normal');

  doc.setFont('helvetica', 'bold');
  doc.text(`Data da prova:`, margemEsq + 5, infoY + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.dataProva ? new Date(formData.dataProva).toLocaleDateString('pt-BR') : 'Nao informada', margemEsq + 55, infoY + 18);

  doc.setFont('helvetica', 'bold');
  doc.text(`Dias restantes:`, margemEsq + 5, infoY + 27);
  doc.setFont('helvetica', 'normal');
  doc.text(`${diasAteProva} dias`, margemEsq + 55, infoY + 27);

  y += 42;

  // ── META DIARIA ──
  secao('META DIARIA', [249, 115, 22]);
  doc.setFillColor(255, 240, 220);
  doc.roundedRect(margemEsq, y - 4, larguraUtil, 18, 2, 2, 'F');
  addTexto(resultado.metaDiaria, [cinzaEscuro[0], cinzaEscuro[1], cinzaEscuro[2]]);
  y += 6;

  // ── DICA DE ESTUDO ──
  secao('DICA DE ESTUDO', [249, 115, 22]);
  doc.setFillColor(255, 240, 220);
  doc.roundedRect(margemEsq, y - 4, larguraUtil, 18, 2, 2, 'F');
  addTexto(resultado.dicaEstudo, [cinzaEscuro[0], cinzaEscuro[1], cinzaEscuro[2]]);
  y += 6;

  // ── DISTRIBUICAO DE HORAS ──
  secao('DISTRIBUICAO SEMANAL', [16, 185, 129]);
  doc.setFillColor(...verdeClaro);
  doc.roundedRect(margemEsq, y - 4, larguraUtil, resultado.materiasPrioridade.length * 9 + 8, 2, 2, 'F');

  resultado.materiasPrioridade.forEach((m, idx) => {
    if (y > 265) { doc.addPage(); y = 25; }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(...cinzaEscuro);
    doc.text(m.nome, margemEsq + 5, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...verde);
    doc.text(`${m.horasSemanais} horas/semana`, margemDir - 35, y, { align: 'right' });
    y += 9;
  });
  y += 8;

  // ── CRONOGRAMA ──
  secao('CRONOGRAMA DE ESTUDOS', [16, 185, 129]);

  resultado.cronograma.forEach((item) => {
    if (y > 265) { doc.addPage(); y = 25; }
    
    doc.setFillColor(...verdeClaro);
    doc.roundedRect(margemEsq, y - 2, larguraUtil, 9, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...verde);
    doc.text(`Dia ${item.dia}`, margemEsq + 5, y + 5);
    doc.setTextColor(...cinzaEscuro);
    doc.text(item.materia, margemEsq + 35, y + 5);
    doc.text(`${item.tempoMinutos} minutos`, margemDir - 25, y + 5, { align: 'right' });
    y += 12;

    if (item.topicos && item.topicos.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...cinzaMedio);
      const topicosTexto = item.topicos.slice(0, 3).join(' • ');
      const linhas = doc.splitTextToSize(topicosTexto, larguraUtil - 10);
      linhas.forEach((linha: string) => {
        if (y > 265) { doc.addPage(); y = 25; }
        doc.text(linha, margemEsq + 7, y);
        y += 6;
      });
    }
    y += 5;
  });

  // ── REVISOES ──
  if (resultado.revisoes && resultado.revisoes.length > 0) {
    secao('DIAS DE REVISAO', [239, 68, 68]);
    doc.setFillColor(255, 230, 230);
    doc.roundedRect(margemEsq, y - 4, larguraUtil, resultado.revisoes.length * 8 + 8, 2, 2, 'F');

    resultado.revisoes.forEach((rev) => {
      if (y > 265) { doc.addPage(); y = 25; }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(...cinzaEscuro);
      doc.text(rev, margemEsq + 5, y);
      y += 8;
    });
    y += 8;
  }

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
    doc.text(`Pagina ${i} de ${totalPaginas}`, margemDir - 5, 292, { align: 'right' });
  }

  doc.save(`plano-estudos-${new Date().toISOString().split('T')[0]}.pdf`);
}