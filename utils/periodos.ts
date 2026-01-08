"use client"
import { usePeriodoStore } from "@/store/periodo.store"
export const getAvailablePeriodos = () => {
  const { periodo } = usePeriodoStore()
  const currentYearNum = new Date().getFullYear()

  if (periodo === currentYearNum) {
    return Array.from({ length: 5 }, (_, i) => periodo + i).sort((a: number, b: number) => b - a)

  } else if (periodo > currentYearNum) {
    return Array.from({ length: 5 }, (_, i) => currentYearNum + i).sort((a: number, b: number) => b - a)
  }
}