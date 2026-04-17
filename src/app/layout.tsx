import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Aegis AI | Mission Critical Command",
  description: "Next-generation AI emergency response and neural monitoring platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.variable} font-sans min-h-screen bg-[#020617] text-slate-200 flex flex-col`}>
        <Navbar />
        <div className="pt-20 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
