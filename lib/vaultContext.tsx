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
  const createVaultMetadata = async (password: string) => {


    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error(userError?.message || "User not found");
  
    let verifier = user.user_metadata?.vault_verifier;
  
    if (!verifier) {
      const newSalt = bufferToBase64(generateSalt());
      const newVerifier = await deriveVerifier(password, newSalt);
  
      const { error: updateError } = await supabase.auth.updateUser({
        data: { vault_salt: newSalt, vault_verifier: newVerifier }
      });
  
      if (updateError) throw updateError;
      
      return {  isNew: true };
    }
  
    return {  isNew: false };
  };

  
  const unlockVault = async (password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
  
    if (!password?.trim()) {
      setError("Password cannot be empty");
      setIsLoading(false);
      return false;
    }
  
    try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error(userError?.message || "User not found");
  
    let salt = user.user_metadata?.vault_salt;
    let verifier = user.user_metadata?.vault_verifier;
      if(!verifier) {
      setError('vault not initialized.')
      return false ;
      }
     
        const derived = await deriveVerifier(password, salt);
        if (derived !== verifier) {
          setError("Your password is incorrect, try again");
          return false;
        }
      
      const key = await deriveCryptoKey(password, salt);
      setCryptoKey(key);
      setIsUnlocked(true);
      router.push('/');
      return true;
  
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
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
         clearError,
         createVaultMetadata
        }),
        [isUnlocked, cryptoKey, error, isLoading, unlockVault, lockVault, withDecrypted,clearError,createVaultMetadata]
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
