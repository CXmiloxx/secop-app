import { ProductosService } from "@/services/productos.service";
import { ProductosType } from "@/types/productos.types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";

export default function useProductos() {
  const [productos, setProductos] = useState<ProductosType[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [errorProductos, setErrorProductos] = useState<string | null>(null);


  const fetchProductos = useCallback(async (idConcepto: number): Promise<ProductosType[] | undefined> => {
    setLoadingProductos(true);
    setErrorProductos(null);
    try {
      const { data, status } = await ProductosService.productosPorConcepto(idConcepto);
      if (status === 200 && Array.isArray(data)) {
        setProductos(data as ProductosType[]);
        return data as ProductosType[];
      } else {
        console.log("No se pudo obtener la lista de productos correctamente")
        setErrorProductos("No se pudo obtener la lista de productos correctamente.");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorProductos(err.message);
      } else if (err instanceof Error) {
        setErrorProductos(err.message);
      } else {
        setErrorProductos("Error desconocido al obtener productos.");
      }
    } finally {
      setLoadingProductos(false);
    }
  }, [setProductos]);

  return {
    productos,
    loadingProductos,
    errorProductos,
    fetchProductos
  };
}