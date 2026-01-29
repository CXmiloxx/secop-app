import api from "@/lib/api";

export const ProductosService = {
  async productosPorConcepto(conceptoContableId: number) {
    return await api.get(`/productos/${conceptoContableId}`)
  },

  async productos() {
    return await api.get(`/productos`)
  },

  async deleteProducto(productoId: number) {
    return await api.delete(`/productos/${productoId}`)
  },

}



