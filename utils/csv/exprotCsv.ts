import { calculatePercentage, formatCurrency, formatDate } from "@/lib";
import { Compra, Presupuesto } from "@/types";
import { generateCSV } from "./generateCsv";
import { ReporteConsultorItemType, ReportePartidasNoPresupuestadasItemType, ReporteProveedoresType, ReporteTesoreriaItemType } from "@/types/reportes.types";




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

export const reporteProveedoresToCSV = (reporteProveedores: ReporteProveedoresType[]) => {
  const headers = [
    "Proveedor",
    "Cantidad Productos",
    "Valor Total",
    "Calificación Promedio",
  ];

  const data = reporteProveedores.map((prov) => [
    prov.proveedor,
    prov.cantidadProductos,
    formatCurrency(prov.valorTotal),
    prov.calificacionPromedio.toFixed(1)
    
  ]);

  return generateCSV(headers, data, "reporte_proveedores");
}

export const reporteTesoreriaToCSV = (reporteTesoreria: ReporteTesoreriaItemType[]) => {
  const headers = [
    "Requisición",
    "Área",
    "Proveedor",
    "Valor",
    "Calificación",
    "Comentario",
    "Fecha"
  ];

  const data = reporteTesoreria.map((req) => [
    req.requisicion,
    req.area,
    req.proveedor,
    formatCurrency(req.valor),
    req.calificacion,
    req.comentario,
    formatDate(req.fecha)
  ]);

  return generateCSV(headers, data, "reporte_tesoreria");
}

export const reportePartidasNoPresupuestadasToCSV = (reportePartidasNoPresupuestadas: ReportePartidasNoPresupuestadasItemType[]) => {
  const headers = [
    "Número Comite",
    "Justificación",
    "Área",
    "Proveedor",
    "Valor Unitario",
    "Valor Total",
    "Fecha",
    "Estado",
  ];

  const data = reportePartidasNoPresupuestadas.map((proyecto) => [
    proyecto.numeroComite,
    proyecto.justificacion,
    proyecto.area,
    proyecto.proveedor,
    formatCurrency(proyecto.valorUnitario),
    formatCurrency(proyecto.valorTotal),
    formatDate(proyecto.fecha),
    proyecto.estado,
  ]);

  return generateCSV(headers, data, "reporte_partidas_no_presupuestadas");
}

export const reporteConsultorToCSV = (reporteConsultor: ReporteConsultorItemType[]) => {
  const headers = [
    "Área",
    "Valor",
    "Calidad Producto",
    "Tiempo Entrega",
    "Calificación",
    "Comentario",
    "Fecha"
  ];

  const data = reporteConsultor.map((item) => [
    item.area,
    formatCurrency(item.valor),
    item.calidadProducto,
    item.tiempoEntrega,
    item.calificacion,
    item.comentario,
    formatDate(item.fecha)
  ]);

  return generateCSV(headers, data, "reporte_consultor");
}