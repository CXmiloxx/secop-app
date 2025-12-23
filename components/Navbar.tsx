import { Building2, IconNode, LucideIcon, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface navbarProps {
  dialogOpen: boolean,
  setDialogOpen: Dispatch<SetStateAction<boolean>>,
  Icon: LucideIcon,
  title: string,
  subTitle: string,
  status: boolean,
  component: ReactNode,
  isEdit: Boolean,

}

export default function Navbar({ dialogOpen, setDialogOpen, Icon, title, subTitle, status, isEdit, component }: navbarProps) {

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <Icon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{subTitle}</p>
        </div>
      </div>

      {status && 
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Proveedor
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{isEdit ? "Editar Proveedor" : "Agregar Proveedor"}</DialogTitle>
                </DialogHeader>
                {component}
              </DialogContent>
      </Dialog>
      }

    </div>
  )
}
