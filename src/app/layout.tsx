import type { Metadata } from "next";
import { inter } from "@/config/fonts";
import { VanillaCookieConsent } from "@/utils/cookieconsent/VanillaCookieConsent";
import { PayPalProvider } from "@/components";

import "./globals.css";
import "../components/components.css";
import "./legal/legal.css";


export const metadata: Metadata = {
  title: {
    template: "%s - Teslo | Shop",
    default: "Home - Teslo | Shop",
  },
  description: "Una tienda virtual de productos",
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
