import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-3 text-center pb-8 pt-10">
            <div className="mx-auto w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sistema de Gestión Presupuestal
            </CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-400">
              Colegio Bilingüe Lacordaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-10 px-8">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                Inicia sesión con tu cuenta institucional de Microsoft para acceder al sistema
              </p>
            </div>
            <Button
              asChild
              className="w-full h-12 text-base font-medium bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/login`}>
                <svg
                  className="mr-3 h-5 w-5"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                Iniciar sesión con Microsoft
              </a>
            </Button>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                Al iniciar sesión, aceptas los términos y condiciones del sistema
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}