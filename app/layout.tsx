import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generador de Cotizaciones para Freelancers",
  description: "Crea cotizaciones profesionales en minutos desde tu móvil."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
