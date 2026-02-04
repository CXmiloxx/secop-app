"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { obtenerActividadesConsultor, type ActividadConsultor } from "@/lib/data"
import { Activity, CheckCircle, XCircle, Edit, Star, FileText, Search, ArrowLeft } from "lucide-react"

export default function SupervisionConsultorPage() {
  const router = useRouter()
  const [actividades, setActividades] = useState<ActividadConsultor[]>([])
  const [filteredActividades, setFilteredActividades] = useState<ActividadConsultor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos")



  const loadActividades = () => {
    const acts = obtenerActividadesConsultor()
    setActividades(acts)
    setFilteredActividades(acts)
  }

  useEffect(() => {
    let filtered = actividades

    if (tipoFiltro !== "todos") {
      filtered = filtered.filter((act) => act.tipo === tipoFiltro)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (act) =>
          act.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          act.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredActividades(filtered)
  }, [searchTerm, tipoFiltro, actividades])

  const getIconByType = (tipo: string) => {
    switch (tipo) {
      case "Aprobación Requisición":
      case "Aprobación Partida":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "Rechazo Requisición":
      case "Rechazo Partida":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "Edición":
        return <Edit className="h-5 w-5 text-blue-600" />
      case "Calificación Proveedor":
        return <Star className="h-5 w-5 text-yellow-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "Aprobación Requisición":
      case "Aprobación Partida":
        return "default"
      case "Rechazo Requisición":
      case "Rechazo Partida":
        return "destructive"
      case "Edición":
        return "secondary"
      case "Calificación Proveedor":
        return "outline"
      default:
        return "secondary"
    }
  }

  const totalActividades = actividades.length
  const aprobaciones = actividades.filter((a) => a.tipo.includes("Aprobación")).length
  const rechazos = actividades.filter((a) => a.tipo.includes("Rechazo")).length
  const ediciones = actividades.filter((a) => a.tipo === "Edición").length

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
              </div>
              <h1 className="text-2xl font-bold">Supervisión del Consultor</h1>
              <p className="text-sm text-muted-foreground">
                Monitoreo de todas las actividades realizadas por el consultor
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Actividades</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActividades}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobaciones</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aprobaciones}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazos</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rechazos}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ediciones</CardTitle>
              <Edit className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ediciones}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Actividades</CardTitle>
            <CardDescription>Registro detallado de todas las acciones del consultor</CardDescription>
            <div className="flex gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar actividades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="Aprobación Requisición">Aprobación Requisición</SelectItem>
                  <SelectItem value="Rechazo Requisición">Rechazo Requisición</SelectItem>
                  <SelectItem value="Aprobación Partida">Aprobación Partida</SelectItem>
                  <SelectItem value="Rechazo Partida">Rechazo Partida</SelectItem>
                  <SelectItem value="Edición">Edición</SelectItem>
                  <SelectItem value="Calificación Proveedor">Calificación Proveedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredActividades.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No se encontraron actividades</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActividades.map((actividad) => (
                    <TableRow key={actividad.id}>
                      <TableCell className="text-sm">{new Date(actividad.fecha).toLocaleString("es-CO")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getIconByType(actividad.tipo)}
                          <Badge variant={getBadgeVariant(actividad.tipo)}>{actividad.tipo}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{actividad.descripcion}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            alert(JSON.stringify(actividad.detalles, null, 2))
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
