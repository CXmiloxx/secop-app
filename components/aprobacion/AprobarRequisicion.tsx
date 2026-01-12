import { AprobarRequisicionSchema } from "@/schema/requisicion.schema"
import { RequisicionType } from "@/types"
import { UseFormReturn } from "react-hook-form"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Checkbox } from "../ui/checkbox"
import { Select, SelectTrigger } from "../ui/select"
import { SelectValue } from "../ui/select"
import { SelectContent } from "../ui/select"
import { SelectItem } from "../ui/select"
import { ProvidersType } from "@/types/provider.types"
import { DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/utils/formatCurrency"


interface AprobarRequisicionProps {
  requisicion: RequisicionType
  formAprobar: UseFormReturn<AprobarRequisicionSchema>
  handleAprobar: (data: AprobarRequisicionSchema) => void
  providers: ProvidersType[] | null
  setShowAprobarDialog: (show: boolean) => void
}
export default function AprobarRequisicion({ requisicion, formAprobar, handleAprobar, providers, setShowAprobarDialog }: AprobarRequisicionProps) {
  return (
    <form onSubmit={formAprobar.handleSubmit(handleAprobar)} className="space-y-4 py-4">
      <div className="space-y-2">
        <h3 className="font-semibold">{requisicion.concepto}</h3>
        <p className="text-sm text-muted-foreground">
          {requisicion.area} • {requisicion.solicitante}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Número de Comité (Generado automáticamente)</Label>
        <Input
          value={formAprobar.watch("numeroComite")}
          disabled
          className="bg-muted"
        />
      </div>

      <div className="space-y-2">
        <Label>A nombre de * (Selecciona uno o más)</Label>
        <div className="space-y-2 border rounded-md p-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rector"
              checked={formAprobar.watch("rector")}
              onCheckedChange={(checked) => formAprobar.setValue("rector", checked as boolean)}
            />
            <label
              htmlFor="rector"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Rector
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vicerrector"
              checked={formAprobar.watch("vicerrector")}
              onCheckedChange={(checked) => formAprobar.setValue("vicerrector", checked as boolean)}
            />
            <label
              htmlFor="vicerrector"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Vicerrector
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sindico"
              checked={formAprobar.watch("sindico")}
              onCheckedChange={(checked) => formAprobar.setValue("sindico", checked as boolean)}
            />
            <label
              htmlFor="sindico"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Síndico
            </label>
          </div>
        </div>
        {formAprobar.formState.errors.rector && (
          <p className="text-sm text-destructive">{formAprobar.formState.errors.rector.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="proveedor">Proveedor *</Label>
        <Select
          value={formAprobar.watch("proveedorId")?.toString() || ""}
          onValueChange={(value) => formAprobar.setValue("proveedorId", Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un proveedor" />
          </SelectTrigger>
          <SelectContent>
            {providers && providers.map((prov) => (
              <SelectItem key={prov.id} value={prov.id.toString()}>
                {prov.nombre} - {prov.tipoInsumo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formAprobar.formState.errors.proveedorId && (
          <p className="text-sm text-destructive">{formAprobar.formState.errors.proveedorId.message}</p>
        )}
      </div>

      <div className="space-y-3 border rounded-lg p-4 bg-muted/50">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="daGarantia"
            checked={formAprobar.watch("daGarantia")}
            onCheckedChange={(checked) => formAprobar.setValue("daGarantia", checked as boolean)}
          />
          <label
            htmlFor="daGarantia"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            El proveedor da garantía
          </label>
        </div>

        {formAprobar.watch("daGarantia") && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="space-y-2">
              <Label htmlFor="tiempoGarantia">Tiempo de Garantía *</Label>
              <Input
                id="tiempoGarantia"
                type="text"
                {...formAprobar.register("tiempoGarantia")}
                placeholder="Ej: 12"
              />
              {formAprobar.formState.errors.tiempoGarantia && (
                <p className="text-sm text-destructive">{formAprobar.formState.errors.tiempoGarantia.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidadGarantia">Unidad</Label>
              <Select
                value={formAprobar.watch("unidadGarantia") || "meses"}
                onValueChange={(value: 'días' | 'meses' | 'años') => formAprobar.setValue("unidadGarantia", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="días">Días</SelectItem>
                  <SelectItem value="meses">Meses</SelectItem>
                  <SelectItem value="años">Años</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valor">Valor *</Label>
          <Input
            id="valor"
            type="number"
            {...formAprobar.register("valorDefinido", { valueAsNumber: true })}
            placeholder="0"
            min="0"
            step="0.01"
          />
          {formAprobar.formState.errors.valorDefinido && (
            <p className="text-sm text-destructive">{formAprobar.formState.errors.valorDefinido.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="iva">IVA (Opcional)</Label>
          <Input
            id="iva"
            type="number"
            {...formAprobar.register("ivaDefinido", {
              valueAsNumber: true,
              setValueAs: (v) => v === "" || v === null || v === undefined || Number.isNaN(Number(v)) ? 0 : Number(v)
            })}
            placeholder="0"
            min="0"
            step="0.01"
          />
          {formAprobar.formState.errors.ivaDefinido && (
            <p className="text-sm text-destructive">{formAprobar.formState.errors.ivaDefinido.message}</p>
          )}
        </div>
      </div>

      <div className="bg-muted p-3 rounded-lg">
        <p className="text-sm font-semibold">
          Valor Total: {formatCurrency((formAprobar.watch("valorDefinido") || 0) + (formAprobar.watch("ivaDefinido") || 0))}
        </p>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAprobarDialog(false)}
          disabled={formAprobar.formState.isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={formAprobar.formState.isSubmitting}
        >
          {formAprobar.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aprobando...
            </>
          ) : (
            "Confirmar Aprobación"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
