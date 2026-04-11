'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import toast from 'react-hot-toast';

export default function CapacitorBackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const backPressCount = useRef(0);

  useEffect(() => {
    // Only run on native mobile platforms (Android/iOS)
    if (!Capacitor.isNativePlatform()) return;

    const listener = CapacitorApp.addListener('backButton', (info) => {
      // If we are on the home screen, prompt to exit
      if (pathname === '/') {
        backPressCount.current += 1;
        
        if (backPressCount.current === 1) {
          toast('Гарах бол дахин дарна уу.', {
            icon: '👋',
            style: {
              background: '#333',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '500',
              borderRadius: '24px',
            },
            duration: 2000,
          });
          
          setTimeout(() => {
            backPressCount.current = 0;
          }, 2000);
        } else if (backPressCount.current === 2) {
          CapacitorApp.exitApp();
        }
      } else {
        // If it's a regular page, use Next.js router to go back
        if (info.canGoBack) {
          router.back();
        } else {
          // If native history is empty but we aren't on home, navigate root
          router.push('/');
        }
      }
    });

    return () => {
      listener.then(l => l.remove());
    };
  }, [router, pathname]);

  return null;
}
