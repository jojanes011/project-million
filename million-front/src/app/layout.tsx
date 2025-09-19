import type { Metadata } from 'next';
import { Playfair_Display, Lato  } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/feature/providers';
import { Footer } from '@/components/feature/footer';
import { PropertyModal } from '@/components/feature/property-modal';
import { PropertyTraceModal } from '@/components/feature/property-trace-modal';
import { OwnerModal } from '@/components/feature/owner-modal';
import { Toaster } from '@/components/ui/sonner';

const playfair_display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Million Luxury Real Estate',
  description: 'Million Luxury Real Estate',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${playfair_display.className} ${lato.className} font-lato`}>
        <Providers>
          {children}
          <PropertyModal />
          <PropertyTraceModal />
          <OwnerModal />
        </Providers>
        <Toaster richColors />
        <Footer />
      </body>
    </html>
  );
}
