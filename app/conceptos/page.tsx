"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, type User as UserType } from "@/lib/auth"
import { GestionarConceptos } from "@/components/admin/gestionar-conceptos"
import { Tags } from "lucide-react"

export default function ConceptosPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }

    if (currentUser.role !== "Administrador") {
      router.push("/presupuestos")
      return
    }

    setUser(currentUser)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (!user) return null

  return (
    <section>
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Tags className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Gestión de Conceptos</h1>
                <p className="text-muted-foreground">Configure los conceptos disponibles para cada cuenta contable</p>
              </div>
            </div>
          </div>
          <GestionarConceptos />
        </div>
      </div>
    </section>
  )
}
