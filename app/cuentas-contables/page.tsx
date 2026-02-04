"use client"

import { CrearCuentaContableModal } from "@/components/cuentas-contables/crear-cuenta-contable-modal"
import { GestionarConceptos } from "@/components/cuentas-contables/gestionar-conceptos"
import { ListaCuentasContables } from "@/components/cuentas-contables/lista-cuentas-contables"
import Navbar from "@/components/Navbar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useConceptos from "@/hooks/useConceptos"
import useCuentasContables from "@/hooks/useCuentasContables"
import { BookOpen, Tags, Layers } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export default function CuentasContablesPage() {
  const {
    fetchCuentasConConceptos,
    cuentasContablesTotales,
    loading: loadingCuentasContables,
    fetchTiposCuentas,
    tiposCuentas,
    fetchCreateCuentaContable,
    fetchCreateProducto,
  } = useCuentasContables()
  const { fetchCreateConcepto, fetchArticulosPorCuenta, articulosPorCuenta, loadingConceptos } = useConceptos()
  const [showCreateCuentaContableModal, setShowCreateCuentaContableModal] = useState(false)

  const getData = useCallback(async () => {
    await fetchCuentasConConceptos()
    await fetchTiposCuentas()
  }, [fetchCuentasConConceptos, fetchTiposCuentas])


  useEffect(() => {
    getData()
  }, [getData])

  if (loadingCuentasContables && !cuentasContablesTotales?.length) {
    return (
      <section>
        <Navbar
          title="Cuentas contables, conceptos y productos"
          subTitle="Gestión jerárquica de cuentas, conceptos y productos"
          Icon={Tags}
        />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section>
      <Navbar
        title="Cuentas contables, conceptos y productos"
        subTitle="Gestión jerárquica de cuentas, conceptos y productos"
        Icon={Tags}
        actionButtonText="Nueva cuenta contable"
        actionModal={{
          modalTitle: "Nueva cuenta contable",
          modalDescription: "Registre una nueva cuenta contable.",
          isOpen: showCreateCuentaContableModal,
          onOpenChange: setShowCreateCuentaContableModal,
          modalContent: (
            <CrearCuentaContableModal
              tiposCuentas={tiposCuentas}
              createCuentaContable={fetchCreateCuentaContable}
              closeModal={() => setShowCreateCuentaContableModal(false)}
            />
          ),
        }}
      />
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="cuentas" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="cuentas" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Cuentas contables
            </TabsTrigger>
            <TabsTrigger value="conceptos" className="gap-2">
              <Layers className="h-4 w-4" />
              Conceptos y productos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cuentas" className="mt-0">
            <ListaCuentasContables
              cuentas={cuentasContablesTotales}
              loading={loadingCuentasContables}
            />
          </TabsContent>
          <TabsContent value="conceptos" className="mt-0">
            <GestionarConceptos
              cuentasContablesTotales={cuentasContablesTotales}
              createConcepto={fetchCreateConcepto}
              loadingArticulos={loadingConceptos}
              articulosPorCuenta={articulosPorCuenta}
              fetchArticulosPorCuenta={fetchArticulosPorCuenta}
              createProducto={fetchCreateProducto}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}