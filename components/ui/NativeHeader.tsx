"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { triggerHaptic } from "@/lib/haptics";

interface NativeHeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  subtitle?: string;
  transparent?: boolean;
}

export default function NativeHeader({
  title,
  showBack = true,
  rightElement,
  subtitle,
  transparent = false
}: NativeHeaderProps) {
  const router = useRouter();

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        transparent 
          ? "bg-transparent" 
          : "bg-white/80 backdrop-blur-xl border-b border-gray-100/50"
      }`}
      style={{ 
        paddingTop: "env(safe-area-inset-top, 0px)",
        height: "calc(52px + env(safe-area-inset-top, 0px))"
      }}
    >
      <div className="flex items-center h-[52px] px-4">
        {/* Left: Back Button */}
        <div className="flex-1 flex items-center">
          {showBack && (
            <motion.button
              whileTap={{ scale: 0.9, opacity: 0.7 }}
              onClick={() => {
                triggerHaptic();
                router.back();
              }}
              className="p-2 -ml-2 text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" strokeWidth={1.8} />
            </motion.button>
          )}
        </div>

        {/* Center: Title */}
        <div className="flex-[2] flex flex-col items-center justify-center overflow-hidden">
          <h1 className="text-[17px] font-bold text-gray-900 tracking-tight text-center truncate w-full">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] font-medium text-gray-400 -mt-0.5 truncate w-full text-center">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end">
          {rightElement}
        </div>
      </div>
    </header>
  );
}
