import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { NumeracionInitializer } from '@/components/numeracion-initializer';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Sistema de Gestión Presupuestal',
  description: 'Colegio Bilingüe Lacordaire',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <NumeracionInitializer />
        <AppLayout>{children}</AppLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
