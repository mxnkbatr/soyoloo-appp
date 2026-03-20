'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, User, Mail, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function EditProfilePage() {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Нэр оруулна уу');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), email: email.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Профайл амжилттай шинэчлэгдлээ');
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
                    Профайл засах
                </h1>
            </div>

            <div className="p-4 mt-4 space-y-4">
                {/* Avatar placeholder */}
                <div className="flex flex-col items-center py-6">
                    <div className="w-20 h-20 rounded-full bg-[#FF6B00]/10 border-2 border-[#FF6B00]/20 flex items-center justify-center mb-3">
                        <span className="text-3xl font-extrabold text-[#FF6B00]">
                            {(name?.[0] || '?').toUpperCase()}
                        </span>
                    </div>
                    <p className="text-[12px] text-[#999] font-medium">Профайл зураг тун удахгүй...</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Name */}
                    <div>
                        <label className="text-[11px] font-bold text-[#999999] uppercase tracking-wider ml-4 mb-2 block">
                            Нэр
                        </label>
                        <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-4 h-[56px] flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#FF6B00]/30 transition-all">
                            <User className="w-[18px] h-[18px] text-[#CCCCCC] shrink-0" strokeWidth={1.5} />
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Нэрээ оруулна уу"
                                required
                                className="flex-1 text-[15px] text-[#1A1A1A] placeholder-[#CCCCCC] bg-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-[11px] font-bold text-[#999999] uppercase tracking-wider ml-4 mb-2 block">
                            И-мэйл
                        </label>
                        <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-4 h-[56px] flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#FF6B00]/30 transition-all">
                            <Mail className="w-[18px] h-[18px] text-[#CCCCCC] shrink-0" strokeWidth={1.5} />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="И-мэйл хаяг"
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
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Хадгалах
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
