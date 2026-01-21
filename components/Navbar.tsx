"use client"
import { ArrowLeft, LucideIcon, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { ReactNode } from "react";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getAvailablePeriodos } from "@/utils/periodos";
import { usePeriodoStore } from "@/store/periodo.store";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

interface NavbarActionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  button?: ReactNode;
  modalTitle?: string;
  modalDescription?: string;
  modalContent?: ReactNode;
  modalClassName?: string;
}

interface NavbarProps {
  Icon?: LucideIcon;
  title: string;
  subTitle?: string;
  actionModal?: NavbarActionModalProps;
  className?: string;
  actionButtonText?: string;
  rightContent?: ReactNode;
  children?: ReactNode;
  viewPeriodo?: boolean;
  backButton?: boolean;
}

export default function Navbar({
  Icon,
  title,
  subTitle,
  actionModal,
  className = "",
  rightContent,
  children,
  viewPeriodo,
  actionButtonText,
  backButton = false,
}: NavbarProps) {
  const { periodo, setPeriodo } = usePeriodoStore();
  const periodosDisponibles = getAvailablePeriodos(periodo);
  const router = useRouter();

  return (
    <>
      {/* Botón de volver en la parte superior, fuera del nav principal */}
      {backButton && (
        <div className="w-full flex px-4 sm:px-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      <nav
        className={`w-full bg-card border-b shadow-sm px-4 py-5 sm:px-8 flex flex-col gap-4 mb-8 ${className}`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
          {/* Izquierda: Icono, Título, Subtítulo */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {Icon && (
              <span className="shrink-0 flex items-center justify-center bg-primary/10 rounded-lg p-2 mt-1">
                <Icon className="h-8 w-8 text-primary" />
              </span>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">
                {title}
              </h1>
              {subTitle && (
                <p className="text-sm text-muted-foreground mt-1 truncate">{subTitle}</p>
              )}
            </div>
          </div>

          {/* Derecha: Año, rightContent, Botón acción */}
          <div className="flex flex-row shrink-0 items-center gap-3 mt-2 md:mt-0">
            {viewPeriodo && (
              <div className="flex items-center gap-2">
                <Label className="text-sm whitespace-nowrap">Año:</Label>
                <Select
                  value={periodo.toString()}
                  onValueChange={(v) => setPeriodo(Number.parseInt(v))}
                >
                  <SelectTrigger className="w-28 md:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periodosDisponibles?.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {rightContent && (
              <div className="flex items-center">{rightContent}</div>
            )}
            {actionModal && (
              <div onClick={() => actionModal.onOpenChange(true)}>
                {actionModal.button ?? (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {actionButtonText ?? "Crear"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contenido extra debajo del navbar */}
        {children && (
          <div className="w-full pt-2">{children}</div>
        )}
      </nav>

      {/* Modal para acción */}
      {actionModal && (
        <Modal
          isOpen={actionModal.isOpen}
          onClose={() => actionModal.onOpenChange(false)}
          title={actionModal.modalTitle}
          description={actionModal.modalDescription}
          modalClassName={actionModal.modalClassName}
        >
          {actionModal.modalContent}
        </Modal>
      )}
    </>
  );
}
