export const getAvailablePeriodos = (periodo: number) => {
  const currentYearNum = new Date().getFullYear()

  if (periodo === currentYearNum) {
    return Array.from({ length: 5 }, (_, i) => periodo + i)
      .sort((a, b) => b - a)
  }

  if (periodo > currentYearNum) {
    return Array.from({ length: 5 }, (_, i) => currentYearNum + i)
      .sort((a, b) => b - a)
  }

  return []
}
