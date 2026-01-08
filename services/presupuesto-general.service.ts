import api from "@/lib/api";

export const PresupuestoGeneralService = {

  async findAllPresupuestoGeneral(periodo: number) {
    return await api.get(`/presupuesto-general?periodo=${periodo}`)
  },


}



