'use client'
import {
  EyeClosed,
  Eye,
  UserPlus,
  Mail,
  Lock,
  Loader2,
  User as UserIcon,
  Phone,
  FileText,
  IdCard,
  Briefcase,
  Shield
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useForm, Controller } from 'react-hook-form'
import { registerSchema, RegisterSchema, editUserSchema, EditUserSchema } from '@/schema/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuthUser from '@/hooks/useAuth'
import { useCallback, useEffect, useState } from 'react'
import { AreaType, RolType, UserType } from '@/types/user.types'
import Modal from '../Modal'

interface UserProps {
  type: 'create' | 'edit'
  user?: UserType
  onSuccess?: () => void
  isOpen?: boolean
  onClose?: () => void
}

const TIPO_DOCUMENTO = [
  { value: 'CEDULA', label: 'Cédula de Ciudadanía' },
  { value: 'CEDULA_EXTRANJERIA', label: 'Cédula de Extranjería' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
]

export default function CreateUser({ type, user, onSuccess, isOpen = true, onClose }: UserProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<RegisterSchema | EditUserSchema>({
    resolver: zodResolver(type === 'edit' ? editUserSchema : registerSchema),
    defaultValues: user ? {
      id: user.id,
      correo: user.correo,
      nombre: user.nombre,
      apellido: user.apellido,
      documento: user.documento,
      tipoDocumento: user.tipoDocumento,
      telefono: user.telefono,
      rolId: user.rol.id,
      areaId: user.area.id,
      contrasena: ''
    } : undefined
  })

  const { registerUser, updateUser, error: authError, loading, parametersData } = useAuthUser()
  const [showPassword, setShowPassword] = useState(false)
  const [rol, setRol] = useState<RolType[]>([])
  const [area, setArea] = useState<AreaType[]>([])
  const [loadingParams, setLoadingParams] = useState(true)

  const onSubmit = async (data: RegisterSchema | EditUserSchema) => {
    let res: boolean | undefined = false;

    if (type === 'edit') {
      const editData = { ...data } as EditUserSchema;
      if (!editData.contrasena || editData.contrasena.trim() === '') {
        delete editData.contrasena;
      }
      res = await updateUser(editData);
    } else {
      res = await registerUser(data as RegisterSchema);
    }

    if (res) {
      reset()
      onSuccess?.()
    }
  }

  const getData = useCallback(async () => {
    try {
      setLoadingParams(true)
      const [roles, areas] = await Promise.all([
        parametersData('rol'),
        parametersData('area')
      ])

      if (roles) setRol(roles as RolType[])
      if (areas) setArea(areas as AreaType[])
    } catch (error) {
      console.error('Error fetching parameters:', error)
    } finally {
      setLoadingParams(false)
    }
  }, [parametersData])

  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    if (user && type === 'edit') {
      reset({
        id: user.id,
        correo: user.correo,
        nombre: user.nombre,
        apellido: user.apellido,
        documento: user.documento,
        tipoDocumento: user.tipoDocumento,
        telefono: user.telefono,
        rolId: user.rol.id,
        areaId: user.area.id,
        contrasena: ''
      })
    } else if (type === 'create') {
      reset({
        correo: '',
        nombre: '',
        apellido: '',
        documento: '',
        tipoDocumento: 'CEDULA',
        telefono: '',
        rolId: undefined,
        areaId: undefined,
        contrasena: ''
      })
    }
  }, [user, type, reset])

  const handleClose = () => {
    reset()
    onClose?.()
  }

  if (!onClose) {
    return renderForm()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={type === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
      description="Complete la información del usuario"
      modalClassName="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      {renderForm()}
    </Modal>
  )

  function renderForm() {
    return (
      <div className="w-full">
        {authError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-200">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Información de Contacto
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Correo Electrónico */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="correo" className="text-sm font-medium">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="correo"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    className="pl-10"
                    disabled={isSubmitting || loading}
                    aria-invalid={!!errors.correo}
                    {...register('correo')}
                  />
                </div>
                {errors.correo && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.correo.message}
                  </p>
                )}
              </div>

              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium">
                  Nombre
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Juan"
                    className="pl-10"
                    disabled={isSubmitting || loading}
                    aria-invalid={!!errors.nombre}
                    {...register('nombre')}
                  />
                </div>
                {errors.nombre && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <Label htmlFor="apellido" className="text-sm font-medium">
                  Apellido
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="apellido"
                    type="text"
                    placeholder="Pérez"
                    className="pl-10"
                    disabled={isSubmitting || loading}
                    aria-invalid={!!errors.apellido}
                    {...register('apellido')}
                  />
                </div>
                {errors.apellido && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.apellido.message}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="telefono" className="text-sm font-medium">
                  Teléfono
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="+57 300 123 4567"
                    className="pl-10"
                    disabled={isSubmitting || loading}
                    aria-invalid={!!errors.telefono}
                    {...register('telefono')}
                  />
                </div>
                {errors.telefono && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.telefono.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Identificación */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <IdCard className="h-4 w-4" />
              Identificación
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Tipo de Documento */}
              <div className="space-y-2">
                <Label htmlFor="tipoDocumento" className="text-sm font-medium">
                  Tipo de Documento
                </Label>
                <Controller
                  name="tipoDocumento"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting || loading || loadingParams}
                      >
                        <SelectTrigger className="w-full pl-10">
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPO_DOCUMENTO.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.tipoDocumento && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.tipoDocumento.message}
                  </p>
                )}
              </div>

              {/* Número de Documento */}
              <div className="space-y-2">
                <Label htmlFor="documento" className="text-sm font-medium">
                  Número de Documento
                </Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="documento"
                    type="text"
                    placeholder="1234567890"
                    className="pl-10"
                    disabled={isSubmitting || loading}
                    aria-invalid={!!errors.documento}
                    {...register('documento')}
                  />
                </div>
                {errors.documento && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.documento.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Asignación Organizacional */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Asignación Organizacional
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Rol */}
              <div className="space-y-2">
                <Label htmlFor="rolId" className="text-sm font-medium">
                  Rol
                </Label>
                <Controller
                  name="rolId"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        disabled={isSubmitting || loading || loadingParams}
                      >
                        <SelectTrigger className="w-full pl-10">
                          <SelectValue placeholder="Seleccione un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingParams ? (
                            <SelectItem value="loading" disabled>
                              Cargando roles...
                            </SelectItem>
                          ) : (
                            rol.map((r) => (
                              <SelectItem key={r.id} value={r.id.toString()}>
                                {r.nombre}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.rolId && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.rolId.message}
                  </p>
                )}
              </div>

              {/* Área */}
              <div className="space-y-2">
                <Label htmlFor="areaId" className="text-sm font-medium">
                  Área
                </Label>
                <Controller
                  name="areaId"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        disabled={isSubmitting || loading || loadingParams}
                      >
                        <SelectTrigger className="w-full pl-10">
                          <SelectValue placeholder="Seleccione un área" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingParams ? (
                            <SelectItem value="loading" disabled>
                              Cargando áreas...
                            </SelectItem>
                          ) : (
                            area.map((a) => (
                              <SelectItem key={a.id} value={a.id.toString()}>
                                {a.nombre}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.areaId && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.areaId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Seguridad
            </h3>

            <div className="space-y-2">
              <Label htmlFor="contrasena" className="text-sm font-medium">
                Contraseña {type === 'edit' && <span className="text-muted-foreground font-normal">(dejar en blanco para mantener la actual)</span>}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="contrasena"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={type === 'edit' ? 'Nueva contraseña (opcional)' : 'Mínimo 4 caracteres'}
                  className="pl-10 pr-10"
                  disabled={isSubmitting || loading}
                  aria-invalid={!!errors.contrasena}
                  autoComplete="new-password"
                  {...register('contrasena')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.contrasena && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.contrasena.message}
                </p>
              )}
              {type === 'edit' && (
                <p className="text-xs text-muted-foreground">
                  Solo ingrese una nueva contraseña si desea cambiarla
                </p>
              )}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
              disabled={isSubmitting || loading || loadingParams}
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {type === 'create' ? 'Creando...' : 'Guardando...'}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {type === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    )
  }
}
