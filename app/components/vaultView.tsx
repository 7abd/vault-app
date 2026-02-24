'use client'
import { useVaultCtx } from "@/lib/vaultContext"
import { VaultEntry } from "@/lib/types";
import { useState, useEffect,useMemo } from "react";
import { decryptWithKey } from "@/lib/crypto";
import { createClient } from "@/lib/supabase/SupabaseClient";
import UpdateModal from "./updateModal";


export default function VaultView({ vaultItem, setVaultOpen }: { 
  vaultItem: VaultEntry | null; 
  setVaultOpen: (open: boolean) => void 
}) {
  const [content, setContent] = useState<string | null>(null)
  const { withDecrypted, error,setError } = useVaultCtx()
  const [updateOpen,setUpdateOpen] = useState<boolean>(false)
  
  const supabase = createClient()
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
let now = new Date();

const { windowStart, windowEnd } = useMemo(() => {
  if (!vaultItem || vaultItem.frequency === 'once') {
    return { windowStart: new Date(), windowEnd: new Date() };
  }

  let start = new Date(vaultItem.created_at);
  let next = new Date(start);
  let prev = new Date(next);

  let safety = 0; 
  
  while (next <= now && safety < 1000) {
    safety++;
    prev = new Date(next);
    
    switch (vaultItem.frequency) {
      case 'hourly': next.setHours(next.getHours() + 1); break;
      case 'daily': next.setDate(next.getDate() + 1); break;
      case '2-days': next.setDate(next.getDate() + 2); break;
      case 'weekly': next.setDate(next.getDate() + 7); break;
      case '2-weeks': next.setDate(next.getDate() + 14); break;
      case 'monthly': next.setMonth(next.getMonth() + 1); break;
      case '2-month': next.setMonth(next.getMonth() + 2); break;
      case '3-month': next.setMonth(next.getMonth() + 3); break;
      case '6-month': next.setMonth(next.getMonth() + 6); break;
      case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
      default: 
        next.setFullYear(next.getFullYear() + 100);
    }
  }

  let wStart = new Date(prev);
  let wEnd = new Date(wStart);
  wEnd.setMinutes(wEnd.getMinutes() + (vaultItem.duration_minutes || 0));

  return { windowStart: wStart, windowEnd: wEnd };
}, [vaultItem]);


const isOnce = vaultItem?.frequency === 'once';
const isLocked = !isOnce && (now < windowStart || now > windowEnd);

function displayContent() {
  const isImage = vaultItem?.type === 'image' && content;
  if (error) return <p className="text-red-400 text-sm">{error}</p>;

  return (
    <>
      {isLocked ? (
        <p className="text-gray-300 font-mono">
          {`Your vault will unlock at ${windowStart}`} 
        </p>
      ) : isImage ? (
        <img src={content} alt="Decrypted" className="rounded-lg max-h-64 mx-auto" />
      ) : (
        <p className="text-gray-300 font-mono break-all">
          {content || "Decrypting..."}
        </p>
      )}
    </>
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
      { updateOpen &&    <UpdateModal islocked={isLocked} setUpdateOpen={setUpdateOpen}  vaultItem={vaultItem}
     initialContent={content}  />}
    </div>
  )
}