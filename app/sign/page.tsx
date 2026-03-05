"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/authContext"
import { createClient } from "@/lib/supabase/SupabaseClient"
import { useSearchParams } from "next/navigation"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()
  const supabase = createClient()
  const { session, authInitializing } = useAuth()
  const searchParams = useSearchParams()
const signupSuccess = searchParams.get("signup") === "success"


  useEffect(() => {
    if (session) {
      router.replace("/")
    }
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)
    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setSubmitting(false)
    }
  }

  if (authInitializing) {
    return (
      <main className="flex justify-center items-center min-h-screen text-foreground bg-background">
        <p className="animate-pulse">Loading...</p>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 p-10 rounded-2xl shadow-2xl bg-sidebar  border border-foreground/5 ">

        <h2 className="text-3xl font-extrabold text-foreground text-center">
          Sign in to Your Vault
        </h2>

        { signupSuccess && (
          <p className="bg-green-500/10 text-green-500 p-3 rounded-md text-center border border-green-500/20 text-sm">

            ✅ Account created successfully!
            <span className="block mt-1 opacity-80">Please verify your email</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-background text-foreground border border-foreground/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
            />

          <input
            type="password"
            required
            placeholder="Master Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-background text-foreground border border-foreground/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
            />

          {errorMsg && (
            <p className="text-red-500 text-xs pl-1 font-medium">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl py-3 shadow-lg shadow-teal-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-forground/50 text-sm text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/sign/signUp" className="text-teal-400 font-semibold hover:underline decoration-2 underline-offset-4">
            Create a Secure Vault
          </Link>
        </p>
      </div>
    </div>
  )
}
