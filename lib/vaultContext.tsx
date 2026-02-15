import {
    createContext,
    useContext,
    useCallback,
    useState,
    useMemo,
    ReactNode,
  } from "react"
  import { createClient } from "./supabase/SupabaseClient"
import { useRouter } from "next/navigation";
import { deriveVerifier,generateSalt, bufferToBase64,deriveCryptoKey } from "@/lib/crypto"
import { VaultContextType } from "./types";



const vaultContext = createContext<VaultContextType | undefined>(undefined);


export function VaultProvider({children} : {children:ReactNode}) {
    const [isUnlocked, setIsUnlocked] = useState<boolean>(false)
    const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const supabase = createClient();
    const router = useRouter()

    
  const lockVault = useCallback(() => {
    setCryptoKey(null);
    setIsUnlocked(false);
    setError(null);
    setIsLoading(false);

  }, []);

    const unlockVault = async (password:string): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      
      if (!password || password.trim().length === 0) {
        setError(" password cannot be empty");
        setIsLoading(false)
        return false
      }
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        setError(userError.message)
        setIsLoading(false)
        return false
      }
    
      const vaultSalt = user?.user_metadata?.vault_salt;
      const vaultVerifier = user?.user_metadata?.vault_verifier
      
      if (!user?.user_metadata?.vault_verifier) {
        const salt = generateSalt()
        const saltBase64 = bufferToBase64(salt)
        const verifier = await deriveVerifier(password, saltBase64)
      
        const { data: updatedUser, error: updateError } = await supabase.auth.updateUser({
          data: {
            vault_salt: saltBase64,
            vault_verifier: verifier
          }
        })
    
        console.log("Update result:", updatedUser)
        if (updateError) {
          console.error("Update error:", updateError)
          setError(updateError.message)
          setIsLoading(false)
          return false
        }
        
        const key = await deriveCryptoKey(password, saltBase64)
        setCryptoKey(key)
        setIsUnlocked(true)
        setIsLoading(false)
        router.push('/')
        return true
      }
      
      const verifier = await deriveVerifier(password, vaultSalt)
      
      if (verifier === vaultVerifier) {
        const key = await deriveCryptoKey(password, vaultSalt)
        setCryptoKey(key)
        setIsUnlocked(true)
        setIsLoading(false)
        router.push('/')
        return true
      } else {
        setError('your password is incorrect try again')
        setIsLoading(false)
        return false
      }
    }
    const clearError = useCallback(() => {
        setError(null);
      }, []);
    const withDecrypted = useCallback(
        async <T,>(fn: (key: CryptoKey) => Promise<T>): Promise<T | null> => {
          if (!cryptoKey) {
            setError("Vault is locked. Please unlock it first.");
            return null;
          }
    
          if (!isUnlocked) {
            setError("Vault is locked. Please unlock it first.");
            return null;
          }
    
          try {
            return await fn(cryptoKey);
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : "Operation failed";
            setError(errorMessage);
            return null;
          }
        },
        [cryptoKey, isUnlocked]
      );
    
      const value: VaultContextType = useMemo(
        () => ({
          isUnlocked,
          cryptoKey,
          error,
          isLoading,
          unlockVault,
          lockVault,
          withDecrypted,
         clearError
        }),
        [isUnlocked, cryptoKey, error, isLoading, unlockVault, lockVault, withDecrypted,clearError]
      );
    
    
    return (
        <vaultContext.Provider value={value}>
            {children}
        </vaultContext.Provider>
    )
}

export function useVaultCtx () {
 const context = useContext(vaultContext)
 if(!context) {
    throw new Error ('useVaultCtx must be used inside vaultProvider')
 }
 return context
}
