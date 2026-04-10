"use client";

import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useEffect } from "react";
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[1001] lg:hidden"
          />

          {/* Sheet */}
          <motion.div
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                triggerHaptic();
                onClose();
              }
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[1002] lg:hidden flex flex-col max-h-[95vh] shadow-2xl overflow-hidden"
            style={{ 
              paddingBottom: "env(safe-area-inset-bottom, 20px)",
              touchAction: "none" 
            }}
          >
            {/* Handle bar - Pointer down starts drag */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="flex justify-center pt-3 pb-3 cursor-grab active:cursor-grabbing touch-none"
            >
              <div className="w-10 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* Header - Also draggable */}
            {title && (
              <div 
                onPointerDown={(e) => dragControls.start(e)}
                className="flex items-center justify-between px-6 py-2 border-b border-gray-50 touch-none"
              >
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    triggerHaptic();
                    onClose();
                  }}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center active:scale-90 transition-transform"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            )}

            {/* Content - Native Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4" style={{ touchAction: "pan-y" }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
