import api from "@/lib/api";

export const PresupuestoGeneralService = {

  async findAllPresupuestoGeneral() {
    return await api.get("/presupuesto-general")
  },


}



