import { useState, useEffect, useMemo } from 'react';
import { VaultEntry } from '../types';


export const useVaultTimer = (vaultItem: VaultEntry | null) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { windowStart, windowEnd } = useMemo(() => {
    if (!vaultItem) {
      const d = new Date();
      return { windowStart: d, windowEnd: d };
    }

    const startTs = new Date(vaultItem.created_at).getTime();
    const nowTs = now.getTime();
    const durationMs = (vaultItem.duration_minutes || 0) * 60000;

    const msMap: Record<string, number> = {
      minutely: 5 * 60000,
      hourly: 60 * 60000,
      daily: 24 * 60 * 60000,
      '2-days': 48 * 60 * 60000,
      weekly: 7 * 24 * 60 * 60000,
      '2-weeks': 14 * 24 * 60 * 60000,
    };

    let targetStart: Date;

    if (vaultItem.frequency === 'once') {
      targetStart = new Date(startTs);
    } else if (vaultItem.frequency in msMap) {
      const interval = msMap[vaultItem.frequency];
      const elapsed = nowTs - startTs;
      
      const currentCycleStart = startTs + Math.floor(elapsed / interval) * interval;
      
      if (nowTs > currentCycleStart + durationMs) {
        targetStart = new Date(currentCycleStart + interval);
      } else {
        targetStart = new Date(currentCycleStart);
      }
    } else {
      const next = new Date(startTs);
      
      while (next.getTime() + durationMs <= nowTs) {
        switch (vaultItem.frequency) {
          case 'monthly': next.setMonth(next.getMonth() + 1); break;
          case '2-month': next.setMonth(next.getMonth() + 2); break;
          case '3-month': next.setMonth(next.getMonth() + 3); break;
          case '6-month': next.setMonth(next.getMonth() + 6); break;
          case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
          default: next.setFullYear(next.getFullYear() + 100);
        }
      }
      targetStart = next;
    }

    return { 
      windowStart: targetStart, 
      windowEnd: new Date(targetStart.getTime() + durationMs) 
    };
  }, [vaultItem, now]);

  const isOnce = vaultItem?.frequency === 'once';
  const isTimeLocked = !isOnce && (now < windowStart || now > windowEnd);
  const isActive = !isOnce && (now >= windowStart && now <= windowEnd);

  const timeUntilChange = useMemo(() => {
    const diff = isTimeLocked 
      ? windowStart.getTime() - now.getTime() 
      : windowEnd.getTime() - now.getTime();

    if (diff <= 0) return "0s";

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }, [now, windowStart, windowEnd, isTimeLocked]);

  return {
    windowStart,
    windowEnd,
    isTimeLocked,
    isActive,
    timeUntilChange,
    isOnce,
    now
  };
};