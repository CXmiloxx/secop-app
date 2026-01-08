"use client"
import { LucideIcon, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { ReactNode } from "react";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getAvailablePeriodos } from "@/utils/periodos";
import { usePeriodoStore } from "@/store/periodo.store";
import Modal from "./Modal";

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
  actionButtonText: string;
  rightContent?: ReactNode;
  children?: ReactNode;
  viewPeriodo?: boolean;
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
}: NavbarProps) {
  const { periodo, setPeriodo } = usePeriodoStore()

  return (
    <>
      <nav
        className={`w-full bg-card border-b shadow-sm px-4 py-5 sm:py-7 flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between mb-8 ${className}`}
      >
        <div className="flex flex-1 items-center gap-4 ml-1 min-w-0">
          {Icon && (
            <span className="shrink-0 flex items-center justify-center bg-primary/10 rounded-lg p-2 mr-2">
              <Icon className="h-9 w-9 text-primary" />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="text-[2rem] leading-tight font-bold text-foreground truncate">
              {title}
            </h1>
            {subTitle && (
              <p className="text-sm text-muted-foreground mt-1 truncate">{subTitle}</p>
            )}
          </div>
        </div>

        <div className="flex flex-none items-center gap-3 mt-2 sm:mt-0">
          {viewPeriodo && (
            <div className="flex items-center gap-2">
              <Label className="text-sm">Año:</Label>
              <Select value={periodo.toString()} onValueChange={(v) => setPeriodo(Number.parseInt(v))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailablePeriodos()?.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {rightContent}
          {actionModal && (
            <div onClick={() => actionModal.onOpenChange(true)}>
              {actionModal.button ?? (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {actionButtonText}
                </Button>
              )}
            </div>
          )}
        </div>

        {children && (
          <div className="w-full mt-4 sm:mt-0">{children}</div>
        )}
      </nav>

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
