'use client'
import { useState } from "react"
import { encryptWithKey , deriveVerifier,generateSalt, bufferToBase64 } from "@/lib/crypto"
import { createClient } from "@/lib/supabase/SupabaseClient"

export default function UnlockVaultModal() {
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
const supabase = createClient();
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error("Get user error:", error)
    return
  }

  const salt = generateSalt()
  const saltBase64 = bufferToBase64(salt)
  const verifier = await deriveVerifier(password, saltBase64)
  

  console.log("Existing verifier:", user?.user_metadata?.vault_verifier)

  if (!user?.user_metadata?.vault_verifier) {
    const { data: updatedUser, error: updateError } = await supabase.auth.updateUser({
      data: {
        vault_salt: saltBase64,
        vault_verifier: verifier
      }
    })

    console.log("Update result:", updatedUser)
    if (updateError) console.error("Update error:", updateError)
  }
}

    

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60  backdrop-blur-md" 
      />

      <div className="relative bg-gray-900 border border-gray-800 p-8
       rounded-2xl w-full max-w-sm shadow-2xl">
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
            Invalid password. Please try again.</p>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              className="flex-1 bg-gray-800 text-gray-300 py-3
               rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-teal-400 text-black py-3 
              rounded-xl font-bold hover:bg-teal-300 
              transition-colors disabled:opacity-50"
            >
              {loading ? "Unlocking..." : "Unlock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}