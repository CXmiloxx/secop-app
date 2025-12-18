// Sistema de numeración automática para requisiciones, partidas y comités

interface NumeracionConfig {
  ultimoNumeroRequisicion: number
  ultimoNumeroPartida: number
  comites: {
    [fecha: string]: {
      numeroComite: string
      fecha: string
    }
  }
}

// Obtener configuración de numeración desde localStorage
function getConfigNumeracion(): NumeracionConfig {
  if (typeof window === "undefined") {
    return {
      ultimoNumeroRequisicion: 0,
      ultimoNumeroPartida: 0,
      comites: {},
    }
  }

  const stored = localStorage.getItem("configuracionNumeracion")
  if (!stored) {
    const config: NumeracionConfig = {
      ultimoNumeroRequisicion: 0,
      ultimoNumeroPartida: 0,
      comites: {},
    }
    localStorage.setItem("configuracionNumeracion", JSON.stringify(config))
    return config
  }

  return JSON.parse(stored)
}

// Guardar configuración de numeración
function saveConfigNumeracion(config: NumeracionConfig) {
  if (typeof window === "undefined") return
  localStorage.setItem("configuracionNumeracion", JSON.stringify(config))
}

// Generar número único para requisición
export function generarNumeroRequisicion(): string {
  const config = getConfigNumeracion()
  config.ultimoNumeroRequisicion += 1
  const numeroFormateado = `REQ-${String(config.ultimoNumeroRequisicion).padStart(6, "0")}`
  saveConfigNumeracion(config)
  return numeroFormateado
}

// Generar número único para partida no presupuestada
export function generarNumeroPartida(): string {
  const config = getConfigNumeracion()
  config.ultimoNumeroPartida += 1
  const numeroFormateado = `PNP-${String(config.ultimoNumeroPartida).padStart(6, "0")}`
  saveConfigNumeracion(config)
  return numeroFormateado
}

// Obtener o generar número de comité para la fecha actual
export function obtenerNumeroComite(fechaAprobacion?: string): string {
  const config = getConfigNumeracion()

  // Usar la fecha de aprobación o la fecha actual
  const fecha = fechaAprobacion ? new Date(fechaAprobacion) : new Date()
  const fechaKey = fecha.toISOString().split("T")[0] // YYYY-MM-DD

  // Si ya existe un comité para esta fecha, devolverlo
  if (config.comites[fechaKey]) {
    return config.comites[fechaKey].numeroComite
  }

  // Si no existe, generar uno nuevo
  const año = fecha.getFullYear()
  const numeroComitesEnElAño = Object.keys(config.comites).filter((key) => key.startsWith(String(año))).length + 1

  const numeroComite = `COM-${año}-${String(numeroComitesEnElAño).padStart(3, "0")}`

  config.comites[fechaKey] = {
    numeroComite,
    fecha: fechaKey,
  }

  saveConfigNumeracion(config)
  return numeroComite
}

// Inicializar números para requisiciones y partidas existentes
export function inicializarNumeracionExistente() {
  if (typeof window === "undefined") return

  const config = getConfigNumeracion()

  // Solo inicializar si no se ha hecho antes
  if (config.ultimoNumeroRequisicion > 0 || config.ultimoNumeroPartida > 0) {
    return
  }

  console.log("[v0] Inicializando numeración para datos existentes...")

  // Inicializar requisiciones
  const requisiciones = JSON.parse(localStorage.getItem("requisiciones") || "[]")
  requisiciones.forEach((req: any, index: number) => {
    if (!req.numeroRequisicion) {
      req.numeroRequisicion = `REQ-${String(index + 1).padStart(6, "0")}`

      // Si está aprobada, asignar número de comité
      if (req.estado === "Aprobada" && req.fechaAprobacion && !req.numeroComite) {
        req.numeroComite = obtenerNumeroComite(req.fechaAprobacion)
      }
    }
  })
  localStorage.setItem("requisiciones", JSON.stringify(requisiciones))
  config.ultimoNumeroRequisicion = requisiciones.length

  // Inicializar partidas no presupuestadas
  const partidas = JSON.parse(localStorage.getItem("partidasNoPresupuestadas") || "[]")
  partidas.forEach((partida: any, index: number) => {
    if (!partida.numeroPartida) {
      partida.numeroPartida = `PNP-${String(index + 1).padStart(6, "0")}`

      // Si está aprobada, asignar número de comité
      if (partida.estado === "Aprobada" && partida.fechaAprobacion && !partida.numeroComite) {
        partida.numeroComite = obtenerNumeroComite(partida.fechaAprobacion)
      }
    }
  })
  localStorage.setItem("partidasNoPresupuestadas", JSON.stringify(partidas))
  config.ultimoNumeroPartida = partidas.length

  saveConfigNumeracion(config)
  console.log("[v0] Numeración inicializada correctamente")
}

// Función para regenerar todos los números de comité basados en fechas de aprobación
export function regenerarNumerosComite() {
  if (typeof window === "undefined") return

  const config = getConfigNumeracion()
  config.comites = {} // Limpiar comités existentes

  // Procesar requisiciones aprobadas
  const requisiciones = JSON.parse(localStorage.getItem("requisiciones") || "[]")
  requisiciones.forEach((req: any) => {
    if (req.estado === "Aprobada" && req.fechaAprobacion) {
      req.numeroComite = obtenerNumeroComite(req.fechaAprobacion)
    }
  })
  localStorage.setItem("requisiciones", JSON.stringify(requisiciones))

  // Procesar partidas aprobadas
  const partidas = JSON.parse(localStorage.getItem("partidasNoPresupuestadas") || "[]")
  partidas.forEach((partida: any) => {
    if (partida.estado === "Aprobada" && partida.fechaAprobacion) {
      partida.numeroComite = obtenerNumeroComite(partida.fechaAprobacion)
    }
  })
  localStorage.setItem("partidasNoPresupuestadas", JSON.stringify(partidas))

  saveConfigNumeracion(config)
}
