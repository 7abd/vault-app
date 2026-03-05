'use client'
import { useState } from "react"
import { useVaultCtx } from "@/lib/context/vaultContext"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/authContext"


type Password = {
  password: string
  confirmPassword: string
}

export default function SetUpPassword() {
  const [passwordField, setPasswordField] = useState<Password>({ password: '', confirmPassword: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { createVaultMetadata } = useVaultCtx()
  const router = useRouter()
  const {session} = useAuth()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordField((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null)
      if (!session) {
        router.push('/sign');
        return;
      }
      
    
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
      const {  isNew } = await createVaultMetadata(passwordField.password);
      if (!isNew) {
        setError('You have already set up your password')
      } else {
         router.push('/')
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/40  backdrop-blur-md" />

      
      <div className="relative bg-sidebar border border-foreground/10 p-8 rounded-2xl w-full max-w-sm shadow-2xl transition-colors duration-300">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-400  text-black font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
          New Vault
        </div>

        <h2 className="text-xl font-bold mb-1 text-foreground">Create Vault Password</h2>
        <p className="text-foreground/40 text-sm mb-6">Set a strong password to encrypt your files.</p>
        
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
              className="w-full bg-background p-3 rounded-lg border border-foreground/10 text-foreground outline-none focus:border-teal-400 transition-all placeholder:text-foreground/30"
            />

            <input
              type="password"
              name="confirmPassword"
              value={passwordField.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full bg-background p-3 rounded-lg border border-foreground/10 text-foreground outline-none focus:border-teal-400 transition-all placeholder:text-foreground/30"
            />
          </div>

          <div className="flex gap-1 px-1">
            <div className={`h-1 flex-1 rounded-full ${passwordField.password.length > 0 ? 'bg-teal-400' : 'bg-gray-700'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${passwordField.password.length > 5 ? 'bg-teal-400' : 'bg-gray-700'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${passwordField.password.length > 8 ? 'bg-teal-400' : 'bg-gray-700'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${/\d/.test(passwordField.password) ? 'bg-teal-400' : 'bg-gray-700'}`}></div>
          </div>
          <p className="text-[11px] text-foreground/40 pl-1 font-medium">Use at least 8 characters with numbers.</p>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              className="flex-1 bg-foreground/5 text-foreground py-3 rounded-xl hover:bg-foreground/10 transition-colors font-medium"
              onClick={()=> router.back()}
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-400 py-3 text-black rounded-xl font-bold hover:bg-teal-300 transition-all shadow-lg shadow-teal-400/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[o.98]"
            >
              {loading ? 'Initializing...' : 'Initialize'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}