'use client'
import { UserType } from "@/types/user.types"
import { Button } from "../ui/button"
import { useState } from "react"
import CreateUser from "./CreateUser"
import {
  UserPlus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
  Search,
  Users,
  Shield,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback } from "../ui/avatar"

interface UsersProps {
  users: UserType[]
  loading: boolean
  error: string | null
  onUserDeleted?: () => void
  onDeleteUser: (userId: string) => Promise<boolean>
}

export default function ListUsers({ loading, users, error, onUserDeleted, onDeleteUser }: UsersProps) {
  const [openModal, setOpenModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserType | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [openChangeAreaDialog, setOpenChangeAreaDialog] = useState(false)
  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedUser(undefined)
  }

  const handleSuccess = () => {
    handleCloseModal()
    onUserDeleted?.()
  }

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user)
    setOpenModal(true)
  }

  /*   const handleDeleteClick = (user: UserType) => {
      setUserToDelete(user)
      setDeleteDialogOpen(true)
    }
  
    const handleConfirmDelete = async () => {
      if (!userToDelete) return
  
      setIsDeleting(true)
      const success = await onDeleteUser(userToDelete.id)
      setIsDeleting(false)
  
      if (success) {
        setDeleteDialogOpen(false)
        setUserToDelete(null)
      }
    } */

  const filteredUsers = users?.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.nombre.toLowerCase().includes(searchLower) ||
      user.apellido.toLowerCase().includes(searchLower) ||
      user.correo.toLowerCase().includes(searchLower) ||
      user.area?.nombre.toLowerCase().includes(searchLower) ||
      user.rol?.nombre.toLowerCase().includes(searchLower)
    )
  })

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 dark:border-red-900/50 dark:bg-red-950/20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
            Error al cargar usuarios
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
            <p className="text-sm text-muted-foreground">
              Administre los usuarios del sistema
            </p>
          </div>
        </div>
        <Button
          onClick={() => setOpenModal(true)}
          className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar usuarios por nombre, correo, área o rol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[250px]">Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm
                        ? "No se encontraron usuarios con ese criterio"
                        : "No hay usuarios registrados"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/10">
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white">
                          {getInitials(user.nombre, user.apellido)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.nombre} {user.apellido}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.tipoDocumento}: {user.documento}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="flex w-fit items-center gap-1.5">
                      <Shield className="h-3 w-3" />
                      {user.rol?.nombre}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      {user.area?.nombre}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs">{user.correo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs">{user.telefono}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="flex w-fit items-center gap-1.5">
                      <Shield className="h-3 w-3" />
                      {user.estado ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="h-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30"
                      >
                        <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                        Editar
                      </Button>
                      {/*  <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
                        className="h-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Eliminar
                      </Button> */}
                    </div>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Stats */}
      {!loading && filteredUsers?.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3 text-sm">
          <p className="text-muted-foreground">
            Mostrando <span className="font-medium text-foreground">{filteredUsers?.length}</span> de{" "}
            <span className="font-medium text-foreground">{users.length}</span> usuarios
          </p>
        </div>
      )}

      {/* Modal */}
      <CreateUser
        type={selectedUser ? 'edit' : 'create'}
        user={selectedUser}
        onSuccess={handleSuccess}
        isOpen={openModal}
        onClose={handleCloseModal}
      />

      {/* Alert Dialog para confirmar eliminación */}
      {/* <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle className="text-xl">
                Eliminar Usuario
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              ¿Está seguro que desea eliminar al usuario{' '}
              <span className="font-semibold text-foreground">
                {userToDelete?.nombre} {userToDelete?.apellido}
              </span>
              ?
              <br />
              <span className="text-red-600 dark:text-red-400 font-medium">
                Esta acción no se puede deshacer.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  )
}