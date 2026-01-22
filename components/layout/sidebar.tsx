"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { UserType } from "@/types/user.types"
import { menuItems, modules } from "@/routes/routes"
import { useThemeState } from "@/store/theme.store"
import ToggleTheme from "../ToggleTheme"

interface SidebarProps {
  user: UserType | null
  onLogout: () => void
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedModules, setExpandedModules] = useState<string[]>(["contabilidad"])
  const { theme } = useThemeState()



  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }



  const availableMenuItems = menuItems.filter((item) => {
    if (!user?.rol?.nombre || !item.roles.includes(user.rol.nombre)) return false

    // Exclude reports for Ciencias Naturales area
    if (item.href === "/reportes" && user?.area?.nombre === "ciencias") {
      return false
    }

    return true
  })

  const availableModules = modules.filter((module) =>
    user?.rol?.nombre !== undefined && module.roles.includes(user.rol.nombre)
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 mr-5 mb-8" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform duration-300 ease-in-out flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative w-10 h-10 md:w-14 md:h-14 shrink-0">
                <img
                  src={theme === 'dark' ? '/icon-secop-dark.webp' : '/icon-secop-removebg-preview.webp'}
                  alt="Logo"
                  className="object-contain w-full h-full rounded-md border bg-muted"
                  draggable={false}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm md:text-lg font-bold ">Sistema de Gestión</h2>
                <p className="text-xs text-muted-foreground mt-0.5 ">
                  Colegio Bilingüe Lacordaire
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="border-b p-3 md:p-4 bg-muted/50">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs md:text-sm xl:text-base font-medium truncate">
                {user?.nombre} {user?.apellido}
              </p>
              <p className="text-[10px] md:text-xs xl:text-sm text-muted-foreground truncate">
                {user?.area?.nombre}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 md:p-4">
            <ul className="space-y-1">
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
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </li>
                )
              })}

              {availableModules.map((module) => {
                const isExpanded = expandedModules.includes(module.id)
                const isModuleActive = module?.items?.some((item) => pathname === item.href)

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
                        <module.icon className="h-5 w-5 shrink-0" />
                        <span className="truncate">{module.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {module?.items?.map((subItem) => {
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

          {/* Footer */}
          <div className="border-t p-3 md:p-4 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="text-sm">Cerrar Sesión</span>
            </Button>
            <div className="flex justify-center">
              <ToggleTheme />
            </div>
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

      {/* Spacer for desktop */}
      <div className="hidden md:block md:w-64" />
    </>
  )
}

export default Sidebar
