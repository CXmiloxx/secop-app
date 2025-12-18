"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { cuentasContables as defaultCuentasContables } from "@/lib/data"

export function GestionarConceptos() {
  const [cuentasContables, setCuentasContables] = useState(defaultCuentasContables)
  const [selectedCuenta, setSelectedCuenta] = useState<string>("")
  const [nuevoConcepto, setNuevoConcepto] = useState("")
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    const storedCuentas = localStorage.getItem("cuentasContables")
    if (storedCuentas) {
      setCuentasContables(JSON.parse(storedCuentas))
    }
  }, [])

  const handleAgregarConcepto = () => {
    if (!selectedCuenta || !nuevoConcepto.trim()) {
      setMensaje("Por favor seleccione una cuenta e ingrese un concepto")
      return
    }

    const updatedCuentas = cuentasContables.map((cuenta) => {
      if (cuenta.codigo === selectedCuenta) {
        if (cuenta.conceptos.includes(nuevoConcepto.trim())) {
          setMensaje("Este concepto ya existe en la cuenta seleccionada")
          return cuenta
        }
        return {
          ...cuenta,
          conceptos: [...cuenta.conceptos, nuevoConcepto.trim()],
        }
      }
      return cuenta
    })

    setCuentasContables(updatedCuentas)
    localStorage.setItem("cuentasContables", JSON.stringify(updatedCuentas))
    setNuevoConcepto("")
    setMensaje("Concepto agregado exitosamente")

    setTimeout(() => setMensaje(""), 3000)
  }

  const handleEliminarConcepto = (codigoCuenta: string, concepto: string) => {
    const updatedCuentas = cuentasContables.map((cuenta) => {
      if (cuenta.codigo === codigoCuenta) {
        return {
          ...cuenta,
          conceptos: cuenta.conceptos.filter((c) => c !== concepto),
        }
      }
      return cuenta
    })

    setCuentasContables(updatedCuentas)
    localStorage.setItem("cuentasContables", JSON.stringify(updatedCuentas))
    setMensaje("Concepto eliminado exitosamente")

    setTimeout(() => setMensaje(""), 3000)
  }

  const cuentaActual = cuentasContables.find((c) => c.codigo === selectedCuenta)

  return (
    <div className="space-y-6 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestionar Conceptos de Cuentas Contables</CardTitle>
          <CardDescription>Agregue o elimine conceptos personalizados para cada cuenta contable</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mensaje && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-md text-sm">{mensaje}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cuenta">Seleccione Cuenta Contable</Label>
              <Select value={selectedCuenta} onValueChange={setSelectedCuenta}>
                <SelectTrigger id="cuenta">
                  <SelectValue placeholder="Seleccione una cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {cuentasContables.map((cuenta) => (
                    <SelectItem key={cuenta.codigo} value={cuenta.codigo}>
                      {cuenta.codigo} - {cuenta.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCuenta && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="concepto">Nuevo Concepto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="concepto"
                      value={nuevoConcepto}
                      onChange={(e) => setNuevoConcepto(e.target.value)}
                      placeholder="Ej: Hojas de colores, Tinta negra, etc."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAgregarConcepto()
                        }
                      }}
                    />
                    <Button onClick={handleAgregarConcepto} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Conceptos Actuales ({cuentaActual?.conceptos.length || 0})</Label>
                  </div>

                  <div className="border rounded-lg divide-y max-h-80 overflow-y-auto">
                    {cuentaActual?.conceptos.map((concepto, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50">
                        <span className="text-sm">{concepto}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEliminarConcepto(selectedCuenta, concepto)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Todas las Cuentas</CardTitle>
          <CardDescription>Vista general de conceptos por cuenta contable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cuentasContables.map((cuenta) => (
              <div key={cuenta.codigo} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">
                  {cuenta.codigo} - {cuenta.nombre}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cuenta.conceptos.map((concepto, index) => (
                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded-md">
                      {concepto}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Total: {cuenta.conceptos.length} conceptos</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
