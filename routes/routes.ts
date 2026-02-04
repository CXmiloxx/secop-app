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
    title: "Cuentas contables",
    icon: BookOpen,
    href: "/cuentas-contables",
    roles: ["admin"],
  },
  {
    title: "Presupuestos",
    icon: DollarSign,
    href: "/presupuestos",
    roles: ["admin", "responsableArea", "Auditoría", "consultor", "cajaMenor", "tesoreria"],
  },
  {
    title: "Solicitar Presupuesto",
    icon: FileText,
    href: "/solicitar-presupuesto",
    roles: ["responsableArea", "consultor", "cajaMenor", "tesoreria", "admin"],
  },
  {
    title: "Salida de Productos",
    icon: Package,
    href: "/salida-productos",
    roles: ["responsableArea", "consultor", "cajaMenor", "tesoreria", "admin"],
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
    roles: ["responsableArea", "consultor", "cajaMenor", "tesoreria", "admin"],
  },
  {
    title: "Partidas No Presupuestadas",
    icon: FileText,
    href: "/partidas-no-presupuestadas",
    roles: ["admin", "responsableArea", "consultor", "cajaMenor", "tesoreria", "Auditoría"],
  },
  {
    title: "Aprobaciones",
    icon: CheckSquare,
    href: "/aprobaciones",
    roles: ["Rector", "consultor"],
  },
  {
    title: "caja Menor",
    icon: Wallet,
    href: "/caja-menor",
    roles: ["cajaMenor", "admin"],
  },
  {
    title: "tesoreria",
    icon: CreditCard,
    href: "/tesoreria",
    roles: ["tesoreria", "cajaMenor"],
  },
  {
    title: "Calificaciones",
    icon: Star,
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
    icon: Package,
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
    icon: ArrowRightLeft,
    href: "/traslados-activos",
    roles: ["admin", "responsableArea"],
  }, */
  {
    title: "Reportes",
    icon: FileText,
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