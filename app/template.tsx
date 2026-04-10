"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.25, 0.1, 0.25, 1] // Apple-style ease-out
      }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}
