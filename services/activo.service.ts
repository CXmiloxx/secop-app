import api from "@/lib/api";

export const ActivoService = {

  async activoSeleccionado(activoId: number, areaId: number) {
    return await api.get(`/traslado-activos/activo-seleccionado/${activoId}?areaId=${areaId}`)
  },
}



