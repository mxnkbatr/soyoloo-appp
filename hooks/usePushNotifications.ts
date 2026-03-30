'use client';

import { useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { useUser } from '@/context/AuthContext';

export const usePushNotifications = () => {
    const { isSignedIn } = useUser();

    const registerToken = useCallback(async (token: string) => {
        try {
            await fetch('/api/notifications/register-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    platform: Capacitor.getPlatform(),
                }),
            });
        } catch (error) {
            console.error('FCM: Token registration failed:', error);
        }
    }, []);

    useEffect(() => {
        // Only run on native platforms (iOS/Android) and when user is signed in
        if (!isSignedIn || !Capacitor.isNativePlatform()) return;

        const initPush = async () => {
            const { PushNotifications } = await import('@capacitor/push-notifications');

            // Check permissions
            let permStatus = await PushNotifications.checkPermissions();

            if (permStatus.receive === 'prompt') {
                permStatus = await PushNotifications.requestPermissions();
            }

            if (permStatus.receive !== 'granted') {
                console.warn('FCM: Push permission not granted');
                return;
            }

            // Register with FCM
            await PushNotifications.register();

            // Listeners
            const registrationListener = await PushNotifications.addListener('registration', (token) => {
                console.log('FCM: Token received:', token.value);
                registerToken(token.value);
            });

            const errorListener = await PushNotifications.addListener('registrationError', (err) => {
                console.error('FCM: Registration error:', err);
            });

            const actionListener = await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
                console.log('FCM: Action performed:', action);
                const url = action.notification.data?.url;
                if (url) {
                    window.location.href = url;
                }
            });

            return () => {
                registrationListener.remove();
                errorListener.remove();
                actionListener.remove();
            };
        };

        const cleanup = initPush();
        return () => {
            cleanup.then(fn => fn?.());
        };
    }, [isSignedIn, registerToken]);
};
