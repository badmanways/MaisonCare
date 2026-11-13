import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Nanny & MaisonCare Lëtzebuerg | Family Staffing & Household Concierge",
  description:
    "Reliable Help for Your Home, Family and Business in Luxembourg. Vetted multilingual nannies, household & commercial cleaning, senior care, pet care, and private concierge services.",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/admin-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MaisonCare Admin",
  },
};

export const viewport: Viewport = {
  themeColor: "#FEF7E9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-ivory text-ink selection:bg-gold/30 selection:text-ink">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
