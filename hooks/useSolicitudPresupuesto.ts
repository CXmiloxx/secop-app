import { RegisterSolicitudPresupuestoSchema } from "@/schema/solicitar-presupuesto.schema";
import { SolicitudPresupuestoService } from "@/services/solicitud-presupuesto.service";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";

export default function useSolicitudPresupuesto() {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSolicitud = useCallback(async (registerData: RegisterSolicitudPresupuestoSchema) => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await SolicitudPresupuestoService.SolicitudPresupuesRequest(registerData);
      if (status === 201) {
        // Success - could reset form or show success message here
      } else {
        setError("No se pudo crear la solicitud del presupuesto correctamente.");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al crear la solicitud del presupuesto.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    presupuestos,
    loading,
    error,
    createSolicitud
  };
}