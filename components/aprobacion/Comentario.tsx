import { formatCurrency } from "@/lib";
import { RequisicionType } from "@/types";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { DialogContent, DialogDescription, DialogFooter, DialogTitle } from "../ui/dialog";
import { createCommentSchema, CreateCommentSchema } from "@/schema/requisicion.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";

interface CrearComentarioRequisicionProps {
  requisicion: RequisicionType | null;
  setShowComentarioDialog: (show: boolean) => void;
  createCommentRequiscion: (requisicionId: number, comment: CreateCommentSchema) => Promise<boolean>;
}
export default function Comentario({
  requisicion,
  createCommentRequiscion,
  setShowComentarioDialog,
}: CrearComentarioRequisicionProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCommentSchema>({
    resolver: zodResolver(createCommentSchema),
  });

  const onSubmit = async (data: CreateCommentSchema) => {
    const response = await createCommentRequiscion(Number(requisicion?.id), data);
    if (response) {
      setShowComentarioDialog(false);
      reset();
    }
  };
  return (
    <DialogContent className="max-w-2xl">
      <DialogTitle>Agregar Comentario</DialogTitle>
      <DialogDescription>Escriba un comentario sobre esta requisición</DialogDescription>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-semibold mb-2 truncate">{requisicion?.concepto}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Área:</p>
              <p className="font-medium truncate">{requisicion?.area}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Solicitante:</p>
              <p className="font-medium truncate">{requisicion?.solicitante}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Valor Total:</p>
              <p className="font-medium">{formatCurrency(requisicion?.valorPresupuestado ?? 0)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Proveedor:</p>
              <p className="font-medium truncate">{requisicion?.proveedor}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comentario">Comentario</Label>
          <Textarea
            id="comentario"
            placeholder="Ingrese su comentario o nota sobre esta requisición..."
            {...register("comentario")}
            rows={4}
            className={errors.comentario ? "border-red-500 focus:ring-red-500" : ""}
            autoFocus
          />
          {errors.comentario && (
            <span className="text-xs text-red-500">{errors.comentario.message}</span>
          )}
        </div>
        <DialogFooter className="pt-2 gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => setShowComentarioDialog(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Comentario"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
