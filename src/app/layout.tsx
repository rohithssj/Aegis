import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import ClientWrapper from "@/components/ClientWrapper";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Aegis | Mission Critical Command",
  description: "Next-generation AI emergency response and neural monitoring platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans min-h-screen bg-[#0B1120] text-slate-200 flex flex-col`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}

