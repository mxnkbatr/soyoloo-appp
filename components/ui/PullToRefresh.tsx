"use client";

import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { triggerHaptic } from "@/lib/haptics";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PULL_THRESHOLD = 80;

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const y = useMotionValue(0);
  const controls = useAnimation();
  
  // Controls the rotation and opacity based on pull distance
  const opacity = useTransform(y, [0, PULL_THRESHOLD], [0, 1]);
  const rotate = useTransform(y, [0, PULL_THRESHOLD], [0, 360]);

  // Sync scroll position to enable/disable drag listener
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDragEnd = async () => {
    const currentY = y.get();
    if (currentY >= PULL_THRESHOLD) {
      setRefreshing(true);
      triggerHaptic();
      
      // Keep it at threshold while refreshing
      await controls.start({ y: PULL_THRESHOLD });
      
      try {
        await onRefresh();
      } catch (err) {
        console.error("Refresh failed", err);
      }
      
      setRefreshing(false);
    }
    
    // Snap back
    controls.start({ y: 0 });
  };

  return (
    <div className="relative w-full" style={{ touchAction: "pan-y" }}>
      {/* PTR Indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center items-center pointer-events-none z-50"
        style={{ height: PULL_THRESHOLD }}
      >
        <motion.div
          style={{ y, opacity, rotate }}
          animate={refreshing ? { rotate: 360 } : {}}
          transition={refreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-full shadow-md p-2 mt-4"
        >
          <Loader2 
            className={`w-5 h-5 text-[#FF5000] ${refreshing ? "animate-spin" : ""}`} 
            strokeWidth={2.5} 
          />
        </motion.div>
      </div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.4}
        dragListener={isAtTop && !refreshing}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y }}
        className="w-full relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
