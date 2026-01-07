import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  backdropClassName?: string;
  modalClassName?: string;
  title?: string;
  description?: string;
  closeButtonLabel?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  modalClassName = '',
  title = 'Title',
  description,
  closeButtonLabel = 'Cerrar',
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          'sm:max-w-lg rounded-xl shadow-2xl border bg-background',
          'animate-in fade-in-90 slide-in-from-top-1',
          modalClassName
        )}
      >
        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <DialogClose
          aria-label={closeButtonLabel}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground rounded-md transition-colors"
        >
        </DialogClose>
        <div className="py-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
