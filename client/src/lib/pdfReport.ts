import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface ReportInscricao {
  id: number;
  nomeCompleto: string;
  setor: string;
  efetivo: "Sim" | "Não";
  seguimento: "Seletivo" | "Coopervale" | "Ágape";
  telefone: string;
  modalidades: string;
  createdAt: string | Date;
}

const MODALIDADES = [
  { id: "futsal-m", label: "Futsal Masculino", categoria: "Futsal" },
  { id: "futsal-f", label: "Futsal Feminino", categoria: "Futsal" },
  { id: "voleibol-m", label: "Voleibol Masculino", categoria: "Voleibol" },
  { id: "voleibol-f", label: "Voleibol Feminino", categoria: "Voleibol" },
  { id: "basquete-m", label: "Basquetebol Arremesso Masculino", categoria: "Basquetebol" },
  { id: "basquete-f", label: "Basquetebol Arremesso Feminino", categoria: "Basquetebol" },
  { id: "corrida-m", label: "Corrida de Rua Masculina", categoria: "Corrida" },
  { id: "corrida-f", label: "Corrida de Rua Feminina", categoria: "Corrida" },
];

function modalidadeInfo(id: string) {
  return MODALIDADES.find((m) => m.id === id);
}

interface Participation {
  modalidadeLabel: string;
  inscricao: ReportInscricao;
}

interface CategoriaGroup {
  categoria: string;
  participations: Participation[];
}

export function exportModalidadesReport(inscricoes: ReportInscricao[]): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const groups: Record<string, CategoriaGroup> = {};
  for (const insc of inscricoes) {
    let ids: string[] = [];
    try {
      const parsed = JSON.parse(insc.modalidades);
      if (Array.isArray(parsed)) ids = parsed.filter((id) => typeof id === "string");
    } catch {
      // modalidade inválida/legado: ignora
    }
    for (const id of ids) {
      const info = modalidadeInfo(id);
      if (!info) continue;
      if (!groups[info.categoria]) {
        groups[info.categoria] = { categoria: info.categoria, participations: [] };
      }
      groups[info.categoria].participations.push({ modalidadeLabel: info.label, inscricao: insc });
    }
  }

  const order = ["Futsal", "Voleibol", "Basquetebol", "Corrida"];
  const sorted = Object.values(groups).sort(
    (a, b) => order.indexOf(a.categoria) - order.indexOf(b.categoria)
  );

  const totalParticipations = sorted.reduce((acc, g) => acc + g.participations.length, 0);

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 34, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Jogos dos Servidores Público / Juína-MT 2026", 105, 14, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Relatório de Inscrições por Categoria de Modalidade", 105, 22, { align: "center" });
  doc.setFontSize(9);
  doc.text(
    `Gerado em ${new Date().toLocaleString("pt-BR")} — Total de inscritos: ${inscricoes.length} | Total de participações: ${totalParticipations}`,
    105,
    29,
    { align: "center" }
  );

  let y = 44;

  if (sorted.length === 0) {
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Nenhuma inscrição encontrada.", 105, y, { align: "center" });
  }

  sorted.forEach((group, idx) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Category header
    doc.setFillColor(29, 78, 216);
    doc.rect(14, y, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${group.categoria} — ${group.participations.length} participante(s)`, 18, y + 5.5);
    y += 12;

    const sortedParts = [...group.participations].sort(
      (a, b) =>
        a.modalidadeLabel.localeCompare(b.modalidadeLabel, "pt-BR") ||
        a.inscricao.nomeCompleto.localeCompare(b.inscricao.nomeCompleto, "pt-BR")
    );

    let finalY = y;
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [["Modalidade", "Nome", "Setor", "Efetivo", "Seguimento", "Telefone"]],
      body: sortedParts.map((p) => [
        p.modalidadeLabel,
        p.inscricao.nomeCompleto,
        p.inscricao.setor,
        p.inscricao.efetivo,
        p.inscricao.seguimento,
        p.inscricao.telefone,
      ]),
      didDrawPage: (data) => {
        finalY = data.table.finalY ?? finalY;
      },
      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: 1.5,
        textColor: [30, 30, 30],
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [51, 65, 85],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 52 },
        2: { cellWidth: 30 },
        3: { cellWidth: 15 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
      },
    });

    y = finalY + 8;
  });

  // Summary
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(15, 23, 42);
  doc.rect(14, y, 182, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo por Categoria", 18, y + 5.5);
  y += 12;

  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Categoria", "Participantes"]],
    body: sorted.map((g) => [g.categoria, String(g.participations.length)]),
    foot: [["Total", String(totalParticipations)]],
    styles: { fontSize: 9.5, cellPadding: 2 },
    headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: "bold" },
    footStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: "bold" },
    columnStyles: { 1: { cellWidth: 30, halign: "center" } },
  });

  doc.save(`relatorio-modalidades-${new Date().toISOString().split("T")[0]}.pdf`);
}
