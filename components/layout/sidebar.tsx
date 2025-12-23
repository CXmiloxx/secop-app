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
  const {theme} = useThemeState()

  if (!user) {
    return null
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }



  const availableMenuItems = menuItems.filter((item) => {
    if (!item.roles.includes(user?.rol?.nombre)) return false

    // Exclude reports for Ciencias Naturales area
    if (item.href === "/reportes" && user?.area?.nombre === "ciencias") {
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
          // Use responsive width: 64 for md+, 20 (5rem) for small screens
          "fixed left-0 top-0 z-40 h-screen md:w-64 sm:w-20 w-20 border-r bg-card transition-transform duration-300 flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b p-4 md:p-6 flex items-center justify-between gap-2 md:gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-lg font-bold whitespace-nowrap">Sistema de Gestión</h2>
              <p className="text-xs text-muted-foreground mt-1 hidden md:block whitespace-nowrap">
                Colegio Bilingüe Lacordaire
              </p>
            </div>
            {/* Image */}
            <div className="flex items-center justify-end w-12 h-12 md:w-20 md:h-20 shrink-0 ml-32">
              <div className="relative w-10 h-10 md:w-16 md:h-16">
                <img
                  src={theme === 'dark' ? '/icon-secop-dark.webp' : '/icon-secop-removebg-preview.webp'}
                  alt="Logo"
                  className="object-contain w-full h-full rounded-md border bg-muted"
                  style={{ aspectRatio: '1 / 1' }}
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="border-b p-3 md:p-4 bg-muted/50 flex gap-2 items-center">
            <div>
              <p className="text-xs md:text-sm font-medium truncate">{user.nombre} {user.apellido}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground truncate">{user.area.nombre}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 md:p-4">
            <ul className="space-y-1 md:space-y-2">
              {availableMenuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 md:gap-3 rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm transition-colors",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                      <span className="truncate">{item.title}</span>
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
                        "flex w-full items-center justify-between gap-2 md:gap-3 rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm transition-colors",
                        isModuleActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <module.icon className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                        <span className="truncate">{module.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />
                      ) : (
                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                      )}
                    </button>

                    {isExpanded && (
                      <ul className="mt-0.5 md:mt-1 ml-4 md:ml-7 space-y-0.5 md:space-y-1">
                        {module.items.map((subItem) => {
                          const isActive = pathname === subItem.href
                          return (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className={cn(
                                  "block rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm transition-colors",
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
          <div className="flex flex-row items-center gap-2 justify-center border-t p-3 md:p-4 mt-auto">
            <Button variant="outline" className="justify-start bg-transparent" onClick={onLogout}>
              <LogOut className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
              <span className="text-xs md:text-sm">Cerrar Sesión</span>
            </Button>
            <ToggleTheme/>
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
