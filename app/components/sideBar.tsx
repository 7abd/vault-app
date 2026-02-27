'use client'
import { useAuth } from "@/lib/context/authContext";
import Link from "next/link";
import { createClient } from "@/lib/supabase/SupabaseClient";
import { useVaultCtx } from "@/lib/context/vaultContext";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Lock, Unlock, LogOut ,AtSignIcon} from "lucide-react"; 

const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.trim().split(" ").map(p => p[0].toUpperCase()).join("").slice(0, 2);
};

export default function SideBar() {

   const { session ,user } = useAuth();
   const {isUnlocked} = useVaultCtx();
    const supabase = createClient();
    const router = useRouter();
    const pathname = usePathname();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/sign');
    };

    const linkStyle = (path: string) => `
        flex items-center p-3 rounded-lg font-medium transition duration-150 group
        ${pathname === path ? 'bg-teal-600/20 text-white' : 'text-gray-300 hover:bg-gray-800'}
    `;

    return (
        <nav className="fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r 
        border-gray-800 p-6 flex flex-col justify-between z-30">
            <div>
                <div className="text-3xl font-extrabold mb-10">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
                        Vault App
                    </span>
                </div>

                <ul className="space-y-2">
                    <li>
                        <Link href="/" className={linkStyle('/')}>
                            <LayoutDashboard className="h-5 w-5 mr-3 text-teal-400" />
                            My Vault
                        </Link>
                    </li>

                    <li>
                        <Link href="/settings" className={linkStyle('/settings')}>
                            <Settings className="h-5 w-5 mr-3" />
                            Settings
                        </Link>
                    </li>

                    <li>
                        <Link href="/password" className={linkStyle('/password')}>
                            {isUnlocked ? (
                                <><Lock className="h-5 w-5 mr-3 text-red-400" /> Lock Vault</>
                            ) : (
                                <><Unlock className="h-5 w-5 mr-3 text-teal-400" /> Unlock Vault</>
                            )}
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center space-x-3 p-2">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-teal-600 flex items-center 
                    justify-center font-semibold text-white">
                        {getInitials(user?.full_name)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.full_name || 'Guest'}
                        </p>

                        {session ? (
                           <button
                           onClick={handleSignOut}
                           className="flex items-center text-xs text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                       >
                           <LogOut className="h-3 w-3 mr-1" />
                           Sign Out
                       </button>
                        ) : (
                            <Link href="/sign" className="text-xs flex items-center text-teal-400 hover:text-teal-300">
                                <AtSignIcon  className="h-3 w-3 mr-1"/>
                                Sign In
                            </Link>
                        )}
                       
                    </div>
                </div>
            </div>
        </nav>
    );
}