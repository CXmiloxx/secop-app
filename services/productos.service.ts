import api from "@/lib/api";

export const ProductosService = {
  async productosPorConcepto(conceptoContableId: number) {
    return await api.get(`/productos/${conceptoContableId}`)
  },

}



