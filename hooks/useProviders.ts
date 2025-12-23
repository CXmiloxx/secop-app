import { findAll } from "@/services/providers.service";
import { useProvidersStore } from "@/store/provider.store";
import { ProvidersType } from "@/types/provider.types";
import { ApiError } from "@/utils/api-error";
import { useCallback } from "react";

export default function useProviders() {

  const { providers, setProvider, setError, } = useProvidersStore()

  const getProviders = useCallback(async () => {
    try {
      const { data, message, status } = await findAll()
      setProvider(data as ProvidersType)
      return {
        data
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message)
      }
    }
  }, [findAll])

  return {
    getProviders,
  }

}