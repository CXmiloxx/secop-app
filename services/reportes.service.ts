import api from "@/lib/api"


export const ReportesService = {
  
  getParams(fechaInicio?: Date, fechaFin?: Date) {
    const params: Record<string, any> = {};
  
    if (fechaInicio) params.fechaInicio = fechaInicio.toISOString();
    if (fechaFin) params.fechaFin = fechaFin.toISOString();
    return params;
  },

  async proveedores(fechaInicio?: Date, fechaFin?: Date) {
    const params = this.getParams(fechaInicio, fechaFin);
    const response = await api.get(`/reportes/proveedores`, { params })
    return response
  },

  async tesoreria(fechaInicio?: Date, fechaFin?: Date) {
    const params = this.getParams(fechaInicio, fechaFin);
    const response = await api.get(`/reportes/tesoreria`, { params })
    return response
  },

  async consultor(fechaInicio?: Date, fechaFin?: Date) {
    const params = this.getParams(fechaInicio, fechaFin);
    const response = await api.get(`/reportes/consultor`, { params })
    return response
  },

  async findAllPresupuestos(fechaInicio?: Date, fechaFin?: Date) {
    const params = this.getParams(fechaInicio, fechaFin);
    const response = await api.get(`/reportes/presupuestos`, { params })
    return response
  },

  async findAllPresupuestosGeneral(fechaInicio?: Date, fechaFin?: Date) {
    const response = await api.get(`/reportes/presupuesto-general?fechaInicio=${fechaInicio?.toISOString()}&fechaFin=${fechaFin?.toISOString()}`)
    return response
  },
}