import { LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface NavbarActionDialogProps {
  dialogOpen?: boolean;
  setDialogOpen?: Dispatch<SetStateAction<boolean>>;
  button?: ReactNode;
  dialogTitle?: string;
  dialogContent?: ReactNode;
  showDialog?: boolean;
}

interface NavbarProps {
  Icon?: LucideIcon;
  title: string;
  subTitle?: string;
  actionDialogProps?: NavbarActionDialogProps;
  className?: string;
  rightContent?: ReactNode;
  children?: ReactNode;
}

export default function Navbar({
  Icon,
  title,
  subTitle,
  actionDialogProps,
  className = "",
  rightContent,
  children,
}: NavbarProps) {
  return (
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
        {rightContent}
        {actionDialogProps?.showDialog && (
          <Dialog
            open={actionDialogProps.dialogOpen}
            onOpenChange={actionDialogProps.setDialogOpen}
          >
            <DialogTrigger asChild>
              {actionDialogProps.button ?? (
                <Button variant="default" size="sm">
                  Acción
                </Button>
              )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {actionDialogProps.dialogTitle ?? "Acción"}
                </DialogTitle>
              </DialogHeader>
              {actionDialogProps.dialogContent}
            </DialogContent>
          </Dialog>
        )}
      </div>
      {children && (
        <div className="w-full mt-4 sm:mt-0">{children}</div>
      )}
    </nav>
  );
}
