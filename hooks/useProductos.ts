import { ProductosService } from "@/services/productos.service";
import { ProductosType } from "@/types/productos.types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useProductos() {
  const [productos, setProductos] = useState<ProductosType[]>([]);
  const [productosTotales, setProductosTotales] = useState<ProductosType[]>([]);

  const [loadingProductos, setLoadingProductos] = useState(false);
  const [errorProductos, setErrorProductos] = useState<string | null>(null);


  const fetchProductos = useCallback(async (idConcepto: number): Promise<ProductosType[] | undefined> => {
    setLoadingProductos(true);
    setErrorProductos(null);
    setProductos([]);
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


  const fetchProductosTotales = useCallback(async (): Promise<ProductosType[] | undefined> => {
    setLoadingProductos(true);
    setErrorProductos(null);
    try {
      const { data, status } = await ProductosService.productos();
      if (status === 200 && Array.isArray(data)) {
        setProductosTotales(data as ProductosType[]);
        return data as ProductosType[];
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener productos.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorProductos(errorMessage);
    } finally {
      setLoadingProductos(false);
    }
  }, [setProductosTotales]);

  const fetchDeleteProducto = useCallback(async (productoId: number): Promise<boolean> => {
    setLoadingProductos(true);
    setErrorProductos(null);
    try {
      const { status } = await ProductosService.deleteProducto(productoId);
      if (status === 200) {
        toast.success('Producto eliminado exitosamente');
        await fetchProductosTotales();
        return true;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorProductos(err.message);
      } else if (err instanceof Error) {
        setErrorProductos(err.message);
      } else {
        setErrorProductos("Error desconocido al eliminar producto.");
      }
    } finally {
      setLoadingProductos(false);
    }
    return false;
  }, [fetchProductosTotales]);

  return {
    productos,
    productosTotales,
    loadingProductos,
    errorProductos,
    fetchProductos,
    fetchProductosTotales,
    fetchDeleteProducto
  };
}