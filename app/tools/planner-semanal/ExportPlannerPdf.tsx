import { jsPDF } from 'jspdf';

import { PlanejamentoSemanal} from './InterfacePlanner';

export async function generatePdfPlanner(
  planejamento: PlanejamentoSemanal | null
) {
    console.log(planejamento)
    if(planejamento !=null)
    {
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
        doc.rect(0, 0, 210, 40, 'F');
        

        doc.setTextColor(...branco);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        
        var textoMetas = '';
        var count = 0;

        planejamento.metasSemanais.forEach(metas => {
            if(count % 2 != 0)
                textoMetas += '   •'+metas.toUpperCase()+'\n';
            else
                textoMetas += '•  '+metas.toUpperCase();

            count++;
        });
        
        doc.text(textoMetas || 'PLANEJAMENTO SEMANAL', margemEsq, 10);


        doc.setFontSize(9);

        //doc.text('Gerado com LifeProd IA', margemDir - 5, 40, { align: 'right' });

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

        // ── CALENDÁRIO DE DIAS ──
    if (planejamento.dias.length > 0) {
        
        planejamento.dias.forEach(dias => {
            secao('Planejamento Diário', [37, 99, 235]);
            doc.setFillColor(239, 246, 255);
            doc.roundedRect(margemEsq, y - 2, larguraUtil, planejamento.dias.length * 5.5 + 8, 2, 2, 'F');

        if (y > 265) { doc.addPage(); y = 25; }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(...cinzaEscuro);
            doc.text(`•${dias.nome} `+`${dias.data}:`, margemEsq + 2, y + 3);
            y += 7.5;

            //dias datas
            dias.tarefas.forEach(tarefas => {
                if (y > 265) { doc.addPage(); y = 25; }
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(11);
                    doc.setTextColor(...cinzaEscuro);
                    doc.text(`${tarefas.horario}: `+ `${tarefas.titulo}`, margemEsq + 5, y + 3);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(37, 99, 235);
                    y += 7.5;
            });
            y += 5;
        });
        y += 5;

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

        doc.save(`planner-semanal-${crypto.randomUUID() || 'planejameno semanal'}.pdf`);
    }
  }
}

