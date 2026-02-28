import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Layout from "@/components/layout/Layout";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import ModalManager from "@/components/modals/ModalManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TribeX eSports",
  description: "TribeX eSports - organize and compete in tournaments for PUBG, Free Fire, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Layout>{children}</Layout>
          <ModalManager />
          <Toaster richColors />
        </Providers>
      </body>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
    </html>
  );
}
