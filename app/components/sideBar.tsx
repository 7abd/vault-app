import { useAuth } from "@/lib/context";
import Link from "next/link";
import { createClient } from "@/lib/supabase/SupabaseClient";
import type { User } from "@/lib/types";

export default function SideBar() {

   const { session ,user } = useAuth();
   const supabase = createClient();
   function getInitials(user: User | null) {    
    if (!user?.full_name) return "";
    const parts = user.full_name.trim().split(" ");
    return parts.map((p: string) => p[0].toUpperCase()).join("");
  }
  
  const initials = getInitials(user);
  
    return(
       <nav className="fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between z-30">
    <div>
        <div className="text-3xl font-extrabold text-white mb-10">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">Vault App</span>
        </div>

        <ul className="space-y-2">
            <li>
                <a href="/dashboard" className="flex items-center p-3 rounded-lg text-white font-medium bg-teal-600 hover:bg-teal-700 transition duration-150">
                    <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-10v10a1 1 0 001 1h3m-7-2h2m-7-2h2"></path></svg>
                    My Vault
                </a>
            </li>
            <li>
                <a href="/add-item" className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition duration-150">
                    <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    New Capsule
                </a>
            </li>
            <li>
                <a href="/settings" className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition duration-150">
                    <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35-.426.427-.692 1.947-1.066 2.572-.94 1.543.826 3.31 2.37 2.37a1.724 1.724 0 002.573 1.066c1.756-.426 1.756-2.924 0-3.35-.426-.427-.692-1.947-1.066-2.572-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.573 1.066c1.756-.426 1.756-2.924 0-3.35-.426-.427-.692-1.947-1.066-2.572-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.573 1.066z"></path></svg>
                    Settings
                </a>
            </li>
        </ul>
    </div>

    <div className="border-t border-gray-800 pt-4">
        <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition duration-150 cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center font-semibold text-white">
                {initials}
            </div>
            <div>
  <p className="text-sm font-medium text-white text-ellipsis overflow-hidden whitespace-nowrap max-w-[150px] 
  truncate hover:max-w-full transition-all duration-300">{user?.full_name || 'guest'}  </p>
  {session ? (
    <div className="flex items-center space-x-2 hover:bg-gray-800 rounded-lg transition duration-150 cursor-pointer">
      
    
      <button
        className="text-lg text-teal-400 hover:text-coral-400 mt-2 hover:scale-105 transition"
        onClick={() => supabase.auth.signOut()}
      >
        Log Out
      </button>
    </div>
  ) : (
    <div className="flex items-center space-x-2">
      <Link
        href="/sign"
          className="text-lg text-teal-400 hover:text-coral-400 mt-2 hover:scale-105 transition"
      >
        Sign In
      </Link>
    </div>
  )}
</div>
</div>
</div>
</nav>
    )
}