'use client'
import { useState } from "react"
import { useVaultCtx } from "@/lib/vaultContext"
import { useRouter } from "next/navigation"


type Password = {
  password: string
  confirmPassword: string
}

export default function SetUpPassword() {
  const [passwordField, setPasswordField] = useState<Password>({ password: '', confirmPassword: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { getOrCreateVaultMetadata } = useVaultCtx()
  const router = useRouter()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordField((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null)
    
    // 1. Validation
    if (passwordField.confirmPassword !== passwordField.password) {
      return setError('Passwords do not match')
    }
    if (passwordField.password.length < 8) {
      return setError('Password must be at least 8 characters.')
    }
    if (!/\d|[^a-zA-Z]/.test(passwordField.password)) {
      return setError("Password must contain a number or special character")
    }

    setLoading(true)
    try {
      const { salt, verifier, isNew } = await getOrCreateVaultMetadata(passwordField.password);
      if (!isNew) {
        setError('You have already set up your password')
      } else {
         router.push('/dashboard')
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      
      <div className="relative bg-gray-900 border border-teal-500/30 p-8 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-400 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          New Vault
        </div>

        <h2 className="text-xl font-bold mb-1 text-white">Create Vault Password</h2>
        <p className="text-gray-400 text-sm mb-6">Set a strong password to encrypt your files.</p>
        
        {error && (
          <div className="p-3 mb-4 rounded bg-red-500/10 border border-red-500 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="password"
              name="password"
              value={passwordField.password}
              onChange={handleChange}
              placeholder="Create password"
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 text-white outline-none focus:border-teal-400 transition-colors"
            />

            <input
              type="password"
              name="confirmPassword"
              value={passwordField.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 text-white outline-none focus:border-teal-400 transition-colors"
            />
          </div>

          <div className="flex gap-1">
            <div className={`h-1 flex-1 rounded-full ${passwordField.password.length > 0 ? 'bg-teal-400' : 'bg-gray-700'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${passwordField.password.length > 5 ? 'bg-teal-400' : 'bg-gray-700'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${passwordField.password.length > 8 ? 'bg-teal-400' : 'bg-gray-700'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${/\d/.test(passwordField.password) ? 'bg-teal-400' : 'bg-gray-700'}`}></div>
          </div>
          <p className="text-[11px] text-gray-500 italic">Use at least 8 characters with numbers.</p>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-xl hover:bg-gray-700 transition-colors"
              onClick={()=> router.back()}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-400 text-black py-3 rounded-xl font-bold hover:bg-teal-300 transition-all shadow-lg shadow-teal-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Initializing...' : 'Initialize'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}