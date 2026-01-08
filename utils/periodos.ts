import { usePeriodoStore } from "@/store/periodo.store"
const { periodo } = usePeriodoStore()


export const getAvailablePeriodos = () => {
  return Array.from({ length: 10 }, (_, i) => periodo + i).sort((a: number, b: number) => b - a)
} 