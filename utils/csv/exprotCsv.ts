import { calculatePercentage, formatCurrency, formatDate } from "@/lib";
import { Compra, Presupuesto } from "@/types";
import { generateCSV } from "./generateCsv";




export const reportePresupuestalToCSV = (presupuestos: Presupuesto[]) => {

  // Cabecera ordenada y clara
  const headers = [
    "Área",
    "Presupuesto Anual",
    "Total Gastado",
    "Saldo Disponible",
    "% Ejecutado",
    "Estado"
  ];

  // Estructura enriquecida de los datos
  const data = presupuestos.map((budget) => {
    const percentage = calculatePercentage(
      budget.totalGastado,
      budget.presupuestoAnual
    );
    // Cálculo de estado presupuestal
    let estado = "Normal";
    if (percentage > 90) {
      estado = "Crítico";
    } else if (percentage > 75) {
      estado = "Alerta";
    }

    return [
      budget.area?.nombre || "",
      formatCurrency(budget.presupuestoAnual),
      formatCurrency(budget.totalGastado),
      formatCurrency(budget.saldoDisponible),
      percentage + " %",
      estado
    ];
  });

  return generateCSV(headers, data, "reporte_presupuestal");

};

export const reporteComprasToCSV = (reporteComprasTotal: Compra[]) => {

  const headers = [
    "Fecha",
    "Proveedor",
    "Concepto y código",
    "Área",
    "Cantidad",
    "Valor Pagado",
    "Justificación"
  ];

  const data = reporteComprasTotal.map((compra) => [
    formatDate(compra.fechaCompra),
    compra.proveedor,
    `${compra.concepto.nombre} (${compra.concepto.codigo})`,
    compra.area,
    compra.cantidad,
    formatCurrency(compra.valorPagado),
    compra.justificacion
  ]);

  return generateCSV(headers, data, "reporte_compras");

};

