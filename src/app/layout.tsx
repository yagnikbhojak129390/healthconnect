import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#14b8a6" },
    { media: "(prefers-color-scheme: dark)", color: "#0f766e" },
  ],
};

export const metadata: Metadata = {
  title: "HealthConnect | Smart Health Surveillance System",
  description: "Early Warning System for Rural Health Monitoring in Northeast India",
  keywords: ["health surveillance", "disease outbreak", "water quality", "northeast india", "ASHA workers"],
  authors: [{ name: "HealthConnect Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.variable}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
