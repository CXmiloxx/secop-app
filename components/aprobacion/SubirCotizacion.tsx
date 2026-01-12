"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, UploadIcon, FileIcon, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { RequisicionType } from "@/types"
import { toast } from "sonner"
import { soportesCotizacionSchema, type SoportesCotizacionSchema } from "@/schema/requisicion.schema"
import { useEffect } from "react"

interface SubirCotizacionesProps {
  requisicion: RequisicionType
  adjuntarSoportesCotizaciones: (requisicionId: number, soportes: SoportesCotizacionSchema) => Promise<boolean>
  onClose: () => void
}

export function SubirCotizaciones({
  requisicion,
  adjuntarSoportesCotizaciones,
  onClose,
}: SubirCotizacionesProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SoportesCotizacionSchema>({
    resolver: zodResolver(soportesCotizacionSchema),
    defaultValues: {
      cotizacion1: undefined,
      cotizacion2: undefined,
      cotizacion3: undefined,
    },
  })

  const cotizacion1 = watch("cotizacion1")
  const cotizacion2 = watch("cotizacion2")
  const cotizacion3 = watch("cotizacion3")

  const handleFileChange = (field: "cotizacion1" | "cotizacion2" | "cotizacion3", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setValue(field, undefined, { shouldValidate: true })
      return
    }

    setValue(field, file, { shouldValidate: true })
    e.target.value = ""
  }

  const removeFile = (field: "cotizacion1" | "cotizacion2" | "cotizacion3") => {
    setValue(field, undefined, { shouldValidate: true })
  }

  const onSubmit = async (data: SoportesCotizacionSchema) => {
    try {
      const success = await adjuntarSoportesCotizaciones(Number(requisicion.id), data)
      if (success) {
        reset()
        onClose()
      }
    } catch (error) {
      console.error("Error al subir cotizaciones:", error)
    }
  }

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const filesCount = [cotizacion1, cotizacion2, cotizacion3].filter(f => f instanceof File).length
  const allFilesValid = !!cotizacion1

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-semibold mb-2">{requisicion.concepto}</h4>
        <p className="text-sm text-muted-foreground">
          {requisicion.area} • {requisicion.solicitante}
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800">
          <strong>Importante:</strong> Debe adjuntar entre 1 y 3 cotizaciones (la Cotización 1 es obligatoria).
        </AlertDescription>
      </Alert>

      {(errors.cotizacion1 || errors.cotizacion2 || errors.cotizacion3 || errors.root) && (
        <Alert variant="destructive">
          <AlertDescription>
            {errors.cotizacion1 && <p>{errors.cotizacion1.message}</p>}
            {errors.cotizacion2 && <p>{errors.cotizacion2.message}</p>}
            {errors.cotizacion3 && <p>{errors.cotizacion3.message}</p>}
            {errors.root && <p>{errors.root.message}</p>}
          </AlertDescription>
        </Alert>
      )}

      {/* Cotización 1 */}
      <div className="space-y-2">
        <Label htmlFor="cotizacion1" className="flex items-center gap-2">
          Cotización 1 <span className="text-destructive">*</span>
          {cotizacion1 instanceof File && <CheckCircle2 className="h-4 w-4 text-green-600" />}
        </Label>
        <Input
          id="cotizacion1"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileChange("cotizacion1", e)}
          className="cursor-pointer"
          disabled={isSubmitting}
        />
        {cotizacion1 instanceof File && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileIcon className="h-4 w-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{cotizacion1.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(cotizacion1.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeFile("cotizacion1")}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {errors.cotizacion1 && (
          <p className="text-sm text-destructive">{errors.cotizacion1.message}</p>
        )}
      </div>

      {/* Cotización 2 */}
      <div className="space-y-2">
        <Label htmlFor="cotizacion2" className="flex items-center gap-2">
          Cotización 2
          {cotizacion2 instanceof File && <CheckCircle2 className="h-4 w-4 text-green-600" />}
        </Label>
        <Input
          id="cotizacion2"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileChange("cotizacion2", e)}
          className="cursor-pointer"
          disabled={isSubmitting}
        />
        {cotizacion2 instanceof File && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileIcon className="h-4 w-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{cotizacion2.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(cotizacion2.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeFile("cotizacion2")}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {errors.cotizacion2 && (
          <p className="text-sm text-destructive">{errors.cotizacion2.message}</p>
        )}
      </div>

      {/* Cotización 3 */}
      <div className="space-y-2">
        <Label htmlFor="cotizacion3" className="flex items-center gap-2">
          Cotización 3
          {cotizacion3 instanceof File && <CheckCircle2 className="h-4 w-4 text-green-600" />}
        </Label>
        <Input
          id="cotizacion3"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileChange("cotizacion3", e)}
          className="cursor-pointer"
          disabled={isSubmitting}
        />
        {cotizacion3 instanceof File && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileIcon className="h-4 w-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{cotizacion3.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(cotizacion3.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeFile("cotizacion3")}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {errors.cotizacion3 && (
          <p className="text-sm text-destructive">{errors.cotizacion3.message}</p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Formatos permitidos: JPG, PNG, PDF • Máximo 5MB por archivo
      </p>

      {allFilesValid && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Lista para subir {filesCount} {filesCount === 1 ? 'cotización' : 'cotizaciones'}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !allFilesValid}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <UploadIcon className="mr-2 h-4 w-4" />
              {filesCount > 1 ? "Subir Cotizaciones" : "Subir Cotización"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

