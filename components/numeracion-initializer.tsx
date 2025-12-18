"use client"

import { useEffect } from "react"
import { inicializarNumeracionExistente } from "@/lib/numeracion"

export function NumeracionInitializer() {
  useEffect(() => {
    // Inicializar numeración para datos existentes al cargar la aplicación
    inicializarNumeracionExistente()
  }, [])

  return null
}
