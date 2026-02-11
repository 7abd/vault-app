import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { createClient } from "./supabase/SupabaseClient"
import type { Session } from "@supabase/supabase-js"

type AuthContextType = {
  session: Session | null
  user: User | null
  authInitializing: boolean
  
}
export type User = {
  id: string
  email: string
  full_name: string
  avatar_url: string
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [authInitializing, setAuthInitializing] = useState(true)
const [user, setUser] = useState<User | null>(null)

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthInitializing(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])
const userProfile = async () => {
  if (session) { 
    const { data: profile } = await supabase .from("profiles") .select("*") .eq("id", session.user.id) .single();
    setUser(profile);
  } else {
    setUser(null);
  }
}
useEffect(() => {
  userProfile();
}, [session])
  return (
    <AuthContext.Provider value={{ user, session, authInitializing }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
