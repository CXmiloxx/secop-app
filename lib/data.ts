// Áreas del colegio
export const areas = [
  "Ciencias Naturales",
  "Matemáticas",
  "Idiomas",
  "Ciencias Sociales",
  "Educación Física",
  "Artes",
  "Tecnología",
  "Preescolar",
  "Primaria",
  "Secundaria",
  "Contabilidad",
  "Mantenimiento",
  "Recursos Humanos",
  "Administración General",
  "Biblioteca",
  "Cafetería",
]

// Catálogo de cuentas contables simplificado
export const cuentasContables = [
  {
    codigo: "5010",
    nombre: "Material Didáctico",
    conceptos: [
      "Cartulinas",
      "Marcadores",
      "Pinturas",
      "Material de laboratorio",
      "Libros de texto",
      "Mapas y láminas",
    ],
  },
  {
    codigo: "5020",
    nombre: "Papelería y Útiles de Oficina",
    conceptos: ["Resmas de papel", "Bolígrafos", "Carpetas", "Grapas y clips", "Cuadernos", "Archivadores"],
  },
  {
    codigo: "5030",
    nombre: "Servicios Generales",
    conceptos: ["Mantenimiento", "Limpieza", "Vigilancia", "Jardinería", "Reparaciones", "Fumigación"],
  },
  {
    codigo: "5040",
    nombre: "Tecnología e Informática",
    conceptos: [
      "Tóner y cartuchos",
      "Cables y conectores",
      "Licencias de software",
      "Equipos de cómputo",
      "Accesorios informáticos",
      "Mantenimiento de equipos",
    ],
  },
  {
    codigo: "5050",
    nombre: "Material Deportivo",
    conceptos: ["Balones", "Conos", "Redes", "Colchonetas", "Uniformes deportivos", "Implementos deportivos"],
  },
  {
    codigo: "5060",
    nombre: "Mobiliario y Equipo",
    conceptos: ["Escritorios", "Sillas", "Estanterías", "Pizarras", "Mesas", "Archivadores"],
  },
  {
    codigo: "5070",
    nombre: "Servicios Públicos",
    conceptos: ["Energía eléctrica", "Agua", "Internet", "Teléfono", "Gas"],
  },
]

export function getCuentasContables() {
  if (typeof window === "undefined") return cuentasContables

  const storedCuentas = localStorage.getItem("cuentasContables")
  return storedCuentas ? JSON.parse(storedCuentas) : cuentasContables
}

// Inicializar datos de presupuesto
export function initializeBudgetData() {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem("presupuestos")
  if (!existing) {
    const currentYear = new Date().getFullYear()
    const initialBudgets = areas.map((area, index) => ({
      area,
      presupuestoAnual: 25000000 + index * 2000000,
      totalGastado: Math.floor(Math.random() * 10000000),
      montoComprometido: Math.floor(Math.random() * 5000000),
      año: currentYear,
    }))
    localStorage.setItem("presupuestos", JSON.stringify(initialBudgets))
  }
}

// Inicializar datos de compras
export function initializePurchasesData() {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem("compras")
  if (!existing) {
    const mockCompras = [
      // Ciencias Naturales - 5010 Material Didáctico
      {
        id: "1",
        fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        area: "Ciencias Naturales",
        proveedor: "Papelería Central",
        cuenta: "5010 - Material Didáctico",
        cuentaContable: "5010",
        conceptoDetallado: "Cartulinas de colores",
        cantidad: 50,
        valorTotal: 60000,
        monto: 60000,
        descripcion: "Compra aprobada requisición",
        registradoPor: "consultor1",
      },
      {
        id: "2",
        fecha: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        area: "Ciencias Naturales",
        proveedor: "Suministros Educativos",
        cuenta: "5010 - Material Didáctico",
        cuentaContable: "5010",
        conceptoDetallado: "Material de laboratorio",
        cantidad: 10,
        valorTotal: 800000,
        monto: 800000,
        descripcion: "Reactivos y material para prácticas",
        registradoPor: "consultor1",
      },
      {
        id: "3",
        fecha: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        area: "Ciencias Naturales",
        proveedor: "Papelería Central",
        cuenta: "5010 - Material Didáctico",
        cuentaContable: "5010",
        conceptoDetallado: "Marcadores permanentes",
        cantidad: 30,
        valorTotal: 75000,
        monto: 75000,
        descripcion: "Marcadores para pizarra",
        registradoPor: "consultor1",
      },
      // Administración General - 5020 Papelería y Útiles
      {
        id: "4",
        fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        area: "Administración General",
        proveedor: "Papelería Central",
        cuenta: "5020 - Papelería y Útiles de Oficina",
        cuentaContable: "5020",
        conceptoDetallado: "Resmas de papel carta",
        cantidad: 80,
        valorTotal: 960000,
        monto: 960000,
        descripcion: "Papel para el semestre",
        registradoPor: "consultor2",
      },
      {
        id: "5",
        fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        area: "Administración General",
        proveedor: "Distribuidora Oficinas",
        cuenta: "5020 - Papelería y Útiles de Oficina",
        cuentaContable: "5020",
        conceptoDetallado: "Bolígrafos azules y negros",
        cantidad: 400,
        valorTotal: 320000,
        monto: 320000,
        descripcion: "Bolígrafos para todo el colegio",
        registradoPor: "consultor2",
      },
      {
        id: "6",
        fecha: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        area: "Administración General",
        proveedor: "Papelería Central",
        cuenta: "5020 - Papelería y Útiles de Oficina",
        cuentaContable: "5020",
        conceptoDetallado: "Carpetas colgantes",
        cantidad: 150,
        valorTotal: 225000,
        monto: 225000,
        descripcion: "Carpetas para archivo",
        registradoPor: "consultor2",
      },
      // Tecnología - 5040 Tecnología e Informática
      {
        id: "7",
        fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        area: "Tecnología",
        proveedor: "Tecnología Educativa SAS",
        cuenta: "5040 - Tecnología e Informática",
        cuentaContable: "5040",
        conceptoDetallado: "Cartuchos de tóner HP",
        cantidad: 8,
        valorTotal: 240000,
        monto: 240000,
        descripcion: "Tóner para impresoras del laboratorio",
        registradoPor: "consultor1",
      },
      {
        id: "8",
        fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        area: "Tecnología",
        proveedor: "CompuTodo",
        cuenta: "5040 - Tecnología e Informática",
        cuentaContable: "5040",
        conceptoDetallado: "Cables HDMI y USB",
        cantidad: 15,
        valorTotal: 150000,
        monto: 150000,
        descripcion: "Cables para conectividad",
        registradoPor: "consultor2",
      },
      // Educación Física - 5050 Material Deportivo
      {
        id: "9",
        fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        area: "Educación Física",
        proveedor: "Distribuidora de Deportes Colombia",
        cuenta: "5050 - Material Deportivo",
        cuentaContable: "5050",
        conceptoDetallado: "Balones de fútbol profesionales",
        cantidad: 20,
        valorTotal: 1000000,
        monto: 1000000,
        descripcion: "Balones para torneos",
        registradoPor: "consultor3",
      },
      {
        id: "10",
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        area: "Educación Física",
        proveedor: "Distribuidora de Deportes Colombia",
        cuenta: "5050 - Material Deportivo",
        cuentaContable: "5050",
        conceptoDetallado: "Redes para arcos",
        cantidad: 6,
        valorTotal: 210000,
        monto: 210000,
        descripcion: "Redes de repuesto",
        registradoPor: "consultor3",
      },
    ]
    localStorage.setItem("compras", JSON.stringify(mockCompras))
  }
}

// Inicializar datos de inventario
export function initializeInventoryData() {
  if (typeof window === "undefined") return

  const existingProducts = localStorage.getItem("productos")
  if (!existingProducts) {
    const mockProductos = [
      {
        id: "1",
        nombre: "Cartulina Blanca",
        cantidad: 150,
        unidad: "pliegos",
        categoria: "Material Didáctico",
        costo: 1000,
        ubicacion: "Estante A1",
        estado: "activo",
      },
      {
        id: "2",
        nombre: "Cartuchos de Tóner HP",
        cantidad: 8,
        unidad: "unidades",
        categoria: "Tecnología",
        costo: 150000,
        ubicacion: "Armario T1",
        estado: "activo",
      },
      {
        id: "3",
        nombre: "Bolígrafos Azules",
        cantidad: 250,
        unidad: "cajas",
        categoria: "Papelería",
        costo: 300,
        ubicacion: "Estante B2",
        estado: "activo",
      },
      {
        id: "4",
        nombre: "Papel Bond",
        cantidad: 100,
        unidad: "resmas",
        categoria: "Papelería",
        costo: 5000,
        ubicacion: "Estante C1",
        estado: "activo",
      },
      {
        id: "5",
        nombre: "Balones de Fútbol",
        cantidad: 12,
        unidad: "unidades",
        categoria: "Material Deportivo",
        costo: 200000,
        ubicacion: "Bodega Deportes",
        estado: "activo",
      },
    ]
    localStorage.setItem("productos", JSON.stringify(mockProductos))
  }

  const existingMovements = localStorage.getItem("movimientos")
  if (!existingMovements) {
    const mockMovimientos = [
      {
        id: "1",
        tipo: "Entrada",
        producto: "Cartulina Blanca",
        cantidad: 100,
        fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        responsable: "consultor1",
        observaciones: "Recepción de compra requisición #1",
      },
      {
        id: "2",
        tipo: "Salida",
        producto: "Bolígrafos Azules",
        cantidad: 50,
        fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        responsable: "consultor2",
        observaciones: "Distribución para oficinas",
      },
      {
        id: "3",
        tipo: "Entrada",
        producto: "Cartuchos de Tóner HP",
        cantidad: 8,
        fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        responsable: "consultor1",
        observaciones: "Recepción de compra requisición #2",
      },
    ]
    localStorage.setItem("movimientos", JSON.stringify(mockMovimientos))
  }
}

// Inicializar datos de requisiciones
export function initializeRequisicionesData() {
  if (typeof window === "undefined") return

  const mockRequisiciones = [
    {
      id: "1",
      area: "Ciencias Naturales",
      proveedor: "Papelería Central",
      cuenta: "5010",
      nombreCuenta: "Material Didáctico",
      concepto: "Cartulinas de colores",
      cantidad: 50,
      valor: 50000,
      iva: 9500,
      valorTotal: 59500,
      justificacion: "Material para clases de biología",
      fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      solicitante: "consultor1",
      estado: "Entregada",
      aprobador: "consultor",
      fechaAprobacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      tipoPago: "Pago",
      pagadoPor: "pagos",
      fechaPago: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      calificacionProveedor: 4.5,
      comentarioProveedor: "Buen producto",
    },
    {
      id: "2",
      area: "Tecnología",
      proveedor: "Tecnología Educativa SAS",
      cuenta: "5040",
      nombreCuenta: "Tecnología e Informática",
      concepto: "Cartuchos de tóner HP",
      cantidad: 10,
      valor: 150000,
      iva: 28500,
      valorTotal: 178500,
      justificacion: "Suministro para impresoras del laboratorio",
      fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      solicitante: "consultor2",
      estado: "Aprobada",
      aprobador: "consultor",
      fechaAprobacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tipoPago: null,
      pagadoPor: null,
      fechaPago: null,
    },
    {
      id: "3",
      area: "Biblioteca",
      proveedor: "Papelería Central",
      cuenta: "5020",
      nombreCuenta: "Papelería y Útiles de Oficina",
      concepto: "Resmas de papel bond",
      cantidad: 20,
      valor: 100000,
      iva: 19000,
      valorTotal: 119000,
      justificacion: "Papel para impresiones de consulta",
      fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      solicitante: "consultor3",
      estado: "Pendiente",
      aprobador: null,
      fechaAprobacion: null,
      tipoPago: null,
      pagadoPor: null,
      fechaPago: null,
    },
    {
      id: "4",
      area: "Educación Física",
      proveedor: "Tecnología Educativa SAS",
      cuenta: "5050",
      nombreCuenta: "Material Deportivo",
      concepto: "Balones de fútbol",
      cantidad: 5,
      valor: 200000,
      iva: 38000,
      valorTotal: 238000,
      justificacion: "Reemplazo de balones deteriorados",
      fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      solicitante: "consultor1",
      estado: "Rechazada",
      aprobador: "consultor",
      fechaAprobacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      tipoPago: null,
      pagadoPor: null,
      fechaPago: null,
    },
    {
      id: "5",
      area: "Administración General",
      proveedor: "Papelería Central",
      cuenta: "5020",
      nombreCuenta: "Papelería y Útiles de Oficina",
      concepto: "Bolígrafos azules",
      cantidad: 100,
      valor: 30000,
      iva: 5700,
      valorTotal: 35700,
      justificacion: "Reposición de útiles de escritorio",
      fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      solicitante: "consultor2",
      estado: "Entregada",
      aprobador: "consultor",
      fechaAprobacion: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      tipoPago: "Caja Menor",
      pagadoPor: "consultor2",
      fechaPago: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      calificacionProveedor: 5,
      comentarioProveedor: "Excelente servicio",
    },
    {
      id: "6",
      area: "Laboratorio de Química",
      proveedor: "Químicos y Reactivos SA",
      cuenta: "5010",
      nombreCuenta: "Material Didáctico",
      concepto: "Reactivos químicos para prácticas",
      cantidad: 15,
      valor: 350000,
      iva: 66500,
      valorTotal: 416500,
      justificacion: "Reactivos para experimentos del segundo semestre",
      fecha: new Date().toISOString(),
      solicitante: "consultor4",
      estado: "Pendiente",
      aprobador: null,
      fechaAprobacion: null,
      tipoPago: null,
      pagadoPor: null,
      fechaPago: null,
    },
    {
      id: "7",
      area: "Sala de Informática",
      proveedor: "Tecnología Educativa SAS",
      cuenta: "5040",
      nombreCuenta: "Tecnología e Informática",
      concepto: "Licencias de software educativo",
      cantidad: 30,
      valor: 450000,
      iva: 85500,
      valorTotal: 535500,
      justificacion: "Renovación de licencias anuales",
      fecha: new Date().toISOString(),
      solicitante: "consultor1",
      estado: "Pendiente",
      aprobador: null,
      fechaAprobacion: null,
      tipoPago: null,
      pagadoPor: null,
      fechaPago: null,
    },
    {
      id: "8",
      area: "Artes",
      proveedor: "Materiales Artísticos Ltda",
      cuenta: "5010",
      nombreCuenta: "Material Didáctico",
      concepto: "Pinceles, acuarelas y lienzos",
      cantidad: 25,
      valor: 280000,
      iva: 53200,
      valorTotal: 333200,
      justificacion: "Material para taller de pintura",
      fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      solicitante: "consultor5",
      estado: "Pendiente",
      aprobador: null,
      fechaAprobacion: null,
      tipoPago: null,
      pagadoPor: null,
      fechaPago: null,
    },
    {
      id: "9",
      area: "Rectoría",
      proveedor: "Papelería Central",
      cuenta: "5020",
      nombreCuenta: "Papelería y Útiles de Oficina",
      concepto: "Archivadores y carpetas",
      cantidad: 40,
      valor: 120000,
      iva: 22800,
      valorTotal: 142800,
      justificacion: "Organización de documentación institucional",
      fecha: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      solicitante: "consultor2",
      estado: "Pendiente",
      aprobador: null,
      fechaAprobacion: null,
      tipoPago: null,
      pagadoPor: null,
      fechaPago: null,
    },
  ]

  const requisicionesCalificar = [
    {
      id: "req-cal-002",
      numero: "REQ-000102",
      area: "Ciencias Naturales",
      proveedor: "Papelería Central",
      cuenta: "5010",
      nombreCuenta: "Material Didáctico",
      concepto: "Microscopios educativos",
      cantidad: 5,
      valor: 500000,
      iva: 95000,
      valorTotal: 595000,
      justificacion: "Equipamiento laboratorio de ciencias",
      fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      solicitante: "María García",
      estado: "Entregada",
      aprobador: "consultor",
      fechaAprobacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      numeroComite: "COM-2025-001",
      tipoPago: "Pago",
      pagadoPor: "tesoreria",
      fechaPago: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      tipoAprobacion: "Rector",
      calificacionProveedor: {
        precio: 4,
        puntualidad: 5,
        tiempoGarantia: 4,
        tiempoEntrega: 4,
        calidadProducto: 5,
        otro: 0,
        comentario: "Excelente calidad de los microscopios",
        calificadoPor: "consultor",
        fechaCalificacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      id: "req-cal-006",
      numero: "REQ-000106",
      area: "Ciencias Naturales",
      proveedor: "LabSupplies Pro",
      cuenta: "5110",
      nombreCuenta: "Reactivos y Químicos",
      concepto: "Reactivos para laboratorio de química",
      cantidad: 50,
      valor: 1800000,
      iva: 342000,
      valorTotal: 2142000,
      justificacion: "Reposición stock laboratorio química",
      fecha: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      solicitante: "María García",
      estado: "Entregada",
      aprobador: "consultor",
      fechaAprobacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      numeroComite: "COM-2025-002",
      tipoPago: "Pago",
      pagadoPor: "tesoreria",
      fechaPago: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      tipoAprobacion: "Síndico",
      calificacionProveedor: {
        precio: 4,
        puntualidad: 3,
        tiempoGarantia: 3,
        tiempoEntrega: 3,
        calidadProducto: 4,
        otro: 3,
        comentario: "Productos correctos pero la entrega tuvo retrasos",
        calificadoPor: "consultor",
        fechaCalificacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      id: "req-cal-007",
      numero: "REQ-000107",
      area: "Ciencias Naturales",
      proveedor: "EduModels",
      cuenta: "5010",
      nombreCuenta: "Material Didáctico",
      concepto: "Modelos anatómicos 3D",
      cantidad: 8,
      valor: 950000,
      iva: 180500,
      valorTotal: 1130500,
      justificacion: "Material didáctico biología humana",
      fecha: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      solicitante: "María García",
      estado: "Entregada",
      aprobador: "consultor",
      fechaAprobacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      numeroComite: "COM-2025-003",
      tipoPago: "Pago",
      pagadoPor: "tesoreria",
      fechaPago: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tipoAprobacion: "Rector, Vicerrector",
      calificacionProveedor: {
        precio: 4,
        puntualidad: 5,
        tiempoGarantia: 4,
        tiempoEntrega: 5,
        calidadProducto: 5,
        otro: 0,
        comentario: "Modelos muy detallados y resistentes",
        calificadoPor: "consultor",
        fechaCalificacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  ]

  localStorage.setItem("requisiciones", JSON.stringify([...mockRequisiciones, ...requisicionesCalificar]))
}

export const initializeRequisitionsData = initializeRequisicionesData

// Inicializar datos de inventario
export function initializeInventoryRequestsData() {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem("solicitudesInventario")
  if (existing === null) {
    localStorage.setItem("solicitudesInventario", JSON.stringify([]))
  }
}

export function initializeAreasData() {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem("areasPersonal")
  if (!existing) {
    const initialData = areas.map((area) => ({
      area,
      personal: [],
    }))
    localStorage.setItem("areasPersonal", JSON.stringify(initialData))
  }
}

export function initializeApprovalControl() {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem("approvalControlEnabled")
  if (existing === null) {
    localStorage.setItem("approvalControlEnabled", "false")
  }
}

// Inicializar datos de proveedores
export function initializeProvidersData() {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem("proveedores")
  if (!existing) {
    const initialProviders = [
      {
        id: "1",
        nit: "900123456-7",
        nombre: "Papelería Central",
        contacto: "Juan Pérez",
        telefono: "3001234567",
        correo: "contacto@papeleriacentral.com",
        tipoInsumo: "Papelería y Útiles",
        ciudad: "Bogotá",
        direccion: "Calle 15 # 45-30",
      },
      {
        id: "2",
        nit: "900234567-8",
        nombre: "Tecnología Educativa SAS",
        contacto: "María González",
        telefono: "3009876543",
        correo: "ventas@tecnologiaedu.com",
        tipoInsumo: "Tecnología e Informática",
        ciudad: "Medellín",
        direccion: "Carrera 50 # 25-45",
      },
      {
        id: "3",
        nit: "800345678-9",
        nombre: "Distribuidora de Deportes Colombia",
        contacto: "Carlos López",
        telefono: "3127654321",
        correo: "info@deportescolumbia.com",
        tipoInsumo: "Material Deportivo",
        ciudad: "Cali",
        direccion: "Avenida 6N # 15-22",
      },
    ]
    localStorage.setItem("proveedores", JSON.stringify(initialProviders))
  }
}

// Inicializar datos de solicitudes de presupuesto
export function initializeBudgetRequestsData() {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem("solicitudesPresupuesto")
  if (!existing) {
    const mockSolicitudes = [
      {
        id: "1",
        area: "Tecnología",
        solicitante: "consultor2",
        montoSolicitado: 500000,
        justificacion: "Compra de equipos para laboratorio de informática",
        fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        estado: "Aprobada",
        aprobador: "admin",
        fechaAprobacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        periodo: "2025",
        articulos: [
          {
            id: "art1",
            cuenta: "5040 - Tecnología e Informática",
            concepto: "Tóner y cartuchos",
            cantidad: 10,
            valorEstimado: 30000,
          },
          {
            id: "art2",
            cuenta: "5040 - Tecnología e Informática",
            concepto: "Cables y conectores",
            cantidad: 20,
            valorEstimado: 10000,
          },
        ],
      },
      {
        id: "2",
        area: "Educación Física",
        solicitante: "consultor1",
        montoSolicitado: 2000000,
        justificacion: "Equipamiento para nuevas canchas",
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        estado: "Pendiente",
        aprobador: null,
        fechaAprobacion: null,
        periodo: "2025",
        articulos: [
          {
            id: "art3",
            cuenta: "5050 - Material Deportivo",
            concepto: "Balones",
            cantidad: 30,
            valorEstimado: 50000,
          },
          {
            id: "art4",
            cuenta: "5050 - Material Deportivo",
            concepto: "Redes",
            cantidad: 10,
            valorEstimado: 35000,
          },
        ],
      },
      {
        id: "3",
        area: "Ciencias Naturales",
        solicitante: "consultor1",
        montoSolicitado: 1500000,
        justificacion: "Material didáctico para laboratorio",
        fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        estado: "Aprobada",
        aprobador: "admin",
        fechaAprobacion: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        periodo: "2025",
        articulos: [
          {
            id: "art5",
            cuenta: "5010 - Material Didáctico",
            concepto: "Cartulinas",
            cantidad: 100,
            valorEstimado: 1200,
          },
          {
            id: "art6",
            cuenta: "5010 - Material Didáctico",
            concepto: "Material de laboratorio",
            cantidad: 15,
            valorEstimado: 80000,
          },
          {
            id: "art7",
            cuenta: "5010 - Material Didáctico",
            concepto: "Marcadores",
            cantidad: 50,
            valorEstimado: 2500,
          },
        ],
      },
      {
        id: "4",
        area: "Administración General",
        solicitante: "consultor2",
        montoSolicitado: 800000,
        justificacion: "Papelería y útiles para el año escolar",
        fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        estado: "Aprobada",
        aprobador: "admin",
        fechaAprobacion: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        periodo: "2025",
        articulos: [
          {
            id: "art8",
            cuenta: "5020 - Papelería y Útiles de Oficina",
            concepto: "Resmas de papel",
            cantidad: 100,
            valorEstimado: 12000,
          },
          {
            id: "art9",
            cuenta: "5020 - Papelería y Útiles de Oficina",
            concepto: "Bolígrafos",
            cantidad: 500,
            valorEstimado: 800,
          },
          {
            id: "art10",
            cuenta: "5020 - Papelería y Útiles de Oficina",
            concepto: "Carpetas",
            cantidad: 200,
            valorEstimado: 1500,
          },
        ],
      },
    ]
    localStorage.setItem("solicitudesPresupuesto", JSON.stringify(mockSolicitudes))
  }
}

export interface CalificacionProveedor {
  id: string
  requisicionId: string
  proveedor: string
  fecha: string
  calificadoPor: string
  calificaciones: {
    precio: number
    puntualidad: number
    garantia: number
    tiempoEntrega: number
    calidadProducto: number
    otro?: number
  }
  comentario?: string
}

export interface CalificacionConsultor {
  id: string
  requisicionId: string
  area: string
  fecha: string
  calificadoPor: string
  calificaciones: {
    tiempoEntrega: number
    amabilidad: number
    otro?: number
  }
}

export interface ActividadConsultor {
  id: string
  fecha: string
  tipo:
    | "Aprobación Requisición"
    | "Rechazo Requisición"
    | "Aprobación Partida"
    | "Rechazo Partida"
    | "Edición"
    | "Calificación Proveedor"
  descripcion: string
  requisicionId?: string
  partidaId?: string
  detalles: any
}

export function guardarCalificacionProveedor(calificacion: CalificacionProveedor) {
  if (typeof window === "undefined") return

  const calificaciones = JSON.parse(localStorage.getItem("calificacionesProveedores") || "[]")
  calificaciones.push(calificacion)
  localStorage.setItem("calificacionesProveedores", JSON.stringify(calificaciones))
}

export function obtenerCalificacionesProveedor(proveedor?: string): CalificacionProveedor[] {
  if (typeof window === "undefined") return []

  const calificaciones = JSON.parse(localStorage.getItem("calificacionesProveedores") || "[]")
  if (proveedor) {
    return calificaciones.filter((c: CalificacionProveedor) => c.proveedor === proveedor)
  }
  return calificaciones
}

export function obtenerPromedioProveedor(proveedor: string) {
  const calificaciones = obtenerCalificacionesProveedor(proveedor)
  if (calificaciones.length === 0) return null

  const totales = calificaciones.reduce(
    (acc, cal) => {
      acc.precio += cal.calificaciones.precio
      acc.puntualidad += cal.calificaciones.puntualidad
      acc.garantia += cal.calificaciones.garantia
      acc.tiempoEntrega += cal.calificaciones.tiempoEntrega
      acc.calidad += cal.calificaciones.calidadProducto
      if (cal.calificaciones.otro) acc.otro += cal.calificaciones.otro
      return acc
    },
    { precio: 0, puntualidad: 0, garantia: 0, tiempoEntrega: 0, calidad: 0, otro: 0 },
  )

  const count = calificaciones.length
  return {
    precio: totales.precio / count,
    puntualidad: totales.puntualidad / count,
    garantia: totales.garantia / count,
    tiempoEntrega: totales.tiempoEntrega / count,
    calidad: totales.calidad / count,
    otro: totales.otro / count,
    promedio:
      (totales.precio + totales.puntualidad + totales.garantia + totales.tiempoEntrega + totales.calidad) / (5 * count),
  }
}

export function guardarCalificacionConsultor(calificacion: CalificacionConsultor) {
  if (typeof window === "undefined") return

  const calificaciones = JSON.parse(localStorage.getItem("calificacionesConsultor") || "[]")
  calificaciones.push(calificacion)
  localStorage.setItem("calificacionesConsultor", JSON.stringify(calificaciones))
}

export function obtenerCalificacionesConsultor(): CalificacionConsultor[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("calificacionesConsultor") || "[]")
}

export function obtenerPromedioConsultor() {
  const calificaciones = obtenerCalificacionesConsultor()
  if (calificaciones.length === 0) return null

  const totales = calificaciones.reduce(
    (acc, cal) => {
      acc.tiempoEntrega += cal.calificaciones.tiempoEntrega
      acc.amabilidad += cal.calificaciones.amabilidad
      if (cal.calificaciones.otro) acc.otro += cal.calificaciones.otro
      return acc
    },
    { tiempoEntrega: 0, amabilidad: 0, otro: 0 },
  )

  const count = calificaciones.length
  return {
    tiempoEntrega: totales.tiempoEntrega / count,
    amabilidad: totales.amabilidad / count,
    otro: totales.otro / count,
    promedio: (totales.tiempoEntrega + totales.amabilidad) / (2 * count),
  }
}

export function registrarActividadConsultor(actividad: Omit<ActividadConsultor, "id" | "fecha">) {
  if (typeof window === "undefined") return

  const actividades = JSON.parse(localStorage.getItem("actividadesConsultor") || "[]")
  const nuevaActividad: ActividadConsultor = {
    ...actividad,
    id: Date.now().toString(),
    fecha: new Date().toISOString(),
  }
  actividades.unshift(nuevaActividad)
  localStorage.setItem("actividadesConsultor", JSON.stringify(actividades))
}

export function obtenerActividadesConsultor(): ActividadConsultor[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("actividadesConsultor") || "[]")
}

export function initializeData() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem("requisiciones")) {
    initializeRequisicionesData()
  }

  const requisicionesEjemplo = [
    // Requisición lista para que el consultor califique al proveedor
    {
      id: "req-cal-001",
      numero: "REQ-000101",
      area: "Tecnología",
      proveedor: "Tecnología Educativa SAS",
      cuenta: "5040",
      nombreCuenta: "Tecnología e Informática",
      concepto: "Cables HDMI y adaptadores",
      cantidad: 15,
      valor: 180000,
      iva: 34200,
      valorTotal: 214200,
      justificacion: "Conectividad para salas de audiovisuales",
      fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      solicitante: "Juan Pérez",
      estado: "Pendiente Inventario",
      aprobador: "consultor",
      fechaAprobacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      numeroComite: "COM-2025-001",
      tipoPago: "Pago",
      pagadoPor: "tesoreria",
      fechaPago: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      tipoAprobacion: "Rector",
    },
  ]

  const requisicionesActuales = JSON.parse(localStorage.getItem("requisiciones") || "[]")
  localStorage.setItem("requisiciones", JSON.stringify([...requisicionesActuales, ...requisicionesEjemplo]))
}

export function getRequisiciones() {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("requisiciones")
  if (!stored) {
    initializeRequisicionesData()
    return JSON.parse(localStorage.getItem("requisiciones") || "[]")
  }

  return JSON.parse(stored)
}

export interface Activo {
  id: string
  codigo: string // Código único del activo
  nombre: string
  descripcion: string
  categoria: string
  estado: "Activo" | "En Reparación" | "Dado de Baja" | "En Mantenimiento"
  areaAsignada: string
  responsableArea: string
  fechaRegistro: string
  ubicacionActual: string
  valorAdquisicion?: number
  fechaAdquisicion?: string
  proveedor?: string
  comentarios?: string
}

export interface SolicitudTraslado {
  id: string
  numeroSolicitud: string
  activoId: string
  activoCodigo: string
  activoNombre: string
  areaOrigen: string
  areaDestino: string
  motivo: string
  solicitante: string
  fechaSolicitud: string
  estado: "Pendiente" | "Aprobada" | "Rechazada"
  aprobador?: string
  fechaAprobacion?: string
  motivoRechazo?: string
  comentarios?: string
}

export interface HistorialMovimiento {
  id: string
  activoId: string
  activoCodigo: string
  activoNombre: string
  areaOrigen: string
  areaDestino: string
  motivo: string
  solicitante: string
  aprobador: string
  fechaSolicitud: string
  fechaAprobacion: string
  numeroSolicitud: string
}

// Categorías de activos
export const categoriasActivos = [
  "Mobiliario",
  "Equipos de Cómputo",
  "Equipos de Laboratorio",
  "Equipos Audiovisuales",
  "Equipos Deportivos",
  "Herramientas",
  "Vehículos",
  "Electrodomésticos",
  "Equipos de Oficina",
  "Instrumentos Musicales",
  "Libros y Material Bibliográfico",
  "Otros",
]

// Inicializar datos de activos
export function initializeActivosData() {
  if (typeof window === "undefined") return

  const activosEjemplo: Activo[] = [
    {
      id: "act-001",
      codigo: "MOB-2024-001",
      nombre: "Escritorio ejecutivo",
      descripcion: "Escritorio de madera con cajones",
      categoria: "Mobiliario",
      estado: "Activo",
      areaAsignada: "Administración General",
      responsableArea: "admin",
      fechaRegistro: new Date("2024-01-15").toISOString(),
      ubicacionActual: "Oficina Principal",
      valorAdquisicion: 850000,
      fechaAdquisicion: "2024-01-15",
      proveedor: "Muebles y Diseño",
    },
    {
      id: "act-002",
      codigo: "COMP-2024-001",
      nombre: "Computador portátil HP",
      descripcion: "Laptop HP ProBook 450 G9",
      categoria: "Equipos de Cómputo",
      estado: "Activo",
      areaAsignada: "Ciencias Naturales",
      responsableArea: "ciencias",
      fechaRegistro: new Date("2024-02-10").toISOString(),
      ubicacionActual: "Laboratorio de Ciencias",
      valorAdquisicion: 2500000,
      fechaAdquisicion: "2024-02-10",
      proveedor: "Tecnología Educativa SAS",
    },
    {
      id: "act-003",
      codigo: "LAB-2024-001",
      nombre: "Microscopio binocular",
      descripcion: "Microscopio binocular 1000x",
      categoria: "Equipos de Laboratorio",
      estado: "Activo",
      areaAsignada: "Ciencias Naturales",
      responsableArea: "ciencias",
      fechaRegistro: new Date("2024-03-05").toISOString(),
      ubicacionActual: "Laboratorio de Biología",
      valorAdquisicion: 1200000,
      fechaAdquisicion: "2024-03-05",
      proveedor: "LabSupplies Pro",
    },
    {
      id: "act-004",
      codigo: "AUD-2024-001",
      nombre: "Proyector Epson",
      descripcion: "Proyector multimedia 3500 lúmenes",
      categoria: "Equipos Audiovisuales",
      estado: "En Reparación",
      areaAsignada: "Matemáticas",
      responsableArea: "matematicas",
      fechaRegistro: new Date("2024-01-20").toISOString(),
      ubicacionActual: "Sala de Audiovisuales",
      valorAdquisicion: 1800000,
      fechaAdquisicion: "2024-01-20",
      proveedor: "Tecnología Educativa SAS",
    },
    {
      id: "act-005",
      codigo: "DEP-2024-001",
      nombre: "Set de balones deportivos",
      descripcion: "10 balones de fútbol profesionales",
      categoria: "Equipos Deportivos",
      estado: "Activo",
      areaAsignada: "Educación Física",
      responsableArea: "admin",
      fechaRegistro: new Date("2024-02-15").toISOString(),
      ubicacionActual: "Bodega Deportiva",
      valorAdquisicion: 500000,
      fechaAdquisicion: "2024-02-15",
      proveedor: "Deportes Total",
    },
    {
      id: "act-006",
      codigo: "MOB-2024-002",
      nombre: "Sillas ergonómicas",
      descripcion: "Set de 30 sillas ergonómicas",
      categoria: "Mobiliario",
      estado: "Activo",
      areaAsignada: "Tecnología",
      responsableArea: "admin",
      fechaRegistro: new Date("2024-03-10").toISOString(),
      ubicacionActual: "Sala de Informática",
      valorAdquisicion: 3000000,
      fechaAdquisicion: "2024-03-10",
      proveedor: "Muebles y Diseño",
    },
    {
      id: "act-007",
      codigo: "COMP-2024-002",
      nombre: "Tablet Samsung Galaxy",
      descripcion: "Tablet educativa 10 pulgadas",
      categoria: "Equipos de Cómputo",
      estado: "Activo",
      areaAsignada: "Idiomas",
      responsableArea: "idiomas",
      fechaRegistro: new Date("2024-04-05").toISOString(),
      ubicacionActual: "Aula de Idiomas 2",
      valorAdquisicion: 1200000,
      fechaAdquisicion: "2024-04-05",
      proveedor: "Tecnología Educativa SAS",
    },
    {
      id: "act-008",
      codigo: "LAB-2024-002",
      nombre: "Balanza digital precisión",
      descripcion: "Balanza analítica 0.001g",
      categoria: "Equipos de Laboratorio",
      estado: "Activo",
      areaAsignada: "Ciencias Naturales",
      responsableArea: "ciencias",
      fechaRegistro: new Date("2024-05-10").toISOString(),
      ubicacionActual: "Laboratorio de Química",
      valorAdquisicion: 950000,
      fechaAdquisicion: "2024-05-10",
      proveedor: "LabSupplies Pro",
    },
  ]

  localStorage.setItem("activos", JSON.stringify(activosEjemplo))
}

// Inicializar datos de solicitudes de traslado
export function initializeSolicitudesTrasladoData() {
  if (typeof window === "undefined") return

  const solicitudesEjemplo: SolicitudTraslado[] = [
    {
      id: "sol-001",
      numeroSolicitud: "TRA-2024-001",
      activoId: "act-002",
      activoCodigo: "COMP-2024-001",
      activoNombre: "Computador portátil HP",
      areaOrigen: "Ciencias Naturales",
      areaDestino: "Matemáticas",
      motivo: "Necesario para presentaciones en clase de geometría",
      solicitante: "matematicas",
      fechaSolicitud: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      estado: "Pendiente",
    },
    {
      id: "sol-002",
      numeroSolicitud: "TRA-2024-002",
      activoId: "act-005",
      activoCodigo: "DEP-2024-001",
      activoNombre: "Set de balones deportivos",
      areaOrigen: "Educación Física",
      areaDestino: "Primaria",
      motivo: "Actividad deportiva especial del grado 4to",
      solicitante: "admin",
      fechaSolicitud: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      estado: "Aprobada",
      aprobador: "admin",
      fechaAprobacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "sol-003",
      numeroSolicitud: "TRA-2024-003",
      activoId: "act-007",
      activoCodigo: "COMP-2024-002",
      activoNombre: "Tablet Samsung Galaxy",
      areaOrigen: "Idiomas",
      areaDestino: "Biblioteca",
      motivo: "Para consultas digitales de estudiantes",
      solicitante: "admin",
      fechaSolicitud: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      estado: "Rechazada",
      aprobador: "admin",
      fechaAprobacion: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      motivoRechazo: "El equipo es específico para el aula de idiomas y cuenta con software especializado",
    },
  ]

  localStorage.setItem("solicitudesTraslado", JSON.stringify(solicitudesEjemplo))
}

// Inicializar historial de movimientos
export function initializeHistorialMovimientosData() {
  if (typeof window === "undefined") return

  const historialEjemplo: HistorialMovimiento[] = [
    {
      id: "hist-001",
      activoId: "act-005",
      activoCodigo: "DEP-2024-001",
      activoNombre: "Set de balones deportivos",
      areaOrigen: "Educación Física",
      areaDestino: "Primaria",
      motivo: "Actividad deportiva especial del grado 4to",
      solicitante: "admin",
      aprobador: "admin",
      fechaSolicitud: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      fechaAprobacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      numeroSolicitud: "TRA-2024-002",
    },
  ]

  localStorage.setItem("historialMovimientos", JSON.stringify(historialEjemplo))
}

// Funciones para manejar activos
export function getActivos(): Activo[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("activos")
  if (!stored) {
    initializeActivosData()
    return JSON.parse(localStorage.getItem("activos") || "[]")
  }

  return JSON.parse(stored)
}

export function guardarActivo(activo: Activo) {
  if (typeof window === "undefined") return

  const activos = getActivos()
  const index = activos.findIndex((a) => a.id === activo.id)

  if (index >= 0) {
    activos[index] = activo
  } else {
    activos.push(activo)
  }

  localStorage.setItem("activos", JSON.stringify(activos))
}

export function eliminarActivo(activoId: string) {
  if (typeof window === "undefined") return

  const activos = getActivos()
  const filtered = activos.filter((a) => a.id !== activoId)
  localStorage.setItem("activos", JSON.stringify(filtered))
}

// Funciones para manejar solicitudes de traslado
export function getSolicitudesTraslado(): SolicitudTraslado[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("solicitudesTraslado")
  if (!stored) {
    initializeSolicitudesTrasladoData()
    return JSON.parse(localStorage.getItem("solicitudesTraslado") || "[]")
  }

  return JSON.parse(stored)
}

export function guardarSolicitudTraslado(solicitud: SolicitudTraslado) {
  if (typeof window === "undefined") return

  const solicitudes = getSolicitudesTraslado()
  const index = solicitudes.findIndex((s) => s.id === solicitud.id)

  if (index >= 0) {
    solicitudes[index] = solicitud
  } else {
    solicitudes.push(solicitud)
  }

  localStorage.setItem("solicitudesTraslado", JSON.stringify(solicitudes))
}

// Funciones para manejar historial de movimientos
export function getHistorialMovimientos(): HistorialMovimiento[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("historialMovimientos")
  if (!stored) {
    initializeHistorialMovimientosData()
    return JSON.parse(localStorage.getItem("historialMovimientos") || "[]")
  }

  return JSON.parse(stored)
}

export function agregarHistorialMovimiento(historial: HistorialMovimiento) {
  if (typeof window === "undefined") return

  const movimientos = getHistorialMovimientos()
  movimientos.push(historial)
  localStorage.setItem("historialMovimientos", JSON.stringify(movimientos))
}

// Función para aprobar traslado
export function aprobarTraslado(solicitudId: string, aprobador: string) {
  if (typeof window === "undefined") return

  const solicitudes = getSolicitudesTraslado()
  const solicitud = solicitudes.find((s) => s.id === solicitudId)

  if (!solicitud) return

  // Actualizar solicitud
  solicitud.estado = "Aprobada"
  solicitud.aprobador = aprobador
  solicitud.fechaAprobacion = new Date().toISOString()
  localStorage.setItem("solicitudesTraslado", JSON.stringify(solicitudes))

  // Actualizar activo
  const activos = getActivos()
  const activo = activos.find((a) => a.id === solicitud.activoId)

  if (activo) {
    activo.areaAsignada = solicitud.areaDestino
    localStorage.setItem("activos", JSON.stringify(activos))
  }

  // Agregar al historial
  const historial: HistorialMovimiento = {
    id: `hist-${Date.now()}`,
    activoId: solicitud.activoId,
    activoCodigo: solicitud.activoCodigo,
    activoNombre: solicitud.activoNombre,
    areaOrigen: solicitud.areaOrigen,
    areaDestino: solicitud.areaDestino,
    motivo: solicitud.motivo,
    solicitante: solicitud.solicitante,
    aprobador: aprobador,
    fechaSolicitud: solicitud.fechaSolicitud,
    fechaAprobacion: new Date().toISOString(),
    numeroSolicitud: solicitud.numeroSolicitud,
  }

  agregarHistorialMovimiento(historial)
}

// Función para rechazar traslado
export function rechazarTraslado(solicitudId: string, aprobador: string, motivoRechazo: string) {
  if (typeof window === "undefined") return

  const solicitudes = getSolicitudesTraslado()
  const solicitud = solicitudes.find((s) => s.id === solicitudId)

  if (!solicitud) return

  solicitud.estado = "Rechazada"
  solicitud.aprobador = aprobador
  solicitud.fechaAprobacion = new Date().toISOString()
  solicitud.motivoRechazo = motivoRechazo

  localStorage.setItem("solicitudesTraslado", JSON.stringify(solicitudes))
}
