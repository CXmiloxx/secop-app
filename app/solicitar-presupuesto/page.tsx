"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAuth from '@/hooks/useAuth'
import useCuentasContables from "@/hooks/useCuentasContables"
import useConceptos from "@/hooks/useConceptos"
import { useForm } from "react-hook-form"
import { RegisterSolicitudPresupuestoSchema, registerSolicitudPresupuestoSchema } from "@/schema/solicitar-presupuesto.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import useSolicitudPresupuesto from "@/hooks/useSolicitudPresupuesto"
import { ArticuloPresupuestoLocal } from "@/types/articulos-presupuesto.types"
import { ConceptosType } from "@/types/conceptos.types"
import { CuentasContablesType } from "@/types/cuentas-contables.types"

export default function SolicitarPresupuestoPage() {
  const [articulos, setArticulos] = useState<ArticuloPresupuestoLocal[]>([]);

  // Estados para los selects de artículos
  const [cuentaId, setCuentaId] = useState<number | null>(null);
  const [conceptoId, setConceptoId] = useState<number | null>(null);

  const [valorEstimado, setValorEstimado] = useState("");
  const [errorArticulo, setErrorArticulo] = useState("");

  const { user } = useAuth();
  const { fetchCuentasContables, cuentasContables } = useCuentasContables();
  const { conceptos, fetchConceptos, errorConceptos, loadingConceptos } = useConceptos();
  const { error: erroSPresupuesto, loading: loadingSPresupuesto, createSolicitud } = useSolicitudPresupuesto();

  // Formulario principal
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSolicitudPresupuestoSchema>({
    resolver: zodResolver(registerSolicitudPresupuestoSchema),
    defaultValues: {
      periodo: new Date().getFullYear(),
      justificacion: "",
      montoSolicitado: 0,
      articulos: [],
    }
  });

  // Setea el areaId y usuarioSolicitanteId al usuario cuando esté disponible
  useEffect(() => {
    if (user?.area?.id) {
      setValue("areaId", user.area.id);
    }
    if (user?.id) {
      setValue("usuarioSolicitanteId", user.id);
    }
  }, [user, setValue]);

  // Traer cuentas contables al cargar la página
  useEffect(() => {
    fetchCuentasContables();
  }, [fetchCuentasContables]);

  // Traer conceptos al seleccionar cuenta contable
  useEffect(() => {
    if (cuentaId) {
      fetchConceptos(cuentaId);
    }
  }, [cuentaId, fetchConceptos]);


  // Calcular total y asignar articulos seleccionados al form principal
  useEffect(() => {
    setValue(
      "montoSolicitado",
      articulos.reduce((acc, art) => acc + art.valorEstimado, 0)
    );
    setValue(
      "articulos",
      articulos.map((a) => ({
        cuentaContableId: a.cuentaContableId,
        conceptoContableId: a.conceptoContableId,
        valorEstimado: a.valorEstimado
      }))
    );
  }, [articulos, setValue]);

  // Agregar un artículo al array con validación: solo un producto por concepto
  const handleAgregarArticulo = () => {
    setErrorArticulo("");
    if (!cuentaId || !conceptoId || !valorEstimado) {
      setErrorArticulo("Complete todos los campos del artículo");
      setTimeout(() => setErrorArticulo(""), 3000);
      return;
    }

    // Validar que no se agregue un artículo duplicado (por cuenta y concepto)
    const yaExiste = articulos.some(
      (a) => a.cuentaContableId === cuentaId && a.conceptoContableId === conceptoId
    );
    if (yaExiste) {
      setErrorArticulo("Ya existe un artículo con este concepto para la cuenta seleccionada");
      setTimeout(() => setErrorArticulo(""), 3000);
      return;
    }

    const numValor = Number(valorEstimado.replace(/\D/g, ""));
    if (numValor <= 0 || isNaN(numValor)) {
      setErrorArticulo("El valor estimado debe ser mayor a 0");
      setTimeout(() => setErrorArticulo(""), 3000);
      return;
    }
    // Nombres para mostrar en tabla (obtenidos por id)
    const cuentaObj = cuentasContables?.find((c: CuentasContablesType) => c.id === cuentaId);
    const conceptoObj = conceptos?.find((c: ConceptosType) => c.id === conceptoId);

    const nuevoArticulo: ArticuloPresupuestoLocal = {
      cuentaContableId: cuentaId,
      conceptoContableId: conceptoId,
      valorEstimado: numValor,
      cuentaNombre: cuentaObj ? cuentaObj.nombre : "",
      conceptoNombre: conceptoObj ? conceptoObj.nombre : "",
    };

    setArticulos((prev) => [...prev, nuevoArticulo]);
    // Reset campos de item
    setCuentaId(null);
    setConceptoId(null);
    setValorEstimado("");
  };

  // Eliminar un artículo por indices correctos (cuenta y concepto combinados)
  const handleEliminarArticulo = (cuentaIdToRemove: number, conceptoIdToRemove: number) => {
    setArticulos((prev) =>
      prev.filter(
        (a) =>
          !(a.cuentaContableId === cuentaIdToRemove && a.conceptoContableId === conceptoIdToRemove)
      )
    );
  };

  // calcula el total sumando el valor estmado de cada articulo
  const calcularTotal = () => {
    const sum = articulos.reduce((total, a) => total + a.valorEstimado, 0);
    return isNaN(sum) ? 0 : sum;
  };

  // Envío del formulario principal
  const onSubmit = async (data: RegisterSolicitudPresupuestoSchema) => {
    if (articulos.length === 0) {
      setErrorArticulo("Debe agregar al menos un artículo");
      return;
    }
    if (!user?.area?.id) {
      setErrorArticulo("No se pudo obtener el área del usuario");
      return;
    }
    if (!user?.id) {
      setErrorArticulo("No se pudo obtener el ID del usuario");
      return;
    }

    try {
      const solicitudData = {
        ...data,
        areaId: user.area.id,
        usuarioSolicitanteId: user.id,
        articulos: articulos.map((a) => ({
          cuentaContableId: a.cuentaContableId,
          conceptoContableId: a.conceptoContableId,
          valorEstimado: a.valorEstimado,
        })),
        montoSolicitado: calcularTotal(),
      };


      await createSolicitud(solicitudData);

      // Limpiar todo tras submit exitoso
      setArticulos([]);
      setValue("justificacion", "");
      setValue("periodo", new Date().getFullYear());
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      setErrorArticulo("Error al enviar la solicitud. Por favor, intente nuevamente.");
    }
  };

  const selectFieldClass =
    "min-w-[230px] max-w-full w-full";
  const inputFieldClass =
    "min-w-[120px] max-w-full w-full";

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Solicitar Presupuesto</h1>
              <p className="text-muted-foreground">
                Realice una solicitud de presupuesto para su área
              </p>
            </div>
          </div>
        </div>

        {erroSPresupuesto && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
            {erroSPresupuesto}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Datos del solicitante y período</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Área</Label>
                  <Input
                    value={user?.area?.nombre || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Solicitante</Label>
                  <Input
                    value={user ? `${user.nombre} ${user.apellido}` : "Usuario no encontrado"}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodo">Período (Año) *</Label>
                  <Input
                    id="periodo"
                    type="number"
                    autoComplete="off"
                    {...register("periodo", {
                      setValueAs: (value) => Number(value),
                    })}
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 5}
                    className={errors.periodo ? "border-red-500" : ""}
                  />
                  {errors.periodo && (
                    <p className="text-sm text-red-600">{errors.periodo.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Artículos Solicitados</CardTitle>
              <CardDescription>
                Agregue los artículos que necesita para su área
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2 col-span-1">
                  <Label>Cuenta Contable *</Label>
                  <Select
                    value={cuentaId?.toString() || ""}
                    onValueChange={(value) => {
                      setCuentaId(Number(value));
                      setConceptoId(null);
                    }}
                  >
                    <SelectTrigger className={`${selectFieldClass} ${errorArticulo && !cuentaId ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Seleccione..." className="truncate" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuentasContables?.map((cuenta) => (
                        <SelectItem className="truncate" key={cuenta.id} value={cuenta.id.toString()}>
                          {cuenta.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-1">
                  <Label>Concepto *</Label>
                  <Select
                    value={conceptoId?.toString() || ""}
                    onValueChange={(value) => {
                      setConceptoId(Number(value));
                    }}
                    disabled={!cuentaId}
                  >
                    <SelectTrigger
                      className={`${selectFieldClass} ${errorArticulo && !conceptoId ? "border-red-500" : ""}`}
                      disabled={!cuentaId}
                    >
                      <SelectValue
                        placeholder={cuentaId ? "Seleccione..." : "Seleccione cuenta primero"}
                        className="truncate"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {errorConceptos ? (
                        <SelectItem disabled className="truncate" value="error" key="error">
                          <span className="text-muted-foreground">{errorConceptos}</span>
                        </SelectItem>
                      ) : conceptos.length === 0 ? (
                        <SelectItem disabled className="truncate" value="no-conceptos" key="no-conceptos">
                          <span className="text-muted-foreground">No hay conceptos disponibles</span>
                        </SelectItem>
                      ) : (
                        conceptos.map((concepto: ConceptosType) => (
                          <SelectItem className="truncate" key={concepto.id} value={concepto.id.toString()}>
                            {concepto.nombre}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-1">
                  <Label>Valor Estimado (Total) *</Label>
                  <Input
                    type="text"
                    value={valorEstimado}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, "");
                      setValorEstimado(clean);
                    }}
                    placeholder="0"
                    className={`${inputFieldClass} ${errorArticulo && !valorEstimado ? "border-red-500" : ""}`}
                  />
                </div>

                <div className="flex items-end col-span-1">
                  <Button type="button" onClick={handleAgregarArticulo} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>

              {errorArticulo && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                  {errorArticulo}
                </div>
              )}

              {errors.articulos && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                  {errors.articulos.message}
                </div>
              )}

              {articulos.length > 0 && (
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full min-w-[850px]">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium min-w-[180px]">Cuenta</th>
                        <th className="text-left p-3 text-sm font-medium min-w-[180px]">Concepto</th>
                        <th className="text-right p-3 text-sm font-medium min-w-[110px]">Valor Total</th>
                        <th className="text-right p-3 text-sm font-medium min-w-[110px]">Total</th>
                        <th className="text-right p-3 text-sm font-medium min-w-[110px]">Acciones</th>
                        <th className="w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {articulos.map((art) => (
                        <tr
                          key={`${art.cuentaContableId}-${art.conceptoContableId}`}
                          className="border-t"
                        >
                          <td className="p-3 text-sm max-w-[240px] truncate">{art.cuentaNombre}</td>
                          <td className="p-3 text-sm max-w-[240px] truncate">{art.conceptoNombre}</td>
                          <td className="p-3 text-sm text-right">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            }).format(art.valorEstimado)}
                          </td>
                          <td className="p-3 text-sm text-right font-semibold">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            }).format(art.valorEstimado)}
                          </td>
                          <td className="p-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleEliminarArticulo(art.cuentaContableId, art.conceptoContableId)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t bg-muted/50">
                        <td colSpan={5} className="p-3 text-sm font-semibold text-right">
                          Total Solicitado:
                        </td>
                        <td className="p-3 text-sm font-bold text-right">
                          {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                          }).format(calcularTotal())}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Justificación</CardTitle>
              <CardDescription>
                Explique la necesidad del presupuesto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="justificacion"
                {...register("justificacion")}
                placeholder="Explique por qué necesita este presupuesto y cómo será utilizado..."
                rows={6}
                className={errors.justificacion ? "border-red-500" : ""}
              />
              {errors.justificacion && (
                <p className="text-sm text-red-600 mt-2">{errors.justificacion.message}</p>
              )}
            </CardContent>
          </Card>

          {errors.montoSolicitado && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {errors.montoSolicitado.message}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={articulos.length === 0 || isSubmitting || loadingSPresupuesto}
            >
              {isSubmitting || loadingSPresupuesto ? "Enviando..." : "Enviar Solicitud"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
