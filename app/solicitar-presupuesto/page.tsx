"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/store/auth.store"
import useCuentasContables from "@/hooks/useCuentasContables"
import useConceptos from "@/hooks/useConceptos"
import { useForm } from "react-hook-form"
import { RegisterSolicitudPresupuestoSchema, registerSolicitudPresupuestoSchema } from "@/schema/solicitar-presupuesto.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import useSolicitudPresupuesto from "@/hooks/useSolicitudPresupuesto"
import { ArticuloPresupuestoLocal } from "@/types/articulos-presupuesto.types"
import { ConceptosType } from "@/types/conceptos.types"
import useProductos from "@/hooks/useProductos"
import { CuentasContablesType } from "@/types/cuentas-contables.types"
import { ProductosType } from "@/types/productos.types"

export default function SolicitarPresupuestoPage() {
  // Formulario principal
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSolicitudPresupuestoSchema>({
    resolver: zodResolver(registerSolicitudPresupuestoSchema),
    defaultValues: {
      anio: new Date().getFullYear().toString(),
      justificacion: "",
      valor_solicitado: 0,
      articulos_presupuestos: [],
    },
  });

  const [articulos, setArticulos] = useState<ArticuloPresupuestoLocal[]>([]);

  // Estados para los selects de artículos
  const [cuentaId, setCuentaId] = useState<number | null>(null);
  const [conceptoId, setConceptoId] = useState<number | null>(null);
  const [productoId, setProductoId] = useState<number | null>(null);

  const [cantidad, setCantidad] = useState("");
  const [valorEstimado, setValorEstimado] = useState("");
  const [errorArticulo, setErrorArticulo] = useState("");

  const { user } = useAuthStore();
  const { fetchCuentasContables, cuentasContables } = useCuentasContables();
  const { conceptos, fetchCoceptos } = useConceptos();
  const { productos, fetchProductos } = useProductos();
  const { error: erroSPresupuesto, loading: loadingSPresupuesto, createSolicitud } = useSolicitudPresupuesto();

  // Setea el id_area al usuario cuando esté disponible
  useEffect(() => {
    if (user?.area?.id) {
      setValue("id_area", user.area.id);
    }
  }, [user, setValue]);

  // Traer cuentas contables al cargar la página
  useEffect(() => {
    fetchCuentasContables();
  }, [fetchCuentasContables]);

  // Traer conceptos al seleccionar cuenta contable
  useEffect(() => {
    if (cuentaId) {
      fetchCoceptos(cuentaId);
    }
  }, [cuentaId, fetchCoceptos]);

  // Traer productos al seleccionar concepto
  useEffect(() => {
    if (conceptoId) {
      fetchProductos(conceptoId);
    }
  }, [conceptoId, fetchProductos]);

  // Calcular total y asignar articulos seleccionados al form principal
  useEffect(() => {
    setValue(
      "valor_solicitado",
      articulos.reduce((acc, art) => acc + art.valor_estimado, 0)
    );
    setValue(
      "articulos_presupuestos",
      articulos.map((a) => ({
        id_cuenta_contable: a.id_cuenta_contable,
        id_concepto_contable: a.id_concepto,
        cantidad: a.cantidad,
        valor_unitario: a.valor_estimado,
        id_producto_contable: a.id_producto_contable
      }))
    );
  }, [articulos, setValue]);

  // Agregar un artículo al array con validación: solo un producto por concepto
  const handleAgregarArticulo = () => {
    setErrorArticulo("");
    if (!cuentaId || !conceptoId || !productoId || !cantidad || !valorEstimado) {
      setErrorArticulo("Complete todos los campos del artículo");
      setTimeout(() => setErrorArticulo(""), 3000);
      return;
    }

    // Validacion para que solo se permita un producto por concepto
    const productoExists = articulos.some(
      (a) => a.id_concepto === conceptoId && a.id_producto_contable === productoId
    );
    if (productoExists) {
      setErrorArticulo("Ya ha agregado este producto para el mismo concepto. Solo se permite un producto por concepto.");
      setTimeout(() => setErrorArticulo(""), 4000);
      return;
    }

    const numCantidad = Number(cantidad);
    const numValor = Number(valorEstimado.replace(/\D/g, ""));
    if (numCantidad <= 0 || isNaN(numCantidad)) {
      setErrorArticulo("La cantidad debe ser mayor a 0");
      setTimeout(() => setErrorArticulo(""), 3000);
      return;
    }
    if (numValor <= 0 || isNaN(numValor)) {
      setErrorArticulo("El valor estimado debe ser mayor a 0");
      setTimeout(() => setErrorArticulo(""), 3000);
      return;
    }
    // Nombres para mostrar en tabla (obtenidos por id)
    const cuentaObj = cuentasContables?.find((c: CuentasContablesType) => c.id === cuentaId);
    const conceptoObj = conceptos?.find((c: ConceptosType) => c.id === conceptoId);
    const productoObj = productos?.find((p: ProductosType) => p.id === productoId);

    const nuevoArticulo: ArticuloPresupuestoLocal = {
      id_cuenta_contable: cuentaId,
      id_concepto: conceptoId,
      id_producto_contable: productoId,
      cantidad: numCantidad,
      valor_estimado: numValor,
      cuenta_nombre: cuentaObj ? cuentaObj.nombre : "",
      concepto_nombre: conceptoObj ? conceptoObj.nombre : "",
      producto_nombre: productoObj ? productoObj.nombre : ""
    };

    setArticulos((prev) => [...prev, nuevoArticulo]);
    // Reset campos de item
    setCuentaId(null);
    setConceptoId(null);
    setProductoId(null);
    setCantidad("");
    setValorEstimado("");
  };

  // Eliminar un artículo por id_producto_contable
  const handleEliminarArticulo = (idProducto: number) => {
    setArticulos(articulos.filter((a) => a.id_producto_contable !== idProducto));
  };

  // calcula el total sumando el valor estmado de cada articulo
  const calcularTotal = () => {
    const sum = articulos.reduce((total, a) => total + a.valor_estimado, 0);
    return isNaN(sum) ? 0 : sum;
  };

  // Envío del formulario principal
  const onSubmit = async (data: RegisterSolicitudPresupuestoSchema) => {
    if (articulos.length === 0) {
      setErrorArticulo("Debe agregar al menos un artículo");
      return;
    }
    if (!user?.area?.id) {
      return;
    }
    try {
      await createSolicitud({
        ...data,
        id_area: user.area.id,
        articulos_presupuestos: articulos.map((a) => ({
          id_cuenta_contable: a.id_cuenta_contable,
          id_concepto_contable: a.id_concepto,
          id_producto_contable: a.id_producto_contable,
          cantidad: a.cantidad,
          valor_unitario: a.valor_estimado,
        })),
        valor_solicitado: calcularTotal(),
      });
      // Limpiar todo tras submit
      setArticulos([]);
      setValue("justificacion", "");
      setValue("anio", new Date().getFullYear().toString());
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
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
                  <Label htmlFor="anio">Período (Año) *</Label>
                  <Input
                    id="anio"
                    type="number"
                    autoComplete="off"
                    {...register("anio", {
                      setValueAs: (value) => value.toString(),
                    })}
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 5}
                    className={errors.anio ? "border-red-500" : ""}
                  />
                  {errors.anio && (
                    <p className="text-sm text-red-600">{errors.anio.message}</p>
                  )}
                </div>
              </div>
              {errors.id_area && (
                <p className="text-sm text-red-600 mt-2">{errors.id_area.message}</p>
              )}
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
                      setProductoId(null);
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
                      setProductoId(null);
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
                      {conceptos.map((concepto: ConceptosType) => (
                        <SelectItem className="truncate" key={concepto.id} value={concepto.id.toString()}>
                          {concepto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-1">
                  <Label>Producto *</Label>
                  <Select
                    value={productoId?.toString() || ""}
                    onValueChange={(value) => setProductoId(Number(value))}
                    disabled={!conceptoId}
                  >
                    <SelectTrigger
                      className={`${selectFieldClass} ${errorArticulo && !productoId ? "border-red-500" : ""}`}
                      disabled={!conceptoId}
                    >
                      <SelectValue
                        placeholder={conceptoId ? "Seleccione..." : "Seleccione concepto primero"}
                        className="truncate"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto) => (
                        <SelectItem className="truncate" key={producto.id} value={producto.id.toString()}>
                          {producto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-1">
                  <Label>Cantidad *</Label>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    placeholder="0"
                    className={`${inputFieldClass} ${errorArticulo && !cantidad ? "border-red-500" : ""}`}
                  />
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

              {errors.articulos_presupuestos && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                  {errors.articulos_presupuestos.message}
                </div>
              )}

              {articulos.length > 0 && (
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full min-w-[850px]">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium min-w-[180px]">Cuenta</th>
                        <th className="text-left p-3 text-sm font-medium min-w-[180px]">Concepto</th>
                        <th className="text-left p-3 text-sm font-medium min-w-[180px]">Producto</th>
                        <th className="text-right p-3 text-sm font-medium min-w-[90px]">Cantidad</th>
                        <th className="text-right p-3 text-sm font-medium min-w-[110px]">Valor Total</th>
                        <th className="text-right p-3 text-sm font-medium min-w-[110px]">Total</th>
                        <th className="w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {articulos.map((art) => (
                        <tr key={art.id_producto_contable} className="border-t">
                          <td className="p-3 text-sm max-w-[240px] truncate">{art.cuenta_nombre}</td>
                          <td className="p-3 text-sm max-w-[240px] truncate">{art.concepto_nombre}</td>
                          <td className="p-3 text-sm max-w-[240px] truncate">{art.producto_nombre || "-"}</td>
                          <td className="p-3 text-sm text-right">{art.cantidad}</td>
                          <td className="p-3 text-sm text-right">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            }).format(art.valor_estimado)}
                          </td>
                          <td className="p-3 text-sm text-right font-semibold">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            }).format(art.valor_estimado)}
                          </td>
                          <td className="p-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEliminarArticulo(art.id_producto_contable)}
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

          {errors.valor_solicitado && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {errors.valor_solicitado.message}
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
