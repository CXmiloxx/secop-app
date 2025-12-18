"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  ShoppingCart,
  Package,
  FileText,
  User,
  ClipboardList,
  CheckSquare,
  CreditCard,
  Menu,
  X,
  LogOut,
  Star,
  Building2,
  Tags,
  Calculator,
  ChevronDown,
  ChevronRight,
  Wallet,
  Activity,
  Box,
  ArrowRightLeft,
} from "lucide-react"
import type { CurrentUser } from '@/types'

interface SidebarProps {
  user: CurrentUser | null
  onLogout: () => void
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedModules, setExpandedModules] = useState<string[]>(["contabilidad"])

  if (!user) {
    return null
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const menuItems = [
    {
      title: "Áreas",
      icon: User,
      href: "/areas",
      roles: ["Admin"],
    },
    {
      title: "Proveedores",
      icon: Building2,
      href: "/proveedores",
      roles: ["Admin"],
    },
    {
      title: "Conceptos",
      icon: Tags,
      href: "/conceptos",
      roles: ["Admin"],
    },
    {
      title: "Presupuestos",
      icon: DollarSign,
      href: "/presupuestos",
      roles: ["Admin", "Responsable de Área", "Auditoría", "Consultor", "Caja Menor", "Tesorería"],
    },
    {
      title: "Solicitar Presupuesto",
      icon: FileText,
      href: "/solicitar-presupuesto",
      roles: ["Responsable de Área", "Consultor", "Caja Menor", "Tesorería"],
    },
    {
      title: "Aprobación de Presupuesto Áreas",
      icon: CheckSquare,
      href: "/aprobaciones-presupuesto",
      roles: ["Admin"],
    },
    {
      title: "Requisiciones",
      icon: ClipboardList,
      href: "/requisiciones",
      roles: ["Admin", "Responsable de Área", "Consultor", "Caja Menor", "Tesorería"],
    },
    {
      title: "Partidas No Presupuestadas",
      icon: FileText,
      href: "/partidas-no-presupuestadas",
      roles: ["Admin", "Responsable de Área", "Consultor", "Caja Menor", "Tesorería", "Auditoría"],
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
      roles: ["Caja Menor", "Admin"],
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
      roles: ["Responsable de Área"],
    },
    {
      title: "Compras",
      icon: ShoppingCart,
      href: "/compras",
      roles: ["Admin", "Responsable de Área", "Auditoría", "Consultor"],
    },
    {
      title: "Inventario",
      icon: Package,
      href: "/inventario",
      roles: ["Admin", "Responsable de Área", "Auditoría", "Consultor"],
    },
    {
      title: "Inventario de Activos",
      icon: Box,
      href: "/activos",
      roles: ["Admin", "Responsable de Área", "Auditoría"],
    },
    {
      title: "Traslados de Activos",
      icon: ArrowRightLeft,
      href: "/traslados-activos",
      roles: ["Admin", "Responsable de Área"],
    },
    {
      title: "Reportes",
      icon: FileText,
      href: "/reportes",
      roles: ["Admin", "Auditoría", "Responsable de Área", "Consultor"],
    },
    {
      title: "Supervisión del Consultor",
      icon: Activity,
      href: "/supervision-consultor",
      roles: ["Admin"],
    },
  ]

  const modules = [
    {
      id: "contabilidad",
      title: "Contabilidad",
      icon: Calculator,
          roles: ["Admin"],
      items: [
        {
          title: "Proyección",
          href: "/proyeccion",
        },
        {
          title: "Proyectos de Inversión",
          href: "/proyectos-inversion",
        },
      ],
    },
  ]

  const availableMenuItems = menuItems.filter((item) => {
    if (!item.roles.includes(user.rol.nombre)) return false

    // Exclude reports for Ciencias Naturales area
    if (item.href === "/reportes" && user.area === "Ciencias Naturales") {
      return false
    }

    return true
  })

  const availableModules = modules.filter((module) => module.roles.includes(user.rol.nombre))

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b p-6">
            <h2 className="text-lg font-bold">Sistema de Gestión</h2>
            <p className="text-xs text-muted-foreground mt-1">Colegio Bilingüe Lacordaire</p>
          </div>

          {/* User Info */}
          <div className="border-b p-4 bg-muted/50">
            <p className="text-sm font-medium truncate">{user.username}</p>
            <p className="text-xs text-muted-foreground truncate">{user.rol.nombre}</p>
            <p className="text-xs text-muted-foreground truncate">{user.area}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {availableMenuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}

              {availableModules.map((module) => {
                const isExpanded = expandedModules.includes(module.id)
                const isModuleActive = module.items.some((item) => pathname === item.href)

                return (
                  <li key={module.id}>
                    <button
                      onClick={() => toggleModule(module.id)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isModuleActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <module.icon className="h-4 w-4" />
                        <span>{module.title}</span>
                      </div>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    {isExpanded && (
                      <ul className="mt-1 ml-7 space-y-1">
                        {module.items.map((subItem) => {
                          const isActive = pathname === subItem.href
                          return (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className={cn(
                                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="border-t p-4">
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-3" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="hidden md:block md:w-64" />
    </>
  )
}

export default Sidebar
