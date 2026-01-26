import { LoaderCircle } from "lucide-react";

interface LoaderProps {
  message?: string
}

export default function Loader({ message = "Cargando información, espere por favor..." }: LoaderProps) {
  return (
    <div className="flex justify-center items-center h-screen">
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-10 bg-card rounded-xl ">
      <LoaderCircle className="h-10 w-10 text-primary mb-2 animate-spin" />
        <p className="text-lg font-medium text-primary">{message}</p>
    </div>
  </div>
  )
}
