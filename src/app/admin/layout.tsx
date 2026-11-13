import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "MaisonCare Admin Portal | Real-Time Notifications & Staffing",
  description:
    "Administrator and live notifications portal for Nanny & MaisonCare Lëtzebuerg.",
  manifest: "/admin-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MaisonCare Admin",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#002B0C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#242423] antialiased">
      {children}
    </div>
  );
}

