'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { Banner } from '@/models/Banner';

import { Flame, Package, Globe, Tag } from 'lucide-react';

export default function MobileHero() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        if (banners.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, [banners.length]);

    useEffect(() => {
        fetch('/api/banners')
            .then(res => res.json())
            .then(data => setBanners(data.banners || []))
            .catch(err => console.error('Error fetching banners:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide, banners.length]);

    if (isLoading || banners.length === 0) {
        return (
            <div className="mx-4 mt-4 relative rounded-[28px] overflow-hidden bg-slate-100 animate-pulse aspect-[16/9]" />
        );
    }

    return (
        <section className="relative w-full bg-white lg:hidden mb-10 mt-3 px-4">
            {/* Native Paging Banner Header */}
            <div className="relative rounded-[28px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)] bg-white border border-black/[0.02]">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            const swipe = info.offset.x;
                            if (swipe < -50 && currentIndex < banners.length - 1) {
                                setCurrentIndex(currentIndex + 1);
                            } else if (swipe > 50 && currentIndex > 0) {
                                setCurrentIndex(currentIndex - 1);
                            }
                        }}
                        animate={{ x: `-${currentIndex * 100}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="flex w-full h-full cursor-grab active:cursor-grabbing"
                    >
                        {banners.map((banner, index) => (
                            <div key={index} className="relative min-w-full h-full">
                                <Image
                                    src={banner.image || ''}
                                    alt={banner.title || `Banner ${index + 1}`}
                                    fill
                                    priority={index === 0}
                                    className="object-cover"
                                    sizes="100vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                            </div>
                        ))}
                    </motion.div>

                    {/* iOS Style Pill Indicators */}
                    <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-1.5">
                        {banners.map((_, index) => (
                            <motion.div
                                key={index}
                                initial={false}
                                animate={{
                                    width: index === currentIndex ? 18 : 6,
                                    backgroundColor: index === currentIndex ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.4)"
                                }}
                                className="h-1.5 rounded-full backdrop-blur-md shadow-sm"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium Minimalist Quick Actions */}
            <div className="mt-8 flex justify-between items-start gap-1 overflow-x-auto scrollbar-hide">
                {[
                    { name: 'Шинэ', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-100/60', glow: 'shadow-rose-200/40', href: '/new-arrivals' },
                    { name: 'Бэлэн', icon: Package, color: 'text-orange-600', bg: 'bg-orange-100/60', glow: 'shadow-orange-200/40', href: '/ready-to-ship' },
                    { name: 'Захиалга', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-100/60', glow: 'shadow-blue-200/40', href: '/pre-order' },
                    { name: 'Хямдрал', icon: Tag, color: 'text-red-500', bg: 'bg-red-50/90', glow: 'shadow-red-200/50', href: '/sale', highlight: true },
                ].map((item) => (
                    <motion.a
                        key={item.name}
                        href={item.href}
                        whileTap={{ scale: 0.94 }}
                        className="flex flex-col items-center gap-2.5 flex-1 min-w-[76px]"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <motion.div
                            animate={item.highlight ? { scale: [1, 1.05, 1] } : {}}
                            transition={item.highlight ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                            className={`relative w-[60px] h-[60px] rounded-2xl ${item.bg} flex items-center justify-center transition-all duration-300 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.06)] ${item.glow} border ${item.highlight ? 'border-red-100' : 'border-white'}`}
                        >
                            <item.icon className={`w-6.5 h-6.5 ${item.color}`} strokeWidth={item.highlight ? 2 : 1.6} />

                            {/* Pro-grade Glass Highlight */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-white/50 pointer-events-none" />
                        </motion.div>
                        <span className="text-[12px] font-medium text-gray-800 tracking-tight text-center leading-tight">
                            {item.name}
                        </span>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
