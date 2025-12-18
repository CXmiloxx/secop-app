// Sistema de monitoreo y control del presupuesto de caja menor

export interface PresupuestoCajaMenor {
  id: string
  montoAsignado: number
  montoGastado: number
  porcentajeEjecucion: number
  fechaAsignacion: string
  estado: "activo" | "agotado" | "solicitud_pendiente"
  solicitudAutomaticaId?: string
  totalGastado?: number // Adding totalGastado field
}

export interface SolicitudCajaMenor {
  id: string
  montoSolicitado: number
  montoGastadoAnterior: number
  porcentajeEjecucionAnterior: number
  justificacion: string
  fechaSolicitud: string
  estado: "pendiente" | "aprobada" | "rechazada"
  aprobadoPor?: string
  fechaAprobacion?: string
  montoAprobado?: number
  tipo: "automatica" | "manual"
}

const CLAVE_PRESUPUESTO = "presupuestoCajaMenor"
const CLAVE_SOLICITUDES = "solicitudesCajaMenor"
const CLAVE_HISTORIAL = "historialCajaMenor"
const UMBRAL_ALERTA = 75 // Porcentaje de ejecución para generar solicitud automática

// Inicializar datos de caja menor
export function initializeCajaMenorData() {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem(CLAVE_PRESUPUESTO)
  if (!existing) {
    const presupuestoInicial: PresupuestoCajaMenor = {
      id: "1",
      montoAsignado: 5000000, // $5.000.000 inicial
      montoGastado: 3500000, // $3.500.000 gastados (70%)
      porcentajeEjecucion: 70,
      fechaAsignacion: new Date().toISOString(),
      estado: "activo",
    }
    localStorage.setItem(CLAVE_PRESUPUESTO, JSON.stringify(presupuestoInicial))
  }

  const existingSolicitudes = localStorage.getItem(CLAVE_SOLICITUDES)
  if (!existingSolicitudes) {
    localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify([]))
  }

  const existingHistorial = localStorage.getItem(CLAVE_HISTORIAL)
  if (!existingHistorial) {
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify([]))
  }
}

// Obtener presupuesto actual de caja menor
export function getPresupuestoCajaMenor(): PresupuestoCajaMenor | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(CLAVE_PRESUPUESTO)
  return data ? JSON.parse(data) : null
}

// Adding alias export
export function obtenerPresupuestoCajaMenor(): PresupuestoCajaMenor | null {
  return getPresupuestoCajaMenor()
}

// Obtener solicitudes de caja menor
export function getSolicitudesCajaMenor(): SolicitudCajaMenor[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(CLAVE_SOLICITUDES)
  return data ? JSON.parse(data) : []
}

// Registrar un gasto en caja menor
export function registrarGastoCajaMenor(monto: number, requisicionId: string) {
  const presupuesto = getPresupuestoCajaMenor()
  if (!presupuesto) return

  const nuevoGastado = presupuesto.montoGastado + monto
  const nuevoPorcentaje = (nuevoGastado / presupuesto.montoAsignado) * 100

  const presupuestoActualizado: PresupuestoCajaMenor = {
    ...presupuesto,
    montoGastado: nuevoGastado,
    porcentajeEjecucion: nuevoPorcentaje,
  }

  // Verificar si se alcanzó el umbral del 75%
  if (
    nuevoPorcentaje >= UMBRAL_ALERTA &&
    presupuesto.porcentajeEjecucion < UMBRAL_ALERTA &&
    presupuesto.estado === "activo"
  ) {
    // Generar solicitud automática
    generarSolicitudAutomatica(presupuestoActualizado)
    presupuestoActualizado.estado = "solicitud_pendiente"
  }

  // Verificar si se agotó el presupuesto
  if (nuevoPorcentaje >= 100) {
    presupuestoActualizado.estado = "agotado"
  }

  localStorage.setItem(CLAVE_PRESUPUESTO, JSON.stringify(presupuestoActualizado))

  // Registrar en historial
  registrarHistorialCajaMenor({
    tipo: "gasto",
    monto,
    requisicionId,
    porcentajeEjecucion: nuevoPorcentaje,
    fecha: new Date().toISOString(),
  })
}

// Descontar de caja menor con usuario y requisición ID
export function descontarDeCajaMenor(monto: number, usuario: string, requisicionId: string) {
  registrarGastoCajaMenor(monto, requisicionId)

  // Actualizar el presupuesto con el nuevo gasto
  const presupuesto = getPresupuestoCajaMenor()
  if (!presupuesto) return

  const nuevoGastado = presupuesto.montoGastado
  const totalGastado = nuevoGastado

  // Guardar en estructura compatible con componente de Tesorería
  localStorage.setItem(
    CLAVE_PRESUPUESTO,
    JSON.stringify({
      ...presupuesto,
      totalGastado: totalGastado,
    }),
  )
}

// Generar solicitud automática al alcanzar 75%
function generarSolicitudAutomatica(presupuesto: PresupuestoCajaMenor) {
  const solicitudes = getSolicitudesCajaMenor()

  // Verificar si ya existe una solicitud automática pendiente
  const tieneAutomaticaPendiente = solicitudes.some((s) => s.tipo === "automatica" && s.estado === "pendiente")
  if (tieneAutomaticaPendiente) return

  const nuevaSolicitud: SolicitudCajaMenor = {
    id: Date.now().toString(),
    montoSolicitado: presupuesto.montoAsignado, // Solicitar el mismo monto asignado anteriormente
    montoGastadoAnterior: presupuesto.montoGastado,
    porcentajeEjecucionAnterior: presupuesto.porcentajeEjecucion,
    justificacion: `Solicitud automática generada al alcanzar el ${UMBRAL_ALERTA}% de ejecución del presupuesto de caja menor. Monto gastado: $${presupuesto.montoGastado.toLocaleString("es-CO")} de $${presupuesto.montoAsignado.toLocaleString("es-CO")}.`,
    fechaSolicitud: new Date().toISOString(),
    estado: "pendiente",
    tipo: "automatica",
  }

  solicitudes.push(nuevaSolicitud)
  localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(solicitudes))

  // Actualizar presupuesto con referencia a la solicitud
  presupuesto.solicitudAutomaticaId = nuevaSolicitud.id
  localStorage.setItem(CLAVE_PRESUPUESTO, JSON.stringify(presupuesto))

  // Registrar en historial
  registrarHistorialCajaMenor({
    tipo: "solicitud_automatica",
    solicitudId: nuevaSolicitud.id,
    monto: presupuesto.montoAsignado,
    fecha: nuevaSolicitud.fechaSolicitud,
  })
}

// Verificar alerta del 75%
export function verificarAlerta75() {
  const presupuesto = getPresupuestoCajaMenor()
  if (!presupuesto) return

  const porcentaje = presupuesto.porcentajeEjecucion

  // Si alcanzó el 75% y no hay solicitud pendiente, generar una
  if (porcentaje >= UMBRAL_ALERTA && presupuesto.estado === "activo") {
    generarSolicitudAutomatica(presupuesto)
  }
}

// Aprobar solicitud de caja menor (por Tesorería)
export function aprobarSolicitudCajaMenor(solicitudId: string, montoAprobado: number, aprobadoPor: string) {
  const solicitudes = getSolicitudesCajaMenor()
  const index = solicitudes.findIndex((s) => s.id === solicitudId)

  if (index === -1) return

  solicitudes[index] = {
    ...solicitudes[index],
    estado: "aprobada",
    montoAprobado,
    aprobadoPor,
    fechaAprobacion: new Date().toISOString(),
  }

  localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(solicitudes))

  // Asignar nuevo presupuesto
  asignarNuevoPresupuestoCajaMenor(montoAprobado)

  // Registrar en historial
  registrarHistorialCajaMenor({
    tipo: "aprobacion",
    solicitudId,
    monto: montoAprobado,
    aprobadoPor,
    fecha: new Date().toISOString(),
  })
}

// Rechazar solicitud de caja menor
export function rechazarSolicitudCajaMenor(solicitudId: string, aprobadoPor: string) {
  const solicitudes = getSolicitudesCajaMenor()
  const index = solicitudes.findIndex((s) => s.id === solicitudId)

  if (index === -1) return

  solicitudes[index] = {
    ...solicitudes[index],
    estado: "rechazada",
    aprobadoPor,
    fechaAprobacion: new Date().toISOString(),
  }

  localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(solicitudes))

  // Si el presupuesto estaba en solicitud pendiente, volver a activo
  const presupuesto = getPresupuestoCajaMenor()
  if (presupuesto && presupuesto.solicitudAutomaticaId === solicitudId) {
    presupuesto.estado = "activo"
    presupuesto.solicitudAutomaticaId = undefined
    localStorage.setItem(CLAVE_PRESUPUESTO, JSON.stringify(presupuesto))
  }

  // Registrar en historial
  registrarHistorialCajaMenor({
    tipo: "rechazo",
    solicitudId,
    aprobadoPor,
    fecha: new Date().toISOString(),
  })
}

// Asignar nuevo presupuesto de caja menor (internal - used by approval flow)
function asignarNuevoPresupuestoCajaMenor(monto: number) {
  const nuevoPresupuesto: PresupuestoCajaMenor = {
    id: Date.now().toString(),
    montoAsignado: monto,
    montoGastado: 0,
    porcentajeEjecucion: 0,
    fechaAsignacion: new Date().toISOString(),
    estado: "activo",
  }

  localStorage.setItem(CLAVE_PRESUPUESTO, JSON.stringify(nuevoPresupuesto))

  // Registrar en historial
  registrarHistorialCajaMenor({
    tipo: "asignacion",
    monto,
    fecha: new Date().toISOString(),
  })
}

// Solicitar presupuesto manualmente
export function solicitarPresupuestoCajaMenor(montoSolicitado: number, justificacion: string) {
  const presupuesto = getPresupuestoCajaMenor()
  const solicitudes = getSolicitudesCajaMenor()

  const nuevaSolicitud: SolicitudCajaMenor = {
    id: Date.now().toString(),
    montoSolicitado,
    montoGastadoAnterior: presupuesto?.montoGastado || 0,
    porcentajeEjecucionAnterior: presupuesto?.porcentajeEjecucion || 0,
    justificacion,
    fechaSolicitud: new Date().toISOString(),
    estado: "pendiente",
    tipo: "manual",
  }

  solicitudes.push(nuevaSolicitud)
  localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(solicitudes))

  // Registrar en historial
  registrarHistorialCajaMenor({
    tipo: "solicitud_manual",
    solicitudId: nuevaSolicitud.id,
    monto: montoSolicitado,
    fecha: nuevaSolicitud.fechaSolicitud,
  })

  return nuevaSolicitud.id
}

export function asignarPresupuestoCajaMenor(monto: number, observaciones?: string) {
  const presupuestoActual = getPresupuestoCajaMenor()

  const nuevoPresupuesto: PresupuestoCajaMenor = {
    id: Date.now().toString(),
    montoAsignado: presupuestoActual ? presupuestoActual.montoAsignado + monto : monto,
    montoGastado: presupuestoActual?.montoGastado || 0,
    porcentajeEjecucion: presupuestoActual
      ? (presupuestoActual.montoGastado / (presupuestoActual.montoAsignado + monto)) * 100
      : 0,
    fechaAsignacion: new Date().toISOString(),
    estado: "activo",
  }

  localStorage.setItem(CLAVE_PRESUPUESTO, JSON.stringify(nuevoPresupuesto))

  // Registrar en historial
  registrarHistorialCajaMenor({
    tipo: "asignacion",
    monto,
    observaciones,
    fecha: new Date().toISOString(),
  })
}

// Obtener historial de caja menor
export function getHistorialCajaMenor(): any[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(CLAVE_HISTORIAL)
  return data ? JSON.parse(data) : []
}

// Registrar evento en historial
function registrarHistorialCajaMenor(evento: any) {
  const historial = getHistorialCajaMenor()
  historial.unshift(evento)
  localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial))
}

// Obtener saldo disponible
export function getSaldoDisponibleCajaMenor(): number {
  const presupuesto = getPresupuestoCajaMenor()
  if (!presupuesto) return 0
  return presupuesto.montoAsignado - presupuesto.montoGastado
}

// Verificar si se puede realizar un gasto
export function puedeRealizarGasto(monto: number): boolean {
  const saldo = getSaldoDisponibleCajaMenor()
  return monto <= saldo
}
