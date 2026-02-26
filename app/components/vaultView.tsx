'use client'
import { useVaultCtx } from "@/lib/vaultContext"
import { VaultEntry } from "@/lib/types";
import { useState, useEffect,useMemo } from "react";
import { decryptWithKey } from "@/lib/crypto";
import { createClient } from "@/lib/supabase/SupabaseClient";
import UpdateModal from "./updateModal";
import { useVaultTimer } from "@/lib/vaultTimerLogic";
import { Copy,Check } from "lucide-react";


export default function VaultView({ vaultItem, setVaultOpen }: { 
  vaultItem: VaultEntry | null; 
  setVaultOpen: (open: boolean) => void 
}) {
  const [content, setContent] = useState<string | null>(null)
  const { withDecrypted, error,setError } = useVaultCtx()
  const [updateOpen,setUpdateOpen] = useState<boolean>(false)
  const [copied, setCopied] = useState(false)
  
  const supabase = createClient()

  const {isLocked,  windowStart, timeUntilChange} = useVaultTimer(vaultItem)
  useEffect(() => {
    if (!vaultItem) return;
    
    const handleDecrypt = async () => {
      const result = await withDecrypted(async (key) => {
        return await decryptWithKey(vaultItem.encrypted_content, vaultItem.encryption_iv, key);
      });
      setContent(result)
    };

    handleDecrypt();
  }, [vaultItem, withDecrypted]);


const handleDelete = async () => {
  const confirmDelete = confirm("Are you sure? This cannot be undone.");
  if (!confirmDelete) return;

  const { error } = await supabase
    .from('vault_items')
    .delete()
    .eq('id', vaultItem?.id);

  if (error) setError(error.message)
  else setVaultOpen(false); 
};

const handleCopy = async () => {
  if (!content) return;

    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset icon after 2s
}

function displayContent() {
  const isImage = vaultItem?.type === 'image' && content;
  if (error) return <p className="text-red-400 text-sm">{error}</p>;

  return (
    <div className="space-y-4">
      {isLocked ? (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 
        text-center">
          <p className="text-gray-400 text-sm uppercase tracking-widest
           mb-2">Vault Locked</p>
          <div className="text-3xl font-mono font-bold text-yellow-500 mb-4">
            {timeUntilChange}
          </div>
          <p className="text-gray-500 text-xs">
            Unlocks at: {windowStart.toLocaleString([], { 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      ) : (
        <div className="relative group">
          {isImage ? (
            <img src={content} alt="Decrypted" className="rounded-lg max-h-64 mx-auto" />
          ) : (
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
               <p className="text-gray-300 font-mono break-all pr-10">
                {content || "Decrypting..."}
              </p>
            </div>
          )}

          {!isImage && content && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 rounded-md bg-gray-800 
              hover:bg-gray-700 transition-colors border border-gray-600"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check size={16} className="text-green-400" />
              ) : (
                <Copy size={16} className="text-gray-400" />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
     
}
  return (
    <div 
     className="max-w-xl mx-auto p-6 bg-gray-900 rounded-2xl border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">{vaultItem?.title || 'Vault Item'}</h2>
        <button onClick={() => setVaultOpen(true)} className="text-gray-400 hover:text-white">
          Close
        </button>
      </div>

      <div className="bg-black/20 p-4 rounded-lg border border-gray-800 min-h-[100px]">
      {displayContent()}
      </div>

      <div className="mt-6 flex gap-4">
        <button  onClick={() =>setUpdateOpen(true)}
        className="flex-1 bg-teal-400 text-black py-2 rounded-lg font-bold">
          Update
        </button>
     
        <button onClick={handleDelete} className="flex-1 border border-red-500/50 text-red-500 py-2 rounded-lg">
          Delete
        </button>
      </div>
      { updateOpen &&    <UpdateModal isLocked={isLocked} setUpdateOpen={setUpdateOpen}  vaultItem={vaultItem}
     initialContent={content}  />}
    </div>
  )
}