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


