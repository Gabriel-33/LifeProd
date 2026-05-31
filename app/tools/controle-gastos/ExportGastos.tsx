// app/tools/controle-gastos/generatePdfGastos.ts
import { jsPDF } from 'jspdf';
import { Despesa } from './interfaceGastos';

interface Filtros {
  mes: string;
  categoria: string;
}

export async function generatePdfGastos(
  transacoes: Despesa[],
  filtros: Filtros,
  totais: {
    receitas: number;
    despesas: number;
    saldo: number;
  }
) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Margens
  const margemEsq = 15;
  const margemDir = 195;
  const larguraUtil = margemDir - margemEsq;
  let y = 25;

  // Cores
  const verde: [number, number, number] = [34, 197, 94];
  const vermelho: [number, number, number] = [239, 68, 68];
  const azul: [number, number, number] = [37, 99, 235];
  const cinzaEscuro: [number, number, number] = [31, 41, 55];
  const cinzaMedio: [number, number, number] = [75, 85, 99];
  const branco: [number, number, number] = [255, 255, 255];

  // ── Cabeçalho ──
  doc.setFillColor(...azul);
  doc.rect(0, 0, 210, 45, 'F');

  doc.setTextColor(...branco);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE GASTOS', margemEsq, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Período: ${filtros.mes.replace('-', '/')} | Categoria: ${filtros.categoria === 'todas' ? 'Todas' : filtros.categoria}`, margemEsq, 35);

  doc.setFontSize(8);
  doc.setTextColor(200, 210, 255);
  doc.text('Gerado por LifeProd IA', margemDir - 5, 40, { align: 'right' });

  y = 55;

  // ── Helper: título de seção ──
  const secao = (titulo: string, corFundo: [number, number, number]) => {
    if (y > 265) { doc.addPage(); y = 25; }
    doc.setFillColor(...corFundo);
    doc.roundedRect(margemEsq, y, larguraUtil, 9, 2, 2, 'F');
    doc.setTextColor(...branco);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, margemEsq + 5, y + 6);
    y += 15;
    doc.setTextColor(...cinzaEscuro);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
  };

  // ── Helper: formatação de moeda ──
  function formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // ── Cards de resumo ──
  secao('RESUMO DO PERÍODO', azul);

  // Card de Receitas
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(margemEsq, y - 4, (larguraUtil - 10) / 3, 25, 2, 2, 'F');
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Receitas', margemEsq + 8, y + 6);
  doc.setFontSize(16);
  doc.text(`R$ ${formatarMoeda(totais.receitas)}`, margemEsq + 8, y + 18);

  // Card de Despesas
  doc.setFillColor(254, 226, 226);
  doc.roundedRect(margemEsq + (larguraUtil - 10) / 3 + 5, y - 4, (larguraUtil - 10) / 3, 25, 2, 2, 'F');
  doc.setTextColor(239, 68, 68);
  doc.setFontSize(11);
  doc.text('Despesas', margemEsq + (larguraUtil - 10) / 3 + 13, y + 6);
  doc.setFontSize(16);
  doc.text(`R$ ${formatarMoeda(totais.despesas)}`, margemEsq + (larguraUtil - 10) / 3 + 13, y + 18);

  // Card de Saldo

    const saldoCor = totais.saldo >= 0 ? verde : vermelho;
    doc.setFillColor(totais.saldo >= 0 ? 220 : 254, totais.saldo >= 0 ? 252 : 226, totais.saldo >= 0 ? 231 : 226);
    doc.roundedRect(margemEsq + ((larguraUtil - 10) / 3 + 5) * 2, y - 4, (larguraUtil - 10) / 3, 25, 2, 2, 'F');
    doc.setTextColor(saldoCor[0], saldoCor[1], saldoCor[2]);
  doc.roundedRect(margemEsq + ((larguraUtil - 10) / 3 + 5) * 2, y - 4, (larguraUtil - 10) / 3, 25, 2, 2, 'F');
  doc.setTextColor(saldoCor[0], saldoCor[1], saldoCor[2]);
  doc.setFontSize(11);
  doc.text('Saldo', margemEsq + ((larguraUtil - 10) / 3 + 5) * 2 + 10, y + 6);
  doc.setFontSize(16);
  doc.text(`R$ ${formatarMoeda(totais.saldo)}`, margemEsq + ((larguraUtil - 10) / 3 + 5) * 2 + 10, y + 18);

  y += 32;

  // ── Lista de transações ──
  if (transacoes.length > 0) {
    secao('LISTA DE TRANSAÇÕES', azul);

    // Cabeçalho da tabela
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(margemEsq, y - 4, larguraUtil, 8, 2, 2, 'F');
    doc.setTextColor(...cinzaEscuro);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Descrição', margemEsq + 5, y + 1);
    doc.text('Categoria', margemEsq + 80, y + 1);
    doc.text('Data', margemEsq + 120, y + 1);
    doc.text('Valor', margemDir - 20, y + 1, { align: 'right' });
    y += 12;

    // Linhas da tabela
    transacoes.forEach((t, index) => {
      if (y > 265) { doc.addPage(); y = 25; }
      
      const corLinha: [number, number, number] = index % 2 === 0 ? [250, 250, 250] : [255, 255, 255];
      doc.setFillColor(...corLinha);
      doc.rect(margemEsq, y - 4, larguraUtil, 7, 'F');
      
      doc.setTextColor(...cinzaEscuro);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(t.descricao.length > 25 ? t.descricao.substring(0, 22) + '...' : t.descricao, margemEsq + 5, y);
      doc.text(t.categoria, margemEsq + 80, y);
      doc.text(new Date(t.data).toLocaleDateString('pt-BR'), margemEsq + 120, y);
      
      doc.setTextColor(t.tipo === 'receita' ? 34 : 239, t.tipo === 'receita' ? 197 : 68, t.tipo === 'receita' ? 94 : 68);
      doc.setFont('helvetica', 'bold');
      doc.text(`${t.tipo === 'receita' ? '+' : '-'} R$ ${formatarMoeda(t.valor)}`, margemDir - 20, y, { align: 'right' });
      
      y += 7;
    });
    y += 5;
  } else {
    secao('LISTA DE TRANSAÇÕES', azul);
    doc.setTextColor(...cinzaMedio);
    doc.setFontSize(10);
    doc.text('Nenhuma transação encontrada para o período selecionado.', margemEsq + 5, y);
    y += 15;
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
    doc.text(`Página ${i} de ${totalPaginas}`, margemDir - 5, 292, { align: 'right' });
  }

  // Salvar PDF
  const nomeArquivo = `relatorio-gastos-${filtros.mes}-${filtros.categoria === 'todas' ? 'todas-categorias' : filtros.categoria}.pdf`;
  doc.save(nomeArquivo);
}