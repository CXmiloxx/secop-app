export const getAvailablePeriodos = () => {
  const currentYearNum = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYearNum + i).sort((a: number, b: number) => b - a)
}