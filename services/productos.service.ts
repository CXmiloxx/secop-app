import api from "@/lib/api";

export const ProductosService = {
  async productosPorConcepto(id_concepto_contable: number) {
    return await api.get(`/productos/${id_concepto_contable}`)
  },

}



