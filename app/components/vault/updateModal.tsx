import { useState,JSX } from "react"
import { VaultEntry } from "@/lib/types";
import { useVaultCtx } from "@/lib/context/vaultContext";
import { encryptWithKey, fileToBase64 } from "@/lib/crypto";
import { createClient } from "@/lib/supabase/SupabaseClient";

export default function UpdateModal({vaultItem,initialContent,setUpdateOpen,isTimeLocked}: 
    {
        vaultItem: VaultEntry | null;
        initialContent: string | null;
        setUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>;
        isTimeLocked:boolean;
    }): JSX.Element {
        const [updatedContent ,setUpdatedContent] = useState<string | null>(initialContent)
        const [isUpdating,setIsUpdating] = useState<boolean>(false)
        
        const { withDecrypted, setError, error,isUnlocked,clearError} = useVaultCtx()
        const supabase = createClient()
      
        const handleUpdate = async (e: React.FormEvent) => {
            e.preventDefault();
       if(!vaultItem || !updatedContent) return
       if (isTimeLocked || !isUnlocked) return;
       setIsUpdating(true)
       try {

        const encryptionResult = await withDecrypted(async (key) => {
           return await encryptWithKey(updatedContent,key)
        })
       if(!encryptionResult) setError('Encryption faild');
          setTimeout(() => clearError(), 2000);
            const {error :updateError} = await supabase.from('vault_items').update({
                encrypted_content: encryptionResult?.encrypted_content,
                encryption_iv: encryptionResult?.encryption_iv
            })
            .eq('id', vaultItem.id);
            if(updateError) setError(updateError.message)
                alert('vault upadated successfully')
            setUpdateOpen(false)
            window.location.reload();
        } catch(err:any) {
            setError(err.message)
        setTimeout(() => clearError(), 2000);

        } finally {
            setIsUpdating(false)
        }
        }

    async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]
      if (!file) return
    
      
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large")
        return
      }
    
      const base64 = await fileToBase64(file)
    
      setUpdatedContent(base64)
    }

    return(    
    <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <form onSubmit={handleUpdate} className="bg-sidebar p-6 rounded-2xl border border-foreground/10 w-full max-w-md space-y-4 shadow-2xl transition-all duration-300">
          <h3 className="text-foreground font-black text-xl tracking-tight">Update {vaultItem?.type}</h3>
          
       {(error) ? ( <p className="text-red-400 text-sm"> {error} </p> )
          :(vaultItem?.type !== 'image' ? (
            <textarea
              value={updatedContent || ''}
              onChange={(e) => setUpdatedContent(e.target.value)}
              className="w-full bg-background p-4 rounded-2xl border 
              border-foreground/10 h-40 text-foreground outline-none focus:border-teal-400 transition-all
               resize-none font-mono text-sm shadow-inner"    />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
               className="w-full bg-background p-3 rounded-2xl border 
                     border-foreground/10 text-foreground/60 text-sm file:mr-4 file:py-1 
                     file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold
                   file:bg-teal-400/10 file:text-teal-500
                   hover:file:bg-teal-400/20 transition-all cursor-pointer"
            />
          ))}
  
          <div className="flex gap-3">
            <button type="button" onClick={() => setUpdateOpen(false)}  
             className="flex-1 bg-foreground/5 text-foreground/70 py-3.5 rounded-2xl 
                font-semibold hover:bg-foreground/10 transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isTimeLocked || isUpdating }
             className="flex-1 bg-teal-400 text-black py-3.5 rounded-2xl font-bold
               hover:bg-teal-300 transition-all shadow-lg shadow-teal-400/20 
               disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    )
}