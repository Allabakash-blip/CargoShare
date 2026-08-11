import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = (
  data,
  fileName = "Report",
  title = "CargoShare Report"
) => {
  const doc = new jsPDF();

  // ==========================
  // Title
  // ==========================

  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);

  doc.text(title, 14, 20);

  // ==========================
  // Export Date
  // ==========================

  doc.setFontSize(10);
  doc.setTextColor(100);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    28
  );

  // ==========================
  // Table
  // ==========================

  const columns = Object.keys(data[0]);

  const rows = data.map((item) =>
    Object.values(item)
  );

  autoTable(doc, {
    startY: 35,

    head: [columns],

    body: rows,

    theme: "grid",

    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },

    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });

  // ==========================
  // Footer
  // ==========================

  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setFontSize(9);

    doc.setTextColor(120);

    doc.text(
      `Page ${i} of ${pageCount}`,
      180,
      290,
      {
        align: "right",
      }
    );
  }

  doc.save(`${fileName}.pdf`);
};