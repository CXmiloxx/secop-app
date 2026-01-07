import { LucideIcon } from "lucide-react"
import { RolNombre } from "./user.types"

export interface RouterType {
  title: string
  icon: LucideIcon
  href: string
  roles: RolNombre[]
}

export interface ModuleRouterType {
  id: string
  title: string
  icon: LucideIcon
  roles: RolNombre[]
  items?: Array<{
    title: string
    href: string
  }>
}