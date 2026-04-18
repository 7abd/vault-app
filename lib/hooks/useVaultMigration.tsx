// hooks/useVaultMigration.ts
import { useState, useCallback } from "react";
import { useVaultCtx } from '../context/vaultContext'
import { createClient } from '../supabase/SupabaseClient'
import { deriveVerifier, deriveCryptoKey, generateSalt, bufferToBase64, encryptWithKey, decryptWithKey } from "@/lib/crypto";
import { VaultEntry } from "../types";

export const useVaultMigration = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const { isUnlocked, withDecrypted, lockVault } = useVaultCtx();
  const supabase = createClient();

  const migrateVault = useCallback(async (newPassword: string) => {
    setIsMigrating(true);
    try {
      if (isUnlocked) {
        // PATH A: RE-KEYING
        return await withDecrypted(async (oldKey) => {
          // 1. Fetch
          const { data: items, error: fetchErr } = await supabase.from("vault_items").select("*");
          if (fetchErr) throw fetchErr;

          // 2. Derive new stuff
          const newSalt = bufferToBase64(generateSalt());
          const newVerifier = await deriveVerifier(newPassword, newSalt);
          const newCryptoKey = await deriveCryptoKey(newPassword, newSalt);

          // 3. Re-encrypt
          const reEncryptedItems = await Promise.all(
            items.map(async (item: VaultEntry) => {
              const plainText = await decryptWithKey(item.encrypted_content, item.encryption_iv, oldKey);
              const newBlob = await encryptWithKey(plainText, newCryptoKey);

              return {
                ...item, 
                encrypted_content: newBlob.encrypted_content,
                encryption_iv: newBlob.encryption_iv
              };
            })
          );

          const { error: upsertErr } = await supabase
            .from("vault_items")
            .upsert(reEncryptedItems, {
              onConflict: 'id' 
            });

          if (upsertErr) {
            console.error("Detailed Upsert Error:", upsertErr.message, upsertErr.details);
            throw upsertErr;
          }
      
          const { error: updateError } = await supabase.auth.updateUser({
            data: { vault_salt: newSalt, vault_verifier: newVerifier }
          });
          if(updateError) throw updateError;
          return true;
        });
      } else {
        // PATH B: HARD RESET
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from("vault_items").delete().eq("user_id", user?.id);
        
        const newSalt = bufferToBase64(generateSalt());
        const newVerifier = await deriveVerifier(newPassword, newSalt);
        
        const { error: updateError } = await supabase.auth.updateUser({
          data: { vault_salt: newSalt, vault_verifier: newVerifier }
        });
        if(updateError) throw updateError;

        lockVault();
        return true;
      }
    } catch (err) {
      console.error("Migration error:", err);
      throw err;
    } finally {
      setIsMigrating(false);
    }
  }, [isUnlocked, withDecrypted, lockVault, supabase]);

  return { migrateVault, isMigrating };
};