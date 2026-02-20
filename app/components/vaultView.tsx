'use client'
import { useVaultCtx } from "@/lib/vaultContext"
import { VaultEntry } from "@/lib/types";


export default function VaultView({ vaultItem, setVaultOpen }: { 
  vaultItem: VaultEntry | null; 
  setVaultOpen: (open: boolean) => void 
}) {
    const { error } = useVaultCtx()
  
   
  
  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 rounded-2xl border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">{vaultItem?.title || 'Vault Item'}</h2>
        <button onClick={() => setVaultOpen(false)} className="text-gray-400 hover:text-white">
          Close
        </button>
      </div>

      <div className="bg-black/20 p-4 rounded-lg border border-gray-800 min-h-[100px]">
        {error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <p className="text-gray-300 font-mono break-all">
             Decrypting...
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <button className="flex-1 bg-teal-400 text-black py-2 rounded-lg font-bold">
          Update
        </button>
        <button className="flex-1 border border-red-500/50 text-red-500 py-2 rounded-lg">
          Delete
        </button>
      </div>
    </div>
  )
}