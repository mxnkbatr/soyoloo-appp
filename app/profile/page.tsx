'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package, Heart, MapPin, Bell, ShieldCheck,
  ChevronRight, LogOut, Camera, KeyRound, Eye,
  EyeOff, CheckCircle, User, Clock, XCircle,
  TrendingUp, Lock, Link2, Loader2
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

type Tab = 'overview' | 'orders' | 'password';

interface Order {
  _id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items?: any[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const wishlistCount = useWishlistStore(state => state.getTotalItems());
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Stats
  const [orders, setOrders] = useState<Order[]>([]);
  const [addressCount, setAddressCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/user/addresses').then(r => r.json()),
    ]).then(([ordersData, addressData]) => {
      setOrders(ordersData.orders || []);
      setAddressCount(addressData.addresses?.length || 0);
    }).catch(() => { }).finally(() => setDataLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/sign-in');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Амжилттай гарлаа');
    } catch {
      toast.error('Гарахад алдаа гарлаа');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Шинэ нууц үг таарахгүй байна');
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success(data.message || 'Нууц үг амжилттай солигдлоо');
        setTimeout(() => setPwSuccess(false), 5000);
      } else {
        toast.error(data.error || 'Алдаа гарлаа');
      }
    } catch {
      toast.error('Сервертэй холбогдож чадсангүй');
    } finally {
      setPwLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: 'Хүлээгдэж байна',
      processing: 'Боловсруулж байна',
      shipped: 'Илгээгдсэн',
      completed: 'Хүргэгдсэн',
      cancelled: 'Цуцлагдсан',
    };
    return map[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]" />
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.phone || '?')[0];

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Хянах самбар', icon: TrendingUp },
    { id: 'orders', label: 'Захиалгууд', icon: Package },
    { id: 'password', label: 'Нууц үг', icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-[120px] font-sans">

      {/* ─── HEADER ─── */}
      <div className="relative bg-gradient-to-br from-[#FF6B00] via-[#FF7700] to-[#FF8C00] pt-10 pb-16 px-4 flex flex-col items-center">
        {/* Curved bottom */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-[32px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,121.37,189.9,109.83,235.84,101.55,278.49,76.65,321.39,56.44Z" fill="#F5F5F5" />
          </svg>
        </div>

        {/* Avatar */}
        <div className="relative mb-3">
          <div className="w-[88px] h-[88px] rounded-full border-[3px] border-white shadow-lg bg-white flex items-center justify-center overflow-hidden">
            {user.imageUrl ? (
              <Image src={user.imageUrl} alt={user.name || 'User'} width={88} height={88} className="object-cover w-full h-full" />
            ) : (
              <span className="text-[32px] font-extrabold text-[#FF6B00]">{initials}</span>
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
            <Camera className="w-3.5 h-3.5 text-[#FF6B00]" strokeWidth={2.5} />
          </button>
        </div>

        <h1 className="text-[20px] font-bold text-white tracking-tight mb-0.5">{user.name || 'Хэрэглэгч'}</h1>
        <p className="text-[13px] text-white/75 font-medium">{user.phone || user.email || ''}</p>
        {user.role === 'admin' && (
          <span className="mt-2 px-3 py-0.5 bg-white/20 rounded-full text-white text-[11px] font-bold tracking-wider">АДМИН</span>
        )}
      </div>

      {/* ─── STATS ROW ─── */}
      <div className="relative z-20 px-4 -mt-6 mb-5">
        <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 grid grid-cols-3 divide-x divide-[#F0F0F0]">
          <div className="flex flex-col items-center gap-0.5 px-2">
            <span className="text-[22px] font-bold text-[#FF6B00]">{dataLoading ? '—' : orders.length}</span>
            <span className="text-[11px] text-[#999] font-semibold">Захиалга</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 px-2">
            <span className="text-[22px] font-bold text-[#FF6B00]">{wishlistCount}</span>
            <span className="text-[11px] text-[#999] font-semibold">Хадгалсан</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 px-2">
            <span className="text-[22px] font-bold text-[#FF6B00]">{dataLoading ? '—' : addressCount}</span>
            <span className="text-[11px] text-[#999] font-semibold">Хаяг</span>
          </div>
        </div>
      </div>

      {/* ─── TAB BAR ─── */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-1 flex gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[12px] font-bold transition-all ${
                  active
                    ? 'bg-[#FF6B00] text-white shadow-sm'
                    : 'text-[#999] hover:text-[#FF6B00]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── TAB CONTENT ─── */}
      <div className="px-4 space-y-4">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">

            {/* Quick stats cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4">
                <div className="w-9 h-9 bg-[#FFF0E6] rounded-[10px] flex items-center justify-center mb-3">
                  <Package className="w-5 h-5 text-[#FF6B00]" strokeWidth={2} />
                </div>
                <p className="text-[24px] font-bold text-[#1A1A1A]">{dataLoading ? '—' : orders.length}</p>
                <p className="text-[12px] text-[#999] font-medium mt-0.5">Нийт захиалга</p>
              </div>
              <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4">
                <div className="w-9 h-9 bg-[#FFF0F5] rounded-[10px] flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5 text-[#EC4899]" strokeWidth={2} />
                </div>
                <p className="text-[24px] font-bold text-[#1A1A1A]">{wishlistCount}</p>
                <p className="text-[12px] text-[#999] font-medium mt-0.5">Хадгалсан бараа</p>
              </div>
              <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4">
                <div className="w-9 h-9 bg-[#EEF2FF] rounded-[10px] flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-[#6366F1]" strokeWidth={2} />
                </div>
                <p className="text-[24px] font-bold text-[#1A1A1A]">{dataLoading ? '—' : addressCount}</p>
                <p className="text-[12px] text-[#999] font-medium mt-0.5">Хадгалсан хаяг</p>
              </div>
              <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4">
                <div className="w-9 h-9 bg-[#F0FDF4] rounded-[10px] flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5 text-[#22C55E]" strokeWidth={2} />
                </div>
                <p className="text-[24px] font-bold text-[#1A1A1A]">
                  {dataLoading ? '—' : orders.filter(o => o.status === 'completed').length}
                </p>
                <p className="text-[12px] text-[#999] font-medium mt-0.5">Хүргэгдсэн</p>
              </div>
            </div>

            {/* Recent orders preview */}
            {orders.length > 0 && (
              <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-[#F5F5F5]">
                  <h3 className="text-[14px] font-bold text-[#1A1A1A]">Сүүлийн захиалгууд</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-[12px] text-[#FF6B00] font-bold"
                  >
                    Бүгдийг харах
                  </button>
                </div>
                <div className="divide-y divide-[#F5F5F5]">
                  {orders.slice(0, 3).map(order => (
                    <div key={order._id} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="text-[13px] font-bold text-[#1A1A1A]">#{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-[11px] text-[#999]">{new Date(order.createdAt).toLocaleDateString('mn-MN')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-bold text-[#1A1A1A]">{formatPrice(order.totalPrice)}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Menu links */}
            <div>
              <h2 className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1 mb-2">Холбоосууд</h2>
              <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
                <MenuLink icon={Package} iconBg="#FFF0E6" iconColor="#FF6B00" label="Миний захиалга" href="/orders" subtitle={`${orders.length} захиалга`} />
                <MenuDiv />
                <MenuLink icon={Heart} iconBg="#FFF0F5" iconColor="#EC4899" label="Хадгалсан бараа" href="/wishlist" />
                <MenuDiv />
                <MenuLink icon={MapPin} iconBg="#EEF2FF" iconColor="#6366F1" label="Миний хаягууд" href="/addresses" subtitle={`${addressCount} хаяг`} />
                <MenuDiv />
                <MenuLink icon={Bell} iconBg="#F0F5FF" iconColor="#3B82F6" label="Мэдэгдэл" href="/settings/notifications" />
                <MenuDiv />
                <MenuLink icon={ShieldCheck} iconBg="#F5F0FF" iconColor="#8B5CF6" label="Нууцлал & Аюулгүй байдал" href="/settings/security" />
              </div>
            </div>

            {/* Connected Social Accounts */}
            <ConnectedAccounts />

            {/* Logout */}
            <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
              <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 h-[64px] active:bg-gray-50 transition-colors">
                <div className="w-[42px] h-[42px] rounded-[10px] bg-[#FFF5F5] flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-[#FF3B30]" strokeWidth={2} />
                </div>
                <span className="text-[15px] font-bold text-[#FF3B30]">Гарах</span>
              </button>
            </div>

            <p className="text-center text-[12px] text-[#CCCCCC] font-medium">Soyol v1.0.0</p>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {dataLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#FF6B00]" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] py-16 flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-[#FFF0E6] rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-[#FF6B00]" strokeWidth={1.5} />
                </div>
                <p className="text-[15px] font-bold text-[#1A1A1A]">Захиалга байхгүй байна</p>
                <p className="text-[13px] text-[#999]">Та дэлгүүрчилж эхэлцгээе</p>
                <Link href="/" className="mt-2 px-6 py-2.5 bg-[#FF6B00] text-white rounded-full text-[13px] font-bold">
                  Дэлгүүр үзэх
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order._id} className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#F5F5F5] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="text-[13px] font-bold text-[#1A1A1A]">Захиалга #{order._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <p className="text-[12px] text-[#999]">
                      {new Date(order.createdAt).toLocaleDateString('mn-MN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-[15px] font-bold text-[#FF6B00]">{formatPrice(order.totalPrice)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PASSWORD */}
        {activeTab === 'password' && (
          <div className="space-y-4">
            {/* Info card */}
            <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-4 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FFF3E8] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#1A1A1A]">Нууцлалаа хамгаалаарай</p>
                <p className="text-[12px] text-[#999] mt-0.5">Хамгийн багадаа 6 тэмдэгт оруулна уу</p>
              </div>
            </div>

            {pwSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-[14px] px-4 py-3 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-[13px] text-green-700 font-bold">Нууц үг амжилттай солигдлоо!</p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">

              {/* Current password */}
              <div>
                <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1 mb-2 block">Одоогийн нууц үг</label>
                <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-4 h-[56px] flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#FF6B00]/30 transition-all">
                  <Lock className="w-4 h-4 text-[#CCCCCC] shrink-0" strokeWidth={1.5} />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Одоогийн нууц үгээ оруулна уу"
                    required
                    className="flex-1 text-[15px] text-[#1A1A1A] placeholder-[#CCCCCC] bg-transparent outline-none"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="text-[#CCC] p-1">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1 mb-2 block">Шинэ нууц үг</label>
                <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-4 h-[56px] flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#FF6B00]/30 transition-all">
                  <Lock className="w-4 h-4 text-[#CCCCCC] shrink-0" strokeWidth={1.5} />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Шинэ нууц үг"
                    required
                    className="flex-1 text-[15px] text-[#1A1A1A] placeholder-[#CCCCCC] bg-transparent outline-none"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="text-[#CCC] p-1">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {newPassword && newPassword.length < 6 && (
                  <p className="text-[12px] text-red-500 ml-1 mt-1">Хамгийн багадаа 6 тэмдэгт байх ёстой</p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1 mb-2 block">Нууц үг давтах</label>
                <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-4 h-[56px] flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#FF6B00]/30 transition-all">
                  <Lock className="w-4 h-4 text-[#CCCCCC] shrink-0" strokeWidth={1.5} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Шинэ нууц үгээ дахин оруулна уу"
                    required
                    className="flex-1 text-[15px] text-[#1A1A1A] placeholder-[#CCCCCC] bg-transparent outline-none"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[#CCC] p-1">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-[12px] text-red-500 ml-1 mt-1">Нууц үг таарахгүй байна</p>
                )}
                {confirmPassword && confirmPassword === newPassword && newPassword.length >= 6 && (
                  <p className="text-[12px] text-[#22C55E] ml-1 mt-1 font-medium">✓ Нууц үг таарч байна</p>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="w-full h-[52px] bg-[#FF6B00] text-white font-bold text-[16px] rounded-[14px] flex items-center justify-center gap-2 transition-opacity active:opacity-80 disabled:opacity-50"
                >
                  {pwLoading
                    ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : 'Нууц үг солих'
                  }
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Google Icon ───────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

// ─── Facebook Icon ──────────────────────────────────────────────────────────
function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// ─── Connected Accounts ─────────────────────────────────────────────────────
interface LinkedAccounts {
  google: { linked: boolean; email?: string };
  facebook: { linked: boolean; email?: string };
}

function ConnectedAccounts() {
  const { user } = useAuth();
  const [linked, setLinked] = useState<LinkedAccounts | null>(null);
  const [busy, setBusy] = useState<'google' | 'facebook' | null>(null);
  const [confirmUnlink, setConfirmUnlink] = useState<'google' | 'facebook' | null>(null);

  useEffect(() => {
    fetch('/api/user/link-social')
      .then(r => r.ok ? r.json() : null)
      .then(data => data && setLinked(data))
      .catch(() => {});
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('/api/user/link-social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'google', access_token: tokenResponse.access_token }),
        });

        const data = await res.json();
        if (res.ok) {
          setLinked(prev => prev ? { ...prev, google: { linked: true, email: data.email } } : null);
          toast.success('Амжилттай холбогдлоо!');
        } else {
          toast.error(data.error || 'Холбоход алдаа гарлаа');
        }
      } catch (error) {
        toast.error('Сервертэй холбогдож чадсангүй');
      } finally {
        setBusy(null);
      }
    },
    onError: () => {
      toast.error('Google-ээр холбоход алдаа гарлаа');
      setBusy(null);
    },
  });

  const handleConnect = async (provider: 'google' | 'facebook') => {
    setBusy(provider);
    if (provider === 'google') {
      googleLogin();
    } else {
      toast.error('Удахгүй нэмэгдэх болно');
      setBusy(null);
    }
  };

  // ── Disconnect ───────────────────────────────────────────────────────────
  const handleDisconnect = async (provider: 'google' | 'facebook') => {
    setConfirmUnlink(null);
    setBusy(provider);
    try {
      const res = await fetch('/api/user/link-social', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update local state immediately — no reload needed
        setLinked(prev => prev ? {
          ...prev,
          [provider]: { linked: false },
        } : null);
        toast.success(data.message || 'Холболт салгагдлаа');
      } else {
        toast.error(data.error || 'Алдаа гарлаа');
      }
    } catch {
      toast.error('Сервертэй холбогдож чадсангүй');
    } finally {
      setBusy(null);
    }
  };

  const providers: { key: 'google' | 'facebook'; label: string; icon: React.ReactNode }[] = [
    { key: 'google', label: 'Google', icon: <GoogleIcon /> },
    { key: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
  ];

  return (
    <div>
      <h2 className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1 mb-2">
        Холбогдсон данс
      </h2>
      <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">

        {/* Confirm unlink overlay */}
        {confirmUnlink && (
          <div className="px-4 py-4 bg-red-50 border-b border-red-100 flex flex-col gap-3">
            <p className="text-[13px] font-bold text-red-700">
              {confirmUnlink === 'google' ? 'Google' : 'Facebook'} холболтыг салгах уу?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDisconnect(confirmUnlink)}
                className="flex-1 py-2 bg-red-500 text-white text-[13px] font-bold rounded-[10px] active:opacity-80 transition-opacity"
              >
                Тийм, салгах
              </button>
              <button
                onClick={() => setConfirmUnlink(null)}
                className="flex-1 py-2 bg-[#F0F0F0] text-[#333] text-[13px] font-bold rounded-[10px] active:opacity-80 transition-opacity"
              >
                Болих
              </button>
            </div>
          </div>
        )}

        {providers.map((p, i) => {
          const isLinked = linked?.[p.key]?.linked;
          const email = linked?.[p.key]?.email;
          const isBusy = busy === p.key;
          return (
            <div
              key={p.key}
              className={`flex items-center justify-between px-4 h-[72px] ${i < providers.length - 1 ? 'border-b border-[#F5F5F5]' : ''}`}
            >
              {/* Left: icon + label + status */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-[10px] bg-[#F5F5F5] flex items-center justify-center shrink-0">
                  {p.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-[#1A1A1A]">{p.label}</p>
                  {isLinked && email
                    ? <p className="text-[11px] text-[#999] mt-0.5 truncate max-w-[170px]">{email}</p>
                    : <p className="text-[11px] text-[#BBBBBB] mt-0.5">Холбоогүй байна</p>
                  }
                </div>
              </div>

              {/* Right: action button */}
              {isBusy ? (
                <Loader2 className="w-5 h-5 text-[#999] animate-spin shrink-0" />
              ) : isLinked ? (
                <button
                  onClick={() => setConfirmUnlink(p.key)}
                  disabled={!!busy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-[10px] text-[12px] font-bold text-red-600 transition-colors disabled:opacity-60 shrink-0"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Салгах
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(p.key)}
                  disabled={!!busy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F5F5] hover:bg-[#EBEBEB] rounded-[10px] text-[12px] font-bold text-[#1A1A1A] transition-colors disabled:opacity-60 shrink-0"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Холбох
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MenuLink & MenuDiv ─────────────────────────────────────────────────────
function MenuLink({
  icon: Icon, iconBg, iconColor, label, href, subtitle
}: {
  icon: any; iconBg: string; iconColor: string; label: string; href: string; subtitle?: string;
}) {
  return (
    <Link href={href} className="flex items-center justify-between px-4 h-[64px] active:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
          <Icon className="w-5 h-5" style={{ color: iconColor }} strokeWidth={2} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[15px] font-bold text-[#1A1A1A] leading-tight truncate">{label}</span>
          {subtitle && <span className="text-[12px] text-[#999] mt-0.5">{subtitle}</span>}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-[#CCCCCC] shrink-0 ml-2" strokeWidth={2} />
    </Link>
  );
}

function MenuDiv() {
  return <div className="ml-[72px] h-[1px] bg-[#F5F5F5]" />;
}
