"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, X, CheckCircle2, AlertCircle } from "lucide-react"
import { agregarSoporte, type SoporteDocumento } from "@/lib/auditoria"

interface GestorSoportesProps {
  requisicionId: number
  usuario: string
  onSoporteAgregado?: (soporte: SoporteDocumento) => void
  descripcionRequerida?: boolean
}

export default function GestorSoportes({
  requisicionId,
  usuario,
  onSoporteAgregado,
  descripcionRequerida = false,
}: GestorSoportesProps) {
  const [archivo, setArchivo] = useState<File | null>(null)
  const [descripcion, setDescripcion] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [exito, setExito] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      const tiposPermitidos = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
      if (!tiposPermitidos.includes(file.type)) {
        setError("Solo se permiten archivos PDF, JPG o PNG")
        setArchivo(null)
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("El archivo no debe superar 5MB")
        setArchivo(null)
        return
      }

      setArchivo(file)
      setError("")
    }
  }

  const handleAgregarSoporte = async () => {
    if (!archivo) {
      setError("Debe seleccionar un archivo")
      return
    }

    if (descripcionRequerida && !descripcion.trim()) {
      setError("Debe agregar una descripción del documento")
      return
    }

    setCargando(true)
    setError("")

    try {
      // Convertir archivo a base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const archivoBase64 = reader.result as string
        const nuevoSoporte = agregarSoporte(requisicionId, archivo, archivoBase64, usuario, descripcion.trim())

        setExito(true)
        setArchivo(null)
        setDescripcion("")

        // Notificar al componente padre
        if (onSoporteAgregado) {
          onSoporteAgregado(nuevoSoporte)
        }

        // Resetear mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setExito(false)
          setCargando(false)
        }, 3000)
      }

      reader.onerror = () => {
        setError("Error al leer el archivo")
        setCargando(false)
      }

      reader.readAsDataURL(archivo)
    } catch (err) {
      setError("Error al procesar el archivo")
      setCargando(false)
    }
  }

  const limpiarArchivo = () => {
    setArchivo(null)
    setError("")
    setExito(false)
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          Adjuntar Soporte o Factura
        </CardTitle>
        <CardDescription>Agregue documentos de respaldo para esta requisición</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="archivo-soporte">
            Archivo (PDF, JPG o PNG - máximo 5MB) <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="archivo-soporte"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={cargando || exito}
              className="cursor-pointer"
            />
            {archivo && !exito && (
              <Button variant="ghost" size="icon" onClick={limpiarArchivo} disabled={cargando}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {archivo && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {archivo.name} ({(archivo.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion-soporte">
            Descripción del documento{descripcionRequerida && <span className="text-destructive"> *</span>}
          </Label>
          <Textarea
            id="descripcion-soporte"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Factura del proveedor, Cotización, Orden de compra..."
            rows={2}
            disabled={cargando || exito}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {exito && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            Soporte agregado exitosamente al historial
          </div>
        )}

        <Button onClick={handleAgregarSoporte} disabled={!archivo || cargando || exito} className="w-full">
          {cargando ? (
            <>Procesando...</>
          ) : exito ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Agregado
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Agregar Soporte
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          Los documentos agregados quedarán registrados en el historial de trazabilidad de la requisición.
        </p>
      </CardContent>
    </Card>
  )
}
