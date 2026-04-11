"use client";

import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  const dragControls = useDragControls();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          {/* Native-style Backdrop with heavier blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
          />

          {/* Premium iOS Sheet */}
          <motion.div
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={0.05}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                triggerHaptic();
                onClose();
              }
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300, mass: 0.8 }}
            className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-[32px] flex flex-col max-h-[92vh] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] overflow-hidden border-t border-white/20"
            style={{ 
              paddingBottom: "env(safe-area-inset-bottom, 20px)",
              touchAction: "none" 
            }}
          >
            {/* Grabber Indicator */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
            >
              <div className="w-9 h-1.25 bg-black/10 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div 
                className="flex items-center justify-between px-6 py-2 border-b border-black/[0.03] touch-none"
              >
                <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">{title}</h3>
                <button
                  onClick={() => {
                    triggerHaptic();
                    onClose();
                  }}
                  className="w-8 h-8 rounded-full bg-black/[0.04] flex items-center justify-center active:scale-90 transition-transform"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            )}

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto px-6 py-5" style={{ touchAction: "pan-y" }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
