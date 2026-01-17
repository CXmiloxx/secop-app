import { menuItems, modules } from "@/routes/routes"
import { RolNombre } from "@/types/user.types"

export function getAllowedRolesForRoute(pathname: string): RolNombre[] | null {
  const route = menuItems.find(item => item.href === pathname)
  if (route) {
    return route.roles
  }

  for (const module of modules) {
    const moduleRoute = module.items?.find(item => item.href === pathname)
    if (moduleRoute) {
      return module.roles
    }
  }

  return null
}

export function hasAccessToRoute(
  pathname: string,
  userRole: RolNombre | undefined,
  userArea?: string
): boolean {
  if (!userRole) return false

  const allowedRoles = getAllowedRolesForRoute(pathname)
  if (!allowedRoles) return true

  if (!allowedRoles.includes(userRole)) return false

  return true
}