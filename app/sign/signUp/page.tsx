'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/SupabaseClient"


type userInfo = {
  name:string  
  email: string
  password:string 
  confPassword:string

}

export default function SignUp() {
  const [userInfo, setUserInfo] = useState<userInfo>({ name: '', email: '', password: '', confPassword: '' })
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    if (userInfo.confPassword !== userInfo.password) {
      setErrorMsg("Passwords do not match!")
      setLoading(false)
      return
    }
    if (userInfo.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      setLoading(false)
      return
    }
    if (!/\d|[^a-zA-Z]/.test(userInfo.password)) {
      setErrorMsg("Password must contain a number or special character")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email: userInfo.email,
      password: userInfo.password,
      options: {
        data: {
          full_name: userInfo.name,
        },
      },
    })

    if (error) {
      setErrorMsg(`Authentication error: ${error.message}`)
      setLoading(false)
      return
    } else {
        setErrorMsg(null)
      localStorage.setItem("signUp_success", "1")
      router.push("/sign?signup=success")


    }
    
    
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 p-10 rounded-2xl shadow-2xl bg-sidebar border border-foreground/5">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">Create Your Account</h2>
          <p className="mt-2 text-sm text-foreground/50">Join the secure vault network.</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500 text-red-500 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-3">
            {[
              { id: "name", name: "name", type: "text", placeholder: "Full Name" },
              { id: "email", name: "email", type: "email", placeholder: "Email address" },
              { id: "password", name: "password", type: "password", placeholder: "Master Password" },
              { id: "confPassword", name: "confPassword", type: "password", placeholder: "Confirm Password" }
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="sr-only">{field.placeholder}</label>
                <input 
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  onChange={handleChange}
                  required 
                  className="appearance-none relative block w-full px-4 py-3 border border-foreground/10 placeholder-foreground/40 text-foreground rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-background sm:text-sm transition-all" 
                  placeholder={field.placeholder} 
                />
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      
      </div>
    </div>
  )
}