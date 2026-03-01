import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { createClient } from "../supabase/SupabaseClient"
import type { Session } from "@supabase/supabase-js"
import type { AuthContextType,User,VaultEntry, } from "../types"



const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [authInitializing, setAuthInitializing] = useState(true)
const [user, setUser] = useState<User | null>(null)
const [vaultItems ,setVaultItems] = useState <VaultEntry[] | null>([])


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
  }, [supabase.auth])

  useEffect(() => {
    let isMounted = true;
  
    async function syncProfile() {
      const userId = session?.user?.id;
  
      if (!userId) {
        if (isMounted) setUser(null);
        return;
      }
  
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
  
      if (isMounted && !error) {
        setUser(profile);
      }
    }
  
    syncProfile();
  
    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, supabase]);




useEffect(() => { 
  if (user?.id) { 
  
const fetchVaultItems = async () => {
  const { data, error } = await supabase
    .from("vault_items")
    .select("*")
    .eq("user_id", user?.id);

  if (!error && data) {
    setVaultItems(data);
  }
};
  fetchVaultItems(); } 
},[user?.id,supabase]);


  return (
    <AuthContext.Provider value={{setVaultItems,vaultItems, user, session, authInitializing }}>
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
