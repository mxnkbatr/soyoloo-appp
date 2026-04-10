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
      exit={{ x: -20, opacity: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 380,
        damping: 30,
        mass: 0.8
      }}
      style={{ willChange: "transform, opacity" }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}
