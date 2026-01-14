"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, UploadIcon, FileIcon, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { RequisicionType } from "@/types"
import { soportesCotizacionSchema, actualizarSoportesCotizacionSchema, type SoportesCotizacionSchema, type ActualizarSoportesCotizacionSchema } from "@/schema/requisicion.schema"
import { useEffect } from "react"

interface SubirCotizacionesProps {
  requisicion: RequisicionType
  adjuntarSoportesCotizaciones?: (requisicionId: number, soportes: SoportesCotizacionSchema) => Promise<boolean>
  onClose: () => void
  actualizarSoportesCotizaciones?: (requisicionId: number, soportes: ActualizarSoportesCotizacionSchema) => Promise<boolean>
  mode?: "adjuntar" | "actualizar"
}

// Estructura común para inputs de cotización
const CotizacionFileInput = ({
  label,
  required,
  value,
  field,
  onChange,
  onRemove,
  error,
  isSubmitting,
  formatosPermitidos,
  formatFileSize
}: {
  label: string
  required?: boolean
  value?: File | undefined
  field: "cotizacion1" | "cotizacion2" | "cotizacion3"
  onChange: (field: "cotizacion1" | "cotizacion2" | "cotizacion3", e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: (field: "cotizacion1" | "cotizacion2" | "cotizacion3") => void
  error?: { message?: string }
  isSubmitting: boolean
  formatosPermitidos: string
  formatFileSize: (n: number) => string
}) => (
  <div className="space-y-2">
    <Label htmlFor={field} className="flex items-center gap-2">
      {label} {required && <span className="text-destructive">*</span>}
      {value instanceof File && (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      )}
    </Label>
    <Input
      id={field}
      type="file"
      accept={formatosPermitidos}
      onChange={e => onChange(field, e)}
      className="cursor-pointer"
      disabled={isSubmitting}
    />
    {value instanceof File && (
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FileIcon className="h-4 w-4 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(value.size)}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(field)}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )}
    {error && (
      <p className="text-sm text-destructive">{error.message}</p>
    )}
  </div>
)

export function Cotizaciones({
  requisicion,
  adjuntarSoportesCotizaciones,
  onClose,
  actualizarSoportesCotizaciones,
  mode = "adjuntar",
}: SubirCotizacionesProps) {
  const formSchema = mode === "actualizar" ? actualizarSoportesCotizacionSchema : soportesCotizacionSchema;

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SoportesCotizacionSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cotizacion1: undefined,
      cotizacion2: undefined,
      cotizacion3: undefined,
    },
  })

  const cotizacion1 = watch("cotizacion1")
  const cotizacion2 = watch("cotizacion2")
  const cotizacion3 = watch("cotizacion3")

  const handleAction = async (data: SoportesCotizacionSchema) => {
    try {
      let success = false
      if (mode === "actualizar" && typeof actualizarSoportesCotizaciones === "function") {
        success = await actualizarSoportesCotizaciones(Number(requisicion.id), data as ActualizarSoportesCotizacionSchema)
      } else {
        success = await adjuntarSoportesCotizaciones?.(Number(requisicion.id), data) ?? false
      }

      if (success) {
        reset()
        onClose()
      }
    } catch (error) {
      console.error(
        mode === "actualizar" ? "Error al actualizar cotizaciones:" : "Error al subir cotizaciones:", error
      )
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
  const formatosPermitidos = ".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" // string para "accept", no descripción

  return (
    <form onSubmit={handleSubmit(handleAction)} className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-semibold mb-2">{requisicion.concepto}</h4>
        <p className="text-sm text-muted-foreground">
          {requisicion.area} • {requisicion.solicitante}
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800">
          <strong>Importante:</strong> {mode === "actualizar"
            ? "Puedes actualizar entre 1 y 3 cotizaciones (la Cotización 1 es obligatoria)."
            : "Debe adjuntar entre 1 y 3 cotizaciones (la Cotización 1 es obligatoria)."
          }
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
      <CotizacionFileInput
        label="Cotización 1"
        required
        value={cotizacion1}
        field="cotizacion1"
        onChange={(field, e) => {
          const file = e.target.files?.[0]
          setValue(field, file ?? undefined, { shouldValidate: true })
          e.target.value = ""
        }}
        onRemove={f => setValue(f, undefined, { shouldValidate: true })}
        error={errors.cotizacion1}
        isSubmitting={isSubmitting}
        formatosPermitidos={formatosPermitidos}
        formatFileSize={formatFileSize}
      />

      {/* Cotización 2 */}
      <CotizacionFileInput
        label="Cotización 2"
        value={cotizacion2}
        field="cotizacion2"
        onChange={(field, e) => {
          const file = e.target.files?.[0]
          setValue(field, file ?? undefined, { shouldValidate: true })
          e.target.value = ""
        }}
        onRemove={f => setValue(f, undefined, { shouldValidate: true })}
        error={errors.cotizacion2}
        isSubmitting={isSubmitting}
        formatosPermitidos={formatosPermitidos}
        formatFileSize={formatFileSize}
      />

      {/* Cotización 3 */}
      <CotizacionFileInput
        label="Cotización 3"
        value={cotizacion3}
        field="cotizacion3"
        onChange={(field, e) => {
          const file = e.target.files?.[0]
          setValue(field, file ?? undefined, { shouldValidate: true })
          e.target.value = ""
        }}
        onRemove={f => setValue(f, undefined, { shouldValidate: true })}
        error={errors.cotizacion3}
        isSubmitting={isSubmitting}
        formatosPermitidos={formatosPermitidos}
        formatFileSize={formatFileSize}
      />

      <p className="text-xs text-muted-foreground">
        Formatos permitidos: JPG, PNG, PDF, DOC, DOCX, XLS, XLSX • Máximo 5MB por archivo
      </p>

      {allFilesValid && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Lista para {mode === "actualizar" ? 'actualizar' : 'subir'} {filesCount} {filesCount === 1 ? 'cotización' : 'cotizaciones'}
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
              {mode === 'actualizar' ? "Actualizando..." : "Subiendo..."}
            </>
          ) : (
            <>
              <UploadIcon className="mr-2 h-4 w-4" />
              {mode === "actualizar"
                ? (filesCount > 1 ? "Actualizar Cotizaciones" : "Actualizar Cotización")
                : (filesCount > 1 ? "Subir Cotizaciones" : "Subir Cotización")}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

