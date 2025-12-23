import type React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { NumeracionInitializer } from '@/components/numeracion-initializer';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Sistema de Gestión Presupuestal - Colegio Bilingüe Lacordaire',
  description: 'Sistema de gestión y control presupuestal del Colegio Bilingüe Lacordaire.',
  generator: 'Next.js',
  icons: {
    icon: [
      {
        url: '/icon-secop-removebg-preview.webp',
        media: '(prefers-color-scheme: light)',
        type: 'image/webp',
      },
      {
        url: '/icon-secop-removebg-preview.webp',
        media: '(prefers-color-scheme: dark)',
        type: 'image/webp',
      },
      {
        url: '/icon-secop-removebg-preview.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: { url: '/apple-icon.png', type: 'image/png' },
  },
  applicationName: 'Sistema de Gestión Presupuestal',
  keywords: [
    'gestión', 'presupuesto', 'colegio', 'lacordaire', 'educación', 'finanzas', 'administrativo'
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased ">
        <NumeracionInitializer />
        <AppLayout>{children}</AppLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
