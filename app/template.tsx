"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Skip transition for completely different layouts to avoid weird glitches
  const skipPaths = ["/admin", "/admin-giris", "/canli-yayin"];
  if (skipPaths.some(p => pathname?.startsWith(p))) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        mass: 0.5
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
