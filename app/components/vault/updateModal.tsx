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
      if (isTimeLocked || !isUnlocked) {
        setError('You cannot update your vault now, please wait until it is unlocked.')
        setTimeout(() => clearError(), 2000);
        return
      }
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <form onSubmit={handleUpdate} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 w-full max-w-md space-y-4">
          <h3 className="text-white font-bold text-lg">Update {vaultItem?.type}</h3>
          
       {(error) ? ( <p className="text-red-400 text-sm"> {error} </p> )
      :(vaultItem?.type !== 'image' ? (
            <textarea
              value={updatedContent || ''}
              onChange={(e) => setUpdatedContent(e.target.value)}
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 h-32 text-white outline-none focus:border-teal-400"
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 text-gray-400"
            />
          ))}
  
          <div className="flex gap-3">
            <button type="button" onClick={() => setUpdateOpen(false)} className="flex-1 bg-gray-800 text-white py-3 rounded-xl">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isTimeLocked || isUpdating }
              className="flex-1 bg-teal-400 text-black py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
        {error && (
          <p className="text-red-400 text-sm animate-pulse">{error}</p>)}
      </div>
    )
}