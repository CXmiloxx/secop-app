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
} from "lucide-react"


const menuItems: RouterType[] = [
  {
    title: "Áreas",
    icon: User,
    href: "/areas",
    roles: ["admin"],
  },
  {
    title: "Creacion de usuarios",
    icon: User,
    href: "/admin",
    roles: ["admin"],
  },
  {
    title: "Proveedores",
    icon: Building2,
    href: "/proveedores",
    roles: ["admin"],
  },
  {
    title: "Conceptos",
    icon: Tags,
    href: "/conceptos",
    roles: ["admin"],
  },
  {
    title: "Presupuestos",
    icon: DollarSign,
    href: "/presupuestos",
    roles: ["admin", "responsableArea", "Auditoría", "Consultor", "Caja Menor", "Tesorería"],
  },
  {
    title: "Solicitar Presupuesto",
    icon: FileText,
    href: "/solicitar-presupuesto",
    roles: ["responsableArea", "Consultor", "Caja Menor", "Tesorería"],
  },
  {
    title: "Aprobación de Presupuesto Áreas",
    icon: CheckSquare,
    href: "/aprobaciones-presupuesto",
    roles: ["admin"],
  },
  {
    title: "Requisiciones",
    icon: ClipboardList,
    href: "/requisiciones",
    roles: ["admin", "responsableArea", "Consultor", "Caja Menor", "Tesorería"],
  },
  {
    title: "Partidas No Presupuestadas",
    icon: FileText,
    href: "/partidas-no-presupuestadas",
    roles: ["admin", "responsableArea", "Consultor", "Caja Menor", "Tesorería", "Auditoría"],
  },
  {
    title: "Aprobaciones",
    icon: CheckSquare,
    href: "/aprobaciones",
    roles: ["Rector", "Consultor"],
  },
  {
    title: "Caja Menor",
    icon: Wallet,
    href: "/caja-menor",
    roles: ["Caja Menor", "admin"],
  },
  {
    title: "Tesorería",
    icon: CreditCard,
    href: "/tesoreria",
    roles: ["Tesorería", "Caja Menor"],
  },
  {
    title: "Calificaciones",
    icon: Star,
    href: "/calificaciones",
    roles: ["Consultor"],
  },
  {
    title: "Calificar Consultor",
    icon: Star,
    href: "/calificar-consultor",
    roles: ["responsableArea"],
  },
  {
    title: "Compras",
    icon: ShoppingCart,
    href: "/compras",
    roles: ["admin", "responsableArea", "Auditoría", "Consultor"],
  },
  {
    title: "Inventario",
    icon: Package,
    href: "/inventario",
    roles: ["admin", "responsableArea", "Auditoría", "Consultor"],
  },
  {
    title: "Inventario de Activos",
    icon: Box,
    href: "/activos",
    roles: ["admin", "responsableArea", "Auditoría"],
  },
  {
    title: "Traslados de Activos",
    icon: ArrowRightLeft,
    href: "/traslados-activos",
    roles: ["admin", "responsableArea"],
  },
  {
    title: "Reportes",
    icon: FileText,
    href: "/reportes",
    roles: ["admin", "Auditoría", "responsableArea", "Consultor"],
  },
  {
    title: "Supervisión del Consultor",
    icon: Activity,
    href: "/supervision-consultor",
    roles: ["admin"],
  }
]

const modules: ModuleRouterType[] = [
  {
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
  },
]

export {
  menuItems, modules
}