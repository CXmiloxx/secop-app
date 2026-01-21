import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { DollarSign, Upload, X, FileText, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { RequisicionType } from '@/types'
import { UserType } from '@/types/user.types'
import { formatCurrency } from '@/lib'
import { registerPagoSchema, RegisterPagoSchema } from '@/schema/pagos.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../ui/form'
import { useEffect, useState } from 'react'

interface AprobarPagoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requisicion: RequisicionType | null
  user: UserType
  createPagoTesoreria?: (data: RegisterPagoSchema) => Promise<boolean>
  createPagoCajaMenor?: (data: RegisterPagoSchema) => Promise<boolean>
  onClose?: () => void
  tipo: 'tesoreria' | 'caja menor'
}

export default function AprobarPago(
  {
    requisicion,
    user,
    createPagoTesoreria,
    createPagoCajaMenor,
    onClose,
    tipo,
    open,
    onOpenChange
  }: AprobarPagoProps) {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null)

  const form = useForm<RegisterPagoSchema>({
    resolver: zodResolver(registerPagoSchema),
    defaultValues: {
      requisicionId: requisicion?.id ? Number(requisicion.id) : 0,
      usuarioRegistradorId: user.id || "",
      total: requisicion?.valorDefinido ? Number(requisicion.valorDefinido) : 0,
      metodoPago: tipo,
      soporteFactura: undefined as any,
    }
  });

  useEffect(() => {
    if (requisicion && open) {
      form.reset({
        requisicionId: Number(requisicion.id),
        usuarioRegistradorId: user.id || "",
        total: requisicion.valorDefinido ? Number(requisicion.valorDefinido) : 0,
        metodoPago: tipo,
        soporteFactura: undefined as any,
      });
      setArchivoSeleccionado(null);
    }
  }, [requisicion, user.id, tipo, open, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivoSeleccionado(file);
      form.setValue("soporteFactura", file, { shouldValidate: true });
    }
  };

  const removeFile = () => {
    setArchivoSeleccionado(null);
    form.setValue("soporteFactura", undefined as any, { shouldValidate: false });
  };

  const onSubmit = async (data: RegisterPagoSchema) => {
    const success = tipo === 'tesoreria' ? await createPagoTesoreria?.(data) : await createPagoCajaMenor?.(data);
    if (success) {
      form.reset();
      setArchivoSeleccionado(null);
      onOpenChange(false);
      onClose?.();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    onClose?.();
  };

  if (!requisicion) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Procesar Pago - Requisición #{requisicion.id}</DialogTitle>
          <DialogDescription>Complete el formulario y adjunte el soporte de factura para procesar el pago</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumen de Requisición</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>
                  <strong>Área:</strong> {requisicion.area}
                </p>
                <p>
                  <strong>Proveedor:</strong> {requisicion.proveedor}
                </p>
                <p>
                  <strong>Concepto:</strong> {requisicion.concepto}
                </p>
                <p>
                  <strong>Valor Total:</strong> {formatCurrency(Number(requisicion.valorDefinido) || 0)}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={true}
                        {...field}
                        value={requisicion.valorDefinido ? Number(requisicion.valorDefinido) : 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="soporteFactura"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Soporte de Factura</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {!archivoSeleccionado ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileChange(e);
                                  onChange(file);
                                }
                              }}
                              className="hidden"
                              id="soporte-factura"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("soporte-factura")?.click()}
                              className="w-full"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Adjuntar Factura
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <div>
                                <p className="text-sm font-medium">{archivoSeleccionado.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(archivoSeleccionado.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Formatos aceptados: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX. Tamaño máximo: 5MB
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={form.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>Procesando...</>
                ) : (
                  <>
                    <DollarSign className="h-5 w-5 mr-2" />
                    Procesar Pago
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
