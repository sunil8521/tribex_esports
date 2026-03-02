import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import Layout from "@/components/layout/Layout";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import ModalManager from "@/components/modals/ModalManager";

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
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
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
