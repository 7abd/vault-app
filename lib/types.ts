import type { Session } from "@supabase/supabase-js"
import type React from "react"

export type User = {
  id: string
  email: string
  full_name: string
  avatar_url: string
}

export interface VaultEntry {
  id: string
  user_id: string
  title: string
  type: string
  encrypted_content: string
  encryption_iv: string
  next_unlock_at: string
  duration_minutes: number
  frequency: string
  created_at: string
}

export type VaultItemContent = {
  title: string
  type: string
  duration: number
}

export type AuthContextType = {
  session: Session | null
  user: User | null
  authInitializing: boolean
  vaultItems:VaultEntry[] | null
  setVaultItems: React.Dispatch<React.SetStateAction<VaultEntry[] | null>>
  fetchVaultItems: () => Promise<void>
  

}

export type VaultState = {
  isUnlocked: boolean;
  cryptoKey: CryptoKey | null;
  error: string | null;
  isLoading: boolean;
};

export type VaultActions = {
  unlockVault: (masterPassword: string) => Promise<boolean>;
 lockVault: () => void;
clearError: () => void;
withDecrypted: <T>(fn: (key: CryptoKey) => Promise<T>) => Promise<T | null>;
createVaultMetadata: (password: string) => Promise<{  isNew: boolean }>;
setError: React.Dispatch<React.SetStateAction<string | null>>;

};

export type VaultContextType = VaultState & VaultActions;


 export type Content = {
  title: string 
   secretMsg : string 
   duration : number
   type: 'note' | 'password' | 'image'
   frequency:string
 }