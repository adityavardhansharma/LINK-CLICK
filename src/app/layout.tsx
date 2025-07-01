import type { Metadata } from "next";
import { Libre_Baskerville, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ConvexProvider } from "@/components/providers/convex-provider";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "LINK CLICK - Your Personal Link Manager",
  description: "Organize your links with folders and search. Built with liquid glass design.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/LINK.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        url: "/favicon.ico",
        type: "image/x-icon",
        sizes: "32x32",
      },
      {
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LINK CLICK",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#93C8D8',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-background text-foreground antialiased ${libreBaskerville.variable} ${lora.variable} ${ibmPlexMono.variable}`}>
        <ConvexProvider>
          {children}
        </ConvexProvider>
      </body>
    </html>
  );
}
