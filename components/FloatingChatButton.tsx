'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import ChatWidget from './ChatWidget';

export default function FloatingChatButton() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const lastScrollY = useRef(0);

    // Standard passive scroll listener — zero Framer Motion overhead per frame
    useEffect(() => {
        const handleScroll = () => {
            const latest = window.scrollY;
            const diff = latest - lastScrollY.current;
            if (latest > 100) {
                if (diff > 10) {
                    setShowButton(false);
                } else if (diff < -10) {
                    setShowButton(true);
                }
            } else {
                setShowButton(true);
            }
            lastScrollY.current = latest;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide on specific pages
    useEffect(() => {
        if (pathname?.startsWith('/admin')) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }, [pathname]);

    const toggleChat = () => setIsOpen(!isOpen);

    const isProductPage = pathname?.includes('/product/');
    const isCartPage = pathname === '/cart';

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: showButton || isOpen ? 1 : 0,
                            opacity: showButton || isOpen ? 1 : 0,
                            x: showButton || isOpen ? 0 : 20,
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                        className={`fixed z-[60] right-4 md:right-8 ${isCartPage
                            ? 'bottom-[130px]' // Position above the cart sticky footer
                            : isProductPage
                                ? 'md:top-1/2 md:bottom-auto bottom-[140px]'
                                : 'top-1/2'
                            }`}
                        style={{ y: isProductPage ? 0 : undefined }}
                    >
                        <motion.button
                            onClick={toggleChat}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-orange-300 ${isOpen ? 'bg-slate-800 text-white' : 'bg-[#FF7900] text-white hover:bg-[#e66d00]'
                                }`}
                            aria-label={isOpen ? "Close chat" : "Chat with support"}
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="chat"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <MessageCircle className="w-7 h-7" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Ping animation to draw attention - only when closed */}
                            {!isOpen && (
                                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <ChatWidget isOpen={isOpen && isVisible} onClose={() => setIsOpen(false)} />
        </>
    );
}
