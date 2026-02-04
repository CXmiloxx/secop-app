import api from "@/lib/api";
import { RegisterProductoSchema } from "@/schema/producto.schema";

export const ProductosService = {
  
  async createProducto(producto: RegisterProductoSchema) {
    return await api.post(`/productos`, producto);
  },

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



