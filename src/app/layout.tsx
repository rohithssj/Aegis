import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { IncidentProvider } from "@/context/IncidentContext";

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
        <IncidentProvider>
          <Navbar />
          <div className="pt-20 flex-1 flex flex-col">
            {children}
          </div>
        </IncidentProvider>
      </body>
    </html>
  );
}

