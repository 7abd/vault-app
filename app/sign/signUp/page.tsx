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

    const { data, error } = await supabase.auth.signUp({
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
      router.push("/?signup=success")


    }

    
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-10 rounded-xl shadow-2xl bg-gray-800 border border-teal-500/20">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <h2 className="mt-6 text-3xl font-extrabold text-white">Create Your Account</h2>
          <p className="mt-2 text-sm text-gray-400">Join the secure vault network.</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500 text-red-500 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input id="name" name="name" type="text" onChange={handleChange} required className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-gray-700/50 sm:text-sm" placeholder="Full Name" />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input id="email" name="email" type="email" onChange={handleChange} required className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-gray-700/50 sm:text-sm" placeholder="Email address" />
            </div>

            <div>
              <label htmlFor="password" title="Master Password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" onChange={handleChange} required className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-gray-700/50 sm:text-sm" placeholder="Master Password" />
            </div>

            <div>
              <label htmlFor="confPassword" title="Confirm Password" className="sr-only">Confirm Password</label>
              <input id="confPassword" name="confPassword" type="password" onChange={handleChange} required className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-gray-700/50 sm:text-sm" placeholder="Confirm Password" />
            </div>
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