"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SettingsContextType } from "../types";
import { useVaultCtx } from "./vaultContext";
import { useInactivityTimer } from "../hooks/useInactivityTimer";

const settingsContext = createContext< SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isLight, setIsLight] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [lockTimer ,setLockTimer] = useState<number>(5)
  const {lockVault} = useVaultCtx();
 console.log(lockTimer)
  useEffect(() => {
    const savedTheme = localStorage.getItem("vault-theme-is-light");
    const savedLockTimer=  localStorage.getItem("vault-lock-timer");
    setTimeout(() => {
      if (savedTheme !== null) setIsLight(savedTheme === "true");
      if (savedLockTimer !== null) setLockTimer(Number(savedLockTimer));
      setMounted(true);
    }, 0);
  }, []);
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    if (isLight) {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }

    localStorage.setItem("vault-theme-is-light", String(isLight));
  }, [isLight, mounted]);
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("vault-lock-timer", String(lockTimer));
  }, [lockTimer, mounted]);

  const toggleTheme = () => setIsLight(!isLight);
  useInactivityTimer(lockVault,lockTimer)

  return (
    <settingsContext.Provider value={{lockTimer,setLockTimer, isLight, toggleTheme, mounted }}>
      {children}
    </settingsContext.Provider>
  );
}

export const useSettingsCtx = () => {
  const context = useContext(settingsContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};