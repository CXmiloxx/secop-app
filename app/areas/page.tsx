"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Users, DollarSign, Trash2, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, type User } from "@/lib/auth"
import { areas, initializeAreasData } from "@/lib/data"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AreaPersonal {
  area: string
  personal: string[]
}

interface Budget {
  area: string
  presupuestoAnual: number
  totalGastado: number
  año: number
}

export default function AreasPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [areasData, setAreasData] = useState<AreaPersonal[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [showAddPersonDialog, setShowAddPersonDialog] = useState(false)
  const [showAddAreaDialog, setShowAddAreaDialog] = useState(false)
  const [showEditBudgetDialog, setShowEditBudgetDialog] = useState(false)
  const [newPersonName, setNewPersonName] = useState("")
  const [newAreaName, setNewAreaName] = useState("")
  const [newAreaBudget, setNewAreaBudget] = useState("")
  const [editBudgetValue, setEditBudgetValue] = useState("")
  const [editBudgetYear, setEditBudgetYear] = useState(new Date().getFullYear().toString())
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

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
    initializeAreasData()
    loadData()
  }, [router])

  const loadData = () => {
    const stored = localStorage.getItem("areasPersonal")
    if (stored) {
      setAreasData(JSON.parse(stored))
    }

    const budgetsData = localStorage.getItem("presupuestos")
    if (budgetsData) {
      setBudgets(JSON.parse(budgetsData))
    }
  }

  const handleAddPerson = () => {
    if (!selectedArea || !newPersonName.trim()) {
      setError("Complete todos los campos")
      return
    }

    const updated = areasData.map((a) =>
      a.area === selectedArea ? { ...a, personal: [...a.personal, newPersonName.trim()] } : a,
    )

    localStorage.setItem("areasPersonal", JSON.stringify(updated))
    setAreasData(updated)
    setNewPersonName("")
    setShowAddPersonDialog(false)
    setSuccess("Personal agregado exitosamente")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleRemovePerson = (area: string, personIndex: number) => {
    if (confirm("¿Eliminar esta persona del área?")) {
      const updated = areasData.map((a) =>
        a.area === area ? { ...a, personal: a.personal.filter((_, i) => i !== personIndex) } : a,
      )

      localStorage.setItem("areasPersonal", JSON.stringify(updated))
      setAreasData(updated)
      setSuccess("Personal eliminado exitosamente")
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const handleAddArea = () => {
    if (!newAreaName.trim() || !newAreaBudget) {
      setError("Complete todos los campos")
      return
    }

    const budgetValue = Number.parseFloat(newAreaBudget)
    if (isNaN(budgetValue) || budgetValue < 0) {
      setError("Ingrese un presupuesto válido")
      return
    }

    if (areas.includes(newAreaName.trim()) || areasData.some((a) => a.area === newAreaName.trim())) {
      setError("Esta área ya existe")
      return
    }

    const newArea: AreaPersonal = {
      area: newAreaName.trim(),
      personal: [],
    }

    const newBudget: Budget = {
      area: newAreaName.trim(),
      presupuestoAnual: budgetValue,
      totalGastado: 0,
      año: new Date().getFullYear(),
    }

    const updatedAreas = [...areasData, newArea]
    const updatedBudgets = [...budgets, newBudget]

    localStorage.setItem("areasPersonal", JSON.stringify(updatedAreas))
    localStorage.setItem("presupuestos", JSON.stringify(updatedBudgets))

    setAreasData(updatedAreas)
    setBudgets(updatedBudgets)
    setNewAreaName("")
    setNewAreaBudget("")
    setShowAddAreaDialog(false)
    setSuccess("Área agregada exitosamente")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleEditBudget = () => {
    if (!selectedArea || !editBudgetValue || !editBudgetYear) {
      setError("Complete todos los campos")
      return
    }

    const budgetValue = Number.parseFloat(editBudgetValue)
    const yearValue = Number.parseInt(editBudgetYear)

    if (isNaN(budgetValue) || budgetValue < 0) {
      setError("Ingrese un presupuesto válido")
      return
    }

    const existingBudget = budgets.find((b) => b.area === selectedArea && b.año === yearValue)

    let updatedBudgets
    if (existingBudget) {
      updatedBudgets = budgets.map((b) =>
        b.area === selectedArea && b.año === yearValue ? { ...b, presupuestoAnual: budgetValue } : b,
      )
    } else {
      updatedBudgets = [
        ...budgets,
        {
          area: selectedArea,
          presupuestoAnual: budgetValue,
          totalGastado: 0,
          año: yearValue,
        },
      ]
    }

    localStorage.setItem("presupuestos", JSON.stringify(updatedBudgets))
    setBudgets(updatedBudgets)
    setEditBudgetValue("")
    setEditBudgetYear(new Date().getFullYear().toString())
    setShowEditBudgetDialog(false)
    setSuccess("Presupuesto actualizado exitosamente")
    setTimeout(() => setSuccess(""), 3000)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getAreaBudget = (area: string) => {
    const currentYear = new Date().getFullYear()
    return budgets.find((b) => b.area === area && b.año === currentYear)
  }

  if (!user) return null

  return (
    <section>
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/presupuestos">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Gestión de Áreas</h1>
                <p className="text-sm text-muted-foreground">Administrar áreas, personal y presupuestos</p>
              </div>
            </div>
            <Button onClick={() => setShowAddAreaDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Área
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {success && (
          <div className="mb-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        )}

        <div className="grid gap-6">
          {areas.map((area) => {
            const areaData = areasData.find((a) => a.area === area) || { area, personal: [] }
            const budget = getAreaBudget(area)

            return (
              <Card key={area}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{area}</CardTitle>
                      <CardDescription>{areaData.personal.length} persona(s) asignada(s)</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedArea(area)
                          setShowAddPersonDialog(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Personal
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedArea(area)
                          setEditBudgetValue(budget?.presupuestoAnual.toString() || "")
                          setShowEditBudgetDialog(true)
                        }}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Editar Presupuesto
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budget && (
                      <div className="p-4 bg-muted rounded-lg grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Presupuesto {budget.año}</p>
                          <p className="text-lg font-semibold">{formatCurrency(budget.presupuestoAnual)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Gastado</p>
                          <p className="text-lg font-semibold text-destructive">
                            {formatCurrency(budget.totalGastado)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Disponible</p>
                          <p className="text-lg font-semibold text-primary">
                            {formatCurrency(budget.presupuestoAnual - budget.totalGastado)}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Personal Asignado
                      </h4>
                      {areaData.personal.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No hay personal asignado</p>
                      ) : (
                        <div className="space-y-2">
                          {areaData.personal.map((person, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-2 bg-background rounded border"
                            >
                              <span>{person}</span>
                              <Button size="sm" variant="ghost" onClick={() => handleRemovePerson(area, index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Add Person Dialog */}
      <Dialog open={showAddPersonDialog} onOpenChange={setShowAddPersonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Personal</DialogTitle>
            <DialogDescription>Agregar persona a {selectedArea}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="person-name">Nombre Completo</Label>
              <Input
                id="person-name"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                placeholder="Ingrese el nombre"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddPersonDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPerson}>Agregar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Area Dialog */}
      <Dialog open={showAddAreaDialog} onOpenChange={setShowAddAreaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Área</DialogTitle>
            <DialogDescription>Crear nueva área con presupuesto inicial</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="area-name">Nombre del Área</Label>
              <Input
                id="area-name"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                placeholder="Ej: Departamento de Inglés"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area-budget">Presupuesto Inicial (COP)</Label>
              <Input
                id="area-budget"
                type="number"
                value={newAreaBudget}
                onChange={(e) => setNewAreaBudget(e.target.value)}
                placeholder="0"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddAreaDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddArea}>Crear Área</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Budget Dialog */}
      <Dialog open={showEditBudgetDialog} onOpenChange={setShowEditBudgetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Presupuesto</DialogTitle>
            <DialogDescription>Modificar presupuesto de {selectedArea}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="budget-year">Año</Label>
              <Input
                id="budget-year"
                type="number"
                value={editBudgetYear}
                onChange={(e) => setEditBudgetYear(e.target.value)}
                min="2020"
                max="2100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget-value">Presupuesto Anual (COP)</Label>
              <Input
                id="budget-value"
                type="number"
                value={editBudgetValue}
                onChange={(e) => setEditBudgetValue(e.target.value)}
                placeholder="0"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditBudgetDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditBudget}>Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
