"use client"

import { GestionarConceptos } from "@/components/admin/gestionar-conceptos"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useConceptos from "@/hooks/useConceptos"
import useCuentasContables from "@/hooks/useCuentasContables"
import { RegisterConceptosSchema } from "@/schema/conceptos.schema"
import { Tags } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export default function ConceptosPage() {
  const { fetchCuentasContablesTotales, cuentasContablesTotales } = useCuentasContables()
  const { fetchCreateConcepto, fetchDeleteConcepto } = useConceptos()
  const [showCreateCuentaContableModal, setShowCreateCuentaContableModal] = useState(false)
  const getData = useCallback(async () => {
    await fetchCuentasContablesTotales()
  }, [fetchCuentasContablesTotales])

  const createCuentaContable = useCallback(async (data: RegisterConceptosSchema) => {
    const response = await fetchCreateConcepto(data)
    if (response) {
      await getData()
      return true
    }
  }, [fetchCreateConcepto, getData])

  const deleteCuentaContable = useCallback(async (id: number) => {
    const response = await fetchDeleteConcepto(id)
    if (response) {
      await getData()
    }
    return true
  }, [fetchDeleteConcepto, getData])


  const handleShowCreateCuentaContableModal = () => {
    setShowCreateCuentaContableModal(true)
  }
  useEffect(() => {
    getData()
  }, [getData])
  return (
    <section>
      <Navbar
        title="Gestión de Conceptos"
        subTitle="Configure los conceptos disponibles para cada cuenta contable"
        Icon={Tags}
        actionButtonText="Crear Cuenta Contable"
        actionModal={{
          modalTitle: "Crear Cuenta Contable",
          modalDescription: "Ingrese los datos de la cuenta contable",
          isOpen: showCreateCuentaContableModal,
          onOpenChange: setShowCreateCuentaContableModal,
          modalContent: <CreateCuentaContableModal />
        }}
      />
      <div className="container mx-auto px-4 py-8">

        <GestionarConceptos
         cuentasContablesTotales={cuentasContablesTotales} 
         createCuentaContable={createCuentaContable}
         deleteCuentaContable={deleteCuentaContable}
         />
      </div>
    </section>
  )
}

function CreateCuentaContableModal() {
  return (
    <div
      className="w-full"
    >
      <div className="flex flex-col gap-4">
        <div>
          <div>
            <Label>Nombre de la cuenta contable</Label>
            <Input type="text" placeholder="Nombre de la cuenta contable" />
          </div>
          <div>
            <Label>Codigo de la cuenta contable</Label>
            <Input type="text" placeholder="Codigo de la cuenta contable" />
          </div>
          <div>
            <Label>Descripcion de la cuenta contable</Label>
            <Input type="text" placeholder="Descripcion de la cuenta contable" />
          </div>
          <Button type="submit">Crear</Button>
        </div>
      </div>
    </div>
  )
}
