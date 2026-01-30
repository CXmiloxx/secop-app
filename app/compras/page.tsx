'use client'

import { DollarSignIcon } from 'lucide-react'
import HistorialCompras from '@/components/compras/historial-compras'
import Navbar from '@/components/Navbar'

export default function ComprasPage() {



  return (
    <section>
      <Navbar
        title="Historial de Compras"
        subTitle="Compras aprobadas y registradas"
        Icon={DollarSignIcon}
      />

      <main className="container mx-auto px-4 py-8">
        <HistorialCompras />
      </main>
    </section>
  )
}
