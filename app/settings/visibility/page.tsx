'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function VisibilityPage() {
    const [profilePublic, setProfilePublic] = useState(true);
    const [showPhone, setShowPhone] = useState(false);
    const [showOnline, setShowOnline] = useState(true);

    const items = [
        { label: 'Профайл нийтэд харагдах', value: profilePublic, set: setProfilePublic },
        { label: 'Утасны дугаар харуулах', value: showPhone, set: setShowPhone },
        { label: 'Онлайн байдал харуулах', value: showOnline, set: setShowOnline },
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F5] font-sans pb-10">
            <div className="bg-white h-[56px] flex items-center px-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sticky top-0 z-50">
                <Link href="/settings/security" className="p-2 -ml-2 text-[#1A1A1A]">
                    <ChevronLeft className="w-6 h-6" strokeWidth={2} />
                </Link>
                <h1 className="flex-1 text-center text-[16px] font-bold text-[#1A1A1A] pr-8">
                    Профайл харагдах байдал
                </h1>
            </div>
            <div className="p-4 mt-4">
                <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
                    {items.map((item, i) => (
                        <div key={i} className={`flex items-center justify-between px-4 h-[64px] ${i < items.length - 1 ? 'border-b border-[#F5F5F5]' : ''}`}>
                            <span className="text-[15px] font-bold text-[#1A1A1A]">{item.label}</span>
                            <button
                                onClick={() => item.set(!item.value)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.value ? 'bg-[#FF6B00]' : 'bg-[#E5E5E5]'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${item.value ? 'translate-x-5' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
