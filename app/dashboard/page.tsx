"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { getCurrentUser, type User as UserType } from "@/lib/auth"
import {
  initializeBudgetData,
  initializePurchasesData,
  initializeInventoryData,
  initializeRequisitionsData,
  initializeInventoryRequestsData,
  initializeAreasData,
  initializeApprovalControl,
  initializeProvidersData,
  initializeBudgetRequestsData,
} from "@/lib/data"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)

    initializeBudgetData()
    initializePurchasesData()
    initializeInventoryData()
    initializeRequisitionsData()
    initializeInventoryRequestsData()
    initializeAreasData()
    initializeApprovalControl()
    initializeProvidersData()
    initializeBudgetRequestsData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 md:ml-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Bienvenido, {user.username}</h1>
                <p className="text-muted-foreground">
                  Utilice el menú lateral para navegar entre los módulos del sistema
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 border rounded-lg bg-card text-center">
            <p className="text-lg text-muted-foreground">Seleccione una opción del menú lateral para comenzar</p>
          </div>
        </div>
      </main>
    </div>
  )
}
