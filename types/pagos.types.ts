export interface HistorialPagoType {
  id: number
  tipoPago: 'TESORERIA' | 'CAJA_MENOR'
  fecha: string,
  tipoRequisicion: 'REQUISICION' | 'PARTIDA NO PRESUPUESTADA'
  total: number
  areaSolicitante: string
  usuarioRegistrador: string
  soporteFactura: string
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'PAGADO' | 'PASADA_A_CAJA_MENOR' | 'PENDIENTE_ENTREGA' | 'ENTREGADA'
}