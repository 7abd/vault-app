'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useVaultCtx } from "@/lib/vaultContext"
export default function UnlockVaultModal() {

  const router = useRouter()
  const [password, setPassword] = useState<string>("")
  const {error,isLoading,unlockVault,isUnlocked,lockVault} = useVaultCtx()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await unlockVault(password);

  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60  backdrop-blur-md" 
      />

      <div className="relative bg-gray-900 border border-gray-800 p-8
       rounded-2xl w-full max-w-sm shadow-2xl">
        {!isUnlocked? (
          <>
          <h2 className="text-xl font-bold mb-4 text-white">Unlock Vault</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter vault password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 p-3 rounded-lg border 
                  border-gray-700 text-white outline-none focus:border-teal-400 
                  transition-colors"
                />

                <p className="text-red-400 text-sm">
                  {error}</p>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    className="flex-1 bg-gray-800 text-gray-300 py-3
                    rounded-xl hover:bg-gray-700 transition-colors"
                    onClick={() => router.push('/')}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-teal-400 text-black py-3 
                    rounded-xl font-bold hover:bg-teal-300 
                    transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Unlocking..." : "Unlock"}
                  </button>
                </div>
              </form>
          </>
        ):(
          <div className="py-4 text-center">
          <div className="w-16 h-16 bg-teal-400/20 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Vault Unlocked</h2>
          <p className="text-gray-400 mb-8">You now have access to your secure files.</p>
          
          <div className="flex gap-3 mt-4">
            <button
             onClick={() => router.back()}
              type="button"
              className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
        
            <button
             onClick={() => lockVault()}
              type="button"
              className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-3 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all"
            >
              Lock Vault
            </button>
          </div>
        </div>
        )}
      
      </div>
    </div>
  )
}