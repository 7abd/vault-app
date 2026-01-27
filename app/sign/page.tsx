"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/supabase/context"
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
      <main className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md space-y-8 p-10 rounded-xl shadow-2xl bg-gray-800 border border-teal-500/20">

        <h2 className="text-3xl font-extrabold text-white text-center">
          Sign in to Your Vault
        </h2>

        { signupSuccess && (
          <p className="bg-green-100 text-green-800 p-3 rounded-md text-center">
            ✅ Account created successfully!
            <span className="block mt-2">Please verify your email</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-700/50 text-white border border-gray-700"
          />

          <input
            type="password"
            required
            placeholder="Master Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-700/50 text-white border border-gray-700"
          />

          {errorMsg && (
            <p className="text-red-500 text-sm">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md py-2 disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/sign/signUp" className="text-teal-400">
            Create a Secure Vault
          </Link>
        </p>
      </div>
    </div>
  )
}
