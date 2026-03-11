import { useEffect, useRef } from "react";

export const useInactivityTimer = (onTimeout: () => void, durationMinutes: number) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (durationMinutes > 0) {
      timerRef.current = setTimeout(onTimeout, durationMinutes * 60 * 1000);
    }
  };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    
    resetTimer(); 

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [durationMinutes, onTimeout]);
};