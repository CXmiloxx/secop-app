import { ModuleRouterType, RouterType } from "@/types/router.types"
import {
  DollarSign,
  ShoppingCart,
  Package,
  FileText,
  ClipboardList,
  CheckSquare,
  CreditCard,
  Star,
  Building2,
  Tags,
  Calculator,
  Wallet,
  Activity,
  Box,
  ArrowRightLeft,
  User,
  BookOpen,
  Users,
  Briefcase,
  Settings,
  Send,
  ShieldCheck,
  FilePlus2,
  ClipboardCheck,
  BarChart2,
  Layers,
  Coins,
  Archive,
  Repeat,
  FolderOpen,
  BadgeDollarSign,
} from "lucide-react"

const menuItems: RouterType[] = [
  {
    title: "Áreas",
    icon: Layers, // Mejor que User, representa estructura o secciones
    href: "/areas",
    roles: ["admin"],
  },
  {
    title: "Creacion de usuarios",
    icon: Users, // Grupal, indica gestión de usuarios
    href: "/admin",
    roles: ["admin"],
  },
  {
    title: "Proveedores",
    icon: Briefcase, // Relacionado a negocios/partners
    href: "/proveedores",
    roles: ["admin"],
  },
  {
    title: "Cuentas contables",
    icon: Coins, // Más financiero que BookOpen
    href: "/cuentas-contables",
    roles: ["admin"],
  },
  {
    title: "Presupuestos",
    icon: DollarSign,
    href: "/presupuestos",
    roles: ["admin", "responsableArea", "rector", "consultor", "cajaMenor", "tesoreria"],
  },
  {
    title: "Solicitar Presupuesto",
    icon: Send, // Representa enviar o solicitar
    href: "/solicitar-presupuesto",
    roles: ["responsableArea", "consultor", "cajaMenor", "tesoreria", "admin"],
  },
  {
    title: "Salida de Productos",
    icon: ArrowRightLeft, // Movimiento, salida de productos
    href: "/salida-productos",
    roles: ["responsableArea", "consultor", "cajaMenor", "tesoreria", "admin"],
  },
  {
    title: "Aprobación de Presupuesto Áreas",
    icon: ShieldCheck, // Representa aprobación/seguridad
    href: "/aprobaciones-presupuesto",
    roles: ["admin", "rector"],
  },
  {
    title: "Requisiciones",
    icon: ClipboardList, // Lista de requerimientos, representa requisiciones
    href: "/requisiciones",
    roles: ["responsableArea", "consultor", "cajaMenor", "tesoreria", "admin"],
  },
  {
    title: "Partidas No Presupuestadas",
    icon: FilePlus2, // Añadir archivo/partida
    href: "/partidas-no-presupuestadas",
    roles: ["admin", "responsableArea", "consultor", "cajaMenor", "tesoreria", "Auditoría"],
  },
  {
    title: "Aprobaciones",
    icon: ClipboardCheck, // Mejor que CheckSquare para el flujo de revisión
    href: "/aprobaciones",
    roles: ["consultor"],
  },
  {
    title: "caja Menor",
    icon: Wallet, // Dinero inmediato, correcto
    href: "/caja-menor",
    roles: ["cajaMenor", "admin"],
  },
  {
    title: "tesoreria",
    icon: CreditCard, // Correcto para representar tesorería
    href: "/tesoreria",
    roles: ["tesoreria", "cajaMenor"],
  },
  {
    title: "Calificaciones",
    icon: Star, // Representa puntuación
    href: "/calificaciones",
    roles: ["consultor", "responsableArea", "tesoreria", "cajaMenor", "admin"],
  },
  {
    title: "Compras",
    icon: ShoppingCart,
    href: "/compras",
    roles: ["admin", "responsableArea", "Auditoría", "consultor", "cajaMenor", "tesoreria"],
  },
  {
    title: "Inventario",
    icon: Archive, // Más exacto que Package, representa guardado/depósito/inventario
    href: "/inventario",
    roles: ["admin", "responsableArea", "Auditoría", "consultor", "cajaMenor", "tesoreria"],
  },
  /*  {
     title: "Inventario de Activos",
     icon: Box,
     href: "/activos",
     roles: ["admin", "responsableArea", "Auditoría", "cajaMenor", "tesoreria", "consultor",],
   }, */
  /* {
    title: "Traslados de Activos",
    icon: Repeat,
    href: "/traslados-activos",
    roles: ["admin", "responsableArea"],
  }, */
  {
    title: "Reportes",
    icon: BarChart2, // Mejor que FileText para representar reportes
    href: "/reportes",
    roles: ["admin", "Auditoría", "consultor"],
  },
  /* {
    title: "Supervisión del consultor",
    icon: Activity,
    href: "/supervision-consultor",
    roles: ["admin"],
  } */
]

const modules: ModuleRouterType[] = [
  /*  {
     id: "contabilidad",
     title: "Contabilidad",
     icon: Calculator,
     roles: ["admin"],
     items: [
       {
         title: "Proyección",
         href: "/proyeccion",
       },
       {
         title: "Proyectos de Inversión",
         href: "/proyectos-inversion",
       },
     ]
   }, */
]

export {
  menuItems, modules
}