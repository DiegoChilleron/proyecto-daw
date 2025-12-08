import type { Metadata } from "next";
import { inter } from "@/config/fonts";
import { VanillaCookieConsent } from "@/utils/cookieconsent/VanillaCookieConsent";
import { PayPalProvider } from "@/components";

import "./globals.css";
import "../components/components.css";
import "./legal/legal.css";


export const metadata: Metadata = {
  title: {
    template: "%s - WebFactory | Creador de Webs",
    default: "Home - WebFactory | Creador de Webs",
  },
  description: "Crea tu web estática profesional en minutos. Plantillas de webs corporativas, portfolios, landing pages y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} antialiased`}
      >
        <PayPalProvider>
          {children}
          <VanillaCookieConsent />
        </PayPalProvider>
      </body>
    </html>
  );
}
