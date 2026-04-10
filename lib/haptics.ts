import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.warn('Haptics failed', error);
    }
  }
};

export const hapticSuccess = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.notification({ type: 'SUCCESS' as any });
    } catch (error) {
      console.warn('Haptics notification failed', error);
    }
  }
};
