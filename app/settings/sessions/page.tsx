'use client';

import Link from 'next/link';
import { ChevronLeft, Smartphone, Monitor, Tablet } from 'lucide-react';

const mockSessions = [
    { device: 'iPhone 15 Pro', location: 'Улаанбаатар, МН', time: 'Одоо идэвхтэй', icon: Smartphone, current: true },
    { device: 'Windows PC', location: 'Улаанбаатар, МН', time: '2 цагийн өмнө', icon: Monitor, current: false },
];

export default function SessionsPage() {
    return (
        <div className="min-h-screen bg-[#F5F5F5] font-sans pb-10">
            <div className="bg-white h-[56px] flex items-center px-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sticky top-0 z-50">
                <Link href="/settings/security" className="p-2 -ml-2 text-[#1A1A1A]">
                    <ChevronLeft className="w-6 h-6" strokeWidth={2} />
                </Link>
                <h1 className="flex-1 text-center text-[16px] font-bold text-[#1A1A1A] pr-8">
                    Идэвхтэй сессүүд
                </h1>
            </div>
            <div className="p-4 mt-4 space-y-3">
                {mockSessions.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-4 py-4 flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${s.current ? 'bg-[#FFF3E8]' : 'bg-[#F5F5F5]'}`}>
                                <Icon className={`w-5 h-5 ${s.current ? 'text-[#FF6B00]' : 'text-[#999]'}`} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-bold text-[#1A1A1A]">{s.device}</p>
                                <p className="text-[12px] text-[#999]">{s.location} · {s.time}</p>
                            </div>
                            {s.current && (
                                <span className="text-[11px] font-bold text-[#FF6B00] bg-[#FFF3E8] px-2 py-0.5 rounded-full">Одоо</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
