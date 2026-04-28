"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { IncidentProvider } from "@/context/IncidentContext";
import TopLoader from "@/components/TopLoader";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <IncidentProvider>
      <Toaster richColors position="top-right" theme="dark" />
      <TopLoader />
      <Navbar />
      <main className="flex-1 flex flex-col relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </IncidentProvider>
  );
}
