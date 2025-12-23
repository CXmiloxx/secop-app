'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card'
import { EyeClosed, Eye, UserPlus, Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { registerSchema, RegisterSchema } from '@/schema/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuthUser from '@/hooks/use-auth-user'
import { useCallback, useEffect, useState } from 'react'
import { Area, Rol, UserType } from '@/types/user.types'

interface UserProps{
  type: 'create' | 'edit',
  user?: UserType[]
}

export default function User({type, user}: UserProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const { registerUser, error: authError, isLoading, findDataAll } = useAuthUser()
  const [showPassword, setShowPassword] = useState(false)
  const [rol, setRol] = useState<Rol[]>([])
  const [area, setArea] = useState<Area[]>([])



  const onSubmit = async (data: RegisterSchema) => {
    await registerUser(data)
    reset()
  }

  const getData = useCallback(async () => {
    try {
      const roles = await findDataAll('rol');
      const areas = await findDataAll('area');

      if (roles) {
        setRol(roles as Rol[]);
      }
      if (areas) {
        setArea(areas as Area[]);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }, [findDataAll]);

  useEffect(() => {
    getData();
  }, [getData]);

  const TipoDocumento = [
    'CEDULA'
  ]

  
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-md sm:max-w-2xl mx-auto">
        <Card className="overflow-visible rounded-3xl shadow-2xl border-0 bg-white/80 dark:bg-gray-900/85 backdrop-blur-2xl transition-all duration-300">
          <CardHeader className="flex flex-col items-center text-center ">
            <div className="w-20 h-20  bg-linear-to-br from-blue-700 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mb-2 ring-4 ring-blue-300/10 dark:ring-blue-900/20">
              <UserPlus className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-linear-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              {type  === 'create' ? "crear usuario" : "editar usuario"}
            </CardTitle>
            <CardDescription className="text-base text-gray-700 dark:text-gray-400 font-medium">
              <span>Gestión Presupuestal · Colegio Bilingüe Lacordaire</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-7 sm:space-y-10 pt-0 pb-8 md:pb-10 px-4 sm:px-10">
            {authError && (
              <div className="text-center text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg text-red-700 dark:text-red-400 px-3 py-2 font-medium shadow-sm">
                {authError}
              </div>
            )}

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6"
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              noValidate
            >

              {/* Correo electrónico */}
              <div className="relative col-span-1 md:col-span-2">
                <label
                  htmlFor="correo"
                  className="block text-[15px] font-semibold text-gray-800 dark:text-gray-200 mb-1"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    id="correo"
                    autoComplete="email"
                    {...register('correo')}
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:outline-none bg-white/90 dark:bg-gray-950/70 border-gray-300 dark:border-gray-800 transition-shadow
                      ${errors.correo
                        ? 'border-red-400 focus:ring-red-300'
                        : 'focus:ring-blue-400 dark:focus:ring-blue-600'
                      }`}
                    placeholder="tucorreo@ejemplo.com"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                {errors.correo && (
                  <span className="text-red-600 text-xs mt-1 block font-semibold">
                    {errors.correo.message}
                  </span>
                )}
              </div>

              {/* Nombre */}
              <div className="relative">
                <label
                  htmlFor="nombre"
                  className="block text-[15px] font-semibold text-gray-800 dark:text-gray-200 mb-1"
                >
                  Nombre
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    id="nombre"
                    autoComplete="nombre"
                    {...register('nombre')}
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:outline-none bg-white/90 dark:bg-gray-950/70 border-gray-300 dark:border-gray-800 transition-shadow
                      ${errors.nombre
                        ? 'border-red-400 focus:ring-red-300'
                        : 'focus:ring-blue-400 dark:focus:ring-blue-600'
                      }`}
                    placeholder="Nombre del usuario"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                {errors.nombre && (
                  <span className="text-red-600 text-xs mt-1 block font-semibold">
                    {errors.nombre.message}
                  </span>
                )}
              </div>

              {/* Apellido */}
              <div className="relative">
                <label
                  htmlFor="apellido"
                  className="block text-[15px] font-semibold text-gray-800 dark:text-gray-200 mb-1"
                >
                  Apellido
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    id="apellido"
                    autoComplete="apellido"
                    {...register('apellido')}
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:outline-none bg-white/90 dark:bg-gray-950/70 border-gray-300 dark:border-gray-800 transition-shadow
                      ${errors.apellido
                        ? 'border-red-400 focus:ring-red-300'
                        : 'focus:ring-blue-400 dark:focus:ring-blue-600'
                      }`}
                    placeholder="Apellido del usuario"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                {errors.apellido && (
                  <span className="text-red-600 text-xs mt-1 block font-semibold">
                    {errors.apellido.message}
                  </span>
                )}
              </div>

              {/* Teléfono */}
              <div className="relative">
                <label
                  htmlFor="telefono"
                  className="block text-[15px] font-semibold text-gray-800 dark:text-gray-200 mb-1"
                >
                  Teléfono
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    id="telefono"
                    autoComplete="telefono"
                    {...register('telefono')}
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:outline-none bg-white/90 dark:bg-gray-950/70 border-gray-300 dark:border-gray-800 transition-shadow
                      ${errors.telefono
                        ? 'border-red-400 focus:ring-red-300'
                        : 'focus:ring-blue-400 dark:focus:ring-blue-600'
                      }`}
                    placeholder="Teléfono del usuario"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                {errors.telefono && (
                  <span className="text-red-600 text-xs mt-1 block font-semibold">
                    {errors.telefono.message}
                  </span>
                )}
              </div>

              {/* Documento */}
              <div className="relative">
                <label
                  htmlFor="documento"
                  className="block text-[15px] font-semibold text-gray-800 dark:text-gray-200 mb-1"
                >
                  Documento
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    id="documento"
                    autoComplete="documento"
                    {...register('documento')}
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:outline-none bg-white/90 dark:bg-gray-950/70 border-gray-300 dark:border-gray-800 transition-shadow
                      ${errors.documento
                        ? 'border-red-400 focus:ring-red-300'
                        : 'focus:ring-blue-400 dark:focus:ring-blue-600'
                      }`}
                    placeholder="Documento del usuario"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                {errors.documento && (
                  <span className="text-red-600 text-xs mt-1 block font-semibold">
                    {errors.documento.message}
                  </span>
                )}
              </div>

              {/* Tipo de Documento */}
              <div className="relative">
                <label
                  htmlFor="tipo_documento"
                  className="block text-[15px] font-semibold text-gray-800 dark:text-gray-200 mb-1"
                >
                  Tipo de documento
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <select
                    id="tipo_documento"
                    autoComplete="tipo_documento"
                    {...register('tipo_documento')}
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:outline-none bg-white/90 dark:bg-gray-950/70 border-gray-300 dark:border-gray-800 transition-shadow
                      ${errors.tipo_documento
                        ? 'border-red-400 focus:ring-red-300'
                        : 'focus:ring-blue-400 dark:focus:ring-blue-600'
                      }`}
                    disabled={isSubmitting || isLoading}
                  >
                    {TipoDocumento.map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                {errors.tipo_documento && (
                  <span className="text-red-600 text-xs mt-1 block font-semibold">
                    {errors.tipo_documento.message}
                  </span>
                )}
              </div>

              {/* Rol */}
              <div className="relative">
                <label
                  htmlFor="rolId"
                  className="block text-[15px] font-semibold text-gray-800 dark:text-gray-200 mb-1"
                >
                  Rol
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <select
                    id="rolId"
                    autoComplete="rolId"
                    {...register('rolId',{
                    valueAsNumber: true,
                    })}
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:outline-none bg-white/90 dark:bg-gray-950/70 border-gray-300 dark:border-gray-800 transition-shadow
                      ${errors.rolId
                        ? 'border-red-400 focus:ring-red-300'
                        : 'focus:ring-blue-400 dark:focus:ring-blue-600'
                      }`}
                    disabled={isSubmitting || isLoading}
                  >
                    {rol.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                  </select>
                </div>
                {errors.rolId && (
                  <span className="text-red-600 text-xs mt-1 block font-semibold">
                    {errors.rolId.message}
                  </span>
                )}
              </div>

              {/* Area */}
              <div className="relative">
                <label
                  htmlFor="areaId"
                  className="block text-[15px] font-semibold text-gray-800 dark:text-gray-200 mb-1"
                >
                  Area
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <select
                    id="areaId"
                    autoComplete="areaId"
                    {...register('areaId',{
                    valueAsNumber: true,
                    })}
                    className={`block w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:outline-none bg-white/90 dark:bg-gray-950/70 border-gray-300 dark:border-gray-800 transition-shadow
                      ${errors.areaId
                        ? 'border-red-400 focus:ring-red-300'
                        : 'focus:ring-blue-400 dark:focus:ring-blue-600'
                      }`}
                    disabled={isSubmitting || isLoading}
                  >
                    {area.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                  </select>
                </div>
                {errors.areaId && (
                  <span className="text-red-600 text-xs mt-1 block font-semibold">
                    {errors.areaId.message}
                  </span>
                )}
              </div>

              {/* Contraseña */}
              <div className="relative col-span-1 md:col-span-2">
                <label
                  htmlFor="contrasena"
                  className="block text-[15px] font-semibold text-gray-800 dark:text-gray-200 mb-1"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="contrasena"
                    autoComplete="new-password"
                    {...register('contrasena')}
                    className={`block w-full pl-10 pr-12 py-2.5 rounded-xl border text-sm focus:ring-2 focus:outline-none bg-white/90 dark:bg-gray-950/70 border-gray-300 dark:border-gray-800 transition-shadow
                      ${errors.contrasena
                        ? 'border-red-400 focus:ring-red-300'
                        : 'focus:ring-blue-400 dark:focus:ring-blue-600'
                      }`}
                    placeholder="Crea una contraseña"
                    disabled={isSubmitting || isLoading}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800/50 rounded-full p-1 focus:outline-none"
                    tabIndex={-1}
                    onClick={() => setShowPassword((sp) => !sp)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
                {errors.contrasena && (
                  <span className="text-red-600 text-xs mt-1 block font-semibold">
                    {errors.contrasena.message}
                  </span>
                )}
              </div>

              <div className="col-span-1 md:col-span-2">
                <Button
                  type="submit"
                  className="w-full py-3 mt-6 rounded-xl text-base font-bold bg-linear-to-r from-blue-600 to-indigo-700 shadow-xl hover:from-blue-700 hover:to-purple-800 hover:scale-[1.01] transition-all"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Creando usuario...
                    </span>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-1" />
                      Crear usuario
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
