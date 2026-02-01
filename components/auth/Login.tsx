'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card'
import { Mail, Lock, FileText, EyeClosed, Eye, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useForm } from 'react-hook-form'
import { loginSchema, LoginSchema } from '@/schema/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuth from '@/hooks/useAuth'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const { login, error: authError, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: LoginSchema) => {
    await login(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-bl from-blue-200 via-indigo-200 to-purple-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="overflow-visible rounded-3xl shadow-[0_10px_40px_0_rgba(36,63,177,0.16)] border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg transition-all duration-300">
          <CardHeader className="gap-3 flex flex-col items-center text-center pb-6 pt-10">
            <div className="w-20 h-20 bg-linear-to-br from-blue-700 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl mb-2 ring-4 ring-blue-300/10 dark:ring-blue-900/20">
              <FileText className="w-10 h-10 drop-shadow-lg text-blue-100 dark:text-blue-400" />
            </div>
            <CardTitle className="text-3xl xl:text-4xl font-extrabold tracking-tight bg-linear-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Sistema de Gestión Presupuestal
            </CardTitle>
            <CardDescription className="text-base text-gray-700 dark:text-gray-400 font-medium">
              Colegio Bilingüe Lacordaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-7 pt-0 pb-12 px-8">
            <div className="space-y-2 mb-3">
              <p className="text-[15px] text-gray-700 dark:text-gray-300 text-center leading-relaxed font-semibold">
                Inicia sesión con tu cuenta institucional
              </p>
              {authError && (
                <div className="text-center text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg text-red-700 dark:text-red-400 px-3 py-2 font-medium shadow-sm inline-block">
                  {authError}
                </div>
              )}
            </div>
            <form
              className="space-y-6 dark:text-white"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {/* Campo de correo */}
              <div className="space-y-2">
                <Label
                  htmlFor="correo"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 flex gap-2 items-center"
                >
                  <Mail className="w-4 h-4 text-blue-800/80 dark:text-indigo-400/70" />
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    id="correo"
                    autoComplete="email"
                    {...register('correo')}
                    className={cn(
                      "pl-10 block w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:outline-none bg-white/90 dark:bg-gray-950/60 border-gray-300 dark:border-gray-800 transition-shadow",
                      errors.correo
                        ? "border-red-400 focus:ring-red-300"
                        : "focus:ring-blue-400 dark:focus:ring-blue-600"
                    )}
                    placeholder="tucorreo@ejemplo.com"
                    disabled={isSubmitting || loading}
                  />
                </div>
                {errors.correo && (
                  <span className="text-red-600 text-xs mt-1 block font-semibold">
                    {errors.correo.message}
                  </span>
                )}
              </div>
              {/* Campo de contraseña */}
              <div className="space-y-2">
                <Label
                  htmlFor="contrasena"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 flex gap-2 items-center"
                >
                  <Lock className="w-4 h-4 text-blue-800/80 dark:text-indigo-400/70" />
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="contrasena"
                    autoComplete="current-password"
                    {...register('contrasena')}
                    className={cn(
                      "pl-10 pr-12 block w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:outline-none bg-white/90 dark:bg-gray-950/60 border-gray-300 dark:border-gray-800 transition-shadow",
                      errors.contrasena
                        ? "border-red-400 focus:ring-red-300"
                        : "focus:ring-blue-400 dark:focus:ring-blue-600"
                    )}
                    placeholder="Tu contraseña"
                    disabled={isSubmitting || loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    tabIndex={-1}
                    onClick={() => setShowPassword((sp) => !sp)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-blue-700 dark:hover:text-indigo-400 bg-transparent hover:bg-blue-50 dark:hover:bg-gray-800/60 rounded-full p-0"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeClosed className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                {errors.contrasena && (
                  <span className="text-red-600 text-xs mt-1 block font-semibold">
                    {errors.contrasena.message}
                  </span>
                )}
              </div>
              {/* Botón de envío */}
              <Button
                type="submit"
                className="w-full py-2.5 mt-5 rounded-xl text-base font-semibold bg-linear-to-r from-blue-600 to-indigo-700 shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all flex items-center justify-center gap-2"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 text-white" />
                    Ingresando...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-1" />
                    Ingresar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="w-full flex flex-col items-center mt-6">
          <span className="text-[13px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
            © {new Date().getFullYear()} Colegio Bilingüe Lacordaire
          </span>
        </div>
      </div>
    </div>
  );
}
