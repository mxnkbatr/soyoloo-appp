'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Phone, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function PhonePage() {
    const { user } = useAuth();
    const [phone, setPhone] = useState(user?.phone || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 8) {
            toast.error('Утасны дугаар буруу байна');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phone.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Утасны дугаар амжилттай шинэчлэгдлээ');
            } else {
                toast.error(data.error || 'Алдаа гарлаа');
            }
        } catch {
            toast.error('Сервертэй холбогдож чадсангүй');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] font-sans pb-10">
            {/* Header */}
            <div className="bg-white h-[56px] flex items-center px-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sticky top-0 z-50">
                <Link href="/settings" className="p-2 -ml-2 text-[#1A1A1A]">
                    <ChevronLeft className="w-6 h-6" strokeWidth={2} />
                </Link>
                <h1 className="flex-1 text-center text-[16px] font-bold text-[#1A1A1A] pr-8">
                    Утасны дугаар
                </h1>
            </div>

            <div className="p-4 mt-4 space-y-4">
                {/* Info */}
                <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-4 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FFF3E8] flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-[#FF6B00]" />
                    </div>
                    <div>
                        <p className="text-[14px] font-bold text-[#1A1A1A]">Утасны дугаар шинэчлэх</p>
                        <p className="text-[12px] text-[#999999] mt-0.5">Одоогийн: {user?.phone || 'Тохируулаагүй'}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="text-[11px] font-bold text-[#999999] uppercase tracking-wider ml-4 mb-2 block">
                            Утасны дугаар
                        </label>
                        <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-4 h-[56px] flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#FF6B00]/30 transition-all">
                            <Phone className="w-[18px] h-[18px] text-[#CCCCCC] shrink-0" strokeWidth={1.5} />
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="77181818"
                                required
                                className="flex-1 text-[15px] text-[#1A1A1A] placeholder-[#CCCCCC] bg-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[52px] bg-[#FF6B00] text-white font-bold text-[16px] rounded-[14px] flex items-center justify-center gap-2 transition-opacity active:opacity-80 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : 'Хадгалах'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
