'use client'
import { useAuth } from "@/lib/context";
import Link from "next/link";
import { createClient } from "@/lib/supabase/SupabaseClient";
import type { User } from "@/lib/types";
import { useVaultCtx } from "@/lib/vaultContext";
import { useRouter } from "next/navigation";

export default function SideBar() {

   const { session ,user } = useAuth();
   const {isUnlocked} = useVaultCtx();
    const supabase = createClient();
    const router = useRouter();

    function getInitials(user: User | null) {
    if (!user?.full_name) return "";
        const parts = user.full_name.trim().split(" ");
    return parts.map((p: string) => p[0].toUpperCase()).join("");
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/sign');
    };

 return(
        <nav className="fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between z-30">
            <div>
                <div className="text-3xl font-extrabold text-white mb-10">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">Vault App</span>
                </div>

                <ul className="space-y-2">
                    <li>
                        <Link href="/" className="flex items-center p-3 rounded-lg text-white font-medium hover:bg-teal-600/20 transition duration-150 group">
                            <svg className="h-5 w-5 mr-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-10v10a1 1 0 001 1h3m-7-2h2m-7-2h2"></path></svg>
                            My Vault
                        </Link>
                    </li>

                    <li>
                        <Link href="/settings" className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition duration-150">
                            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            Settings
                        </Link>
                    </li>

                    <li>
                        <Link 
                            href='/password'
                            className={`flex items-center p-3 rounded-lg transition duration-150 ${isUnlocked ? 'text-orange-400 hover:bg-orange-400/10' : 'text-gray-300 hover:bg-gray-800'}`}
                        >
                            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            {isUnlocked ? 'Lock Vault' : 'Unlock Vault'}
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center space-x-3 p-2">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-teal-600 flex items-center justify-center font-semibold text-white">
                        {getInitials(user)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.full_name || 'Guest User'}
                        </p>
                        {session ? (
                            <button
                                onClick={handleSignOut}
                                className="text-xs text-teal-400 hover:text-red-400 transition-colors"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link href="/sign" className="text-xs text-teal-400 hover:text-teal-300">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}