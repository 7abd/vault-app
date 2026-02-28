
import {  useState } from "react";
import { useAuth } from "@/lib/context/authContext";
import VaultModal from "./vault/vaultModal";
import { VaultEntry } from "@/lib/types";
import VaultView from "./vault/vaultView";
import VaultCard from "./vault/vaultCard";


export default function Dashboard() {
  const [isOpen, setIsOpen] = useState <boolean> (false);
  const [vaultItem ,setVaultItem] = useState<VaultEntry | null>(null);
  const [vaultOpen ,setVaultOpen] = useState<boolean>(true)
  const {user,vaultItems} = useAuth();

const vaultCards = vaultItems?.map((item) => {

  return <VaultCard
  key={item.id} 
  vaultItem={item}
  onClick={() => {
  setVaultItem(item)
  setVaultOpen(false)
}}
/>
})


  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-white font-sans">
      
    

      <main className="flex-1 p-10 overflow-y-auto">
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-gray-200">Vault Dashboard</h1>
            <div className="mt-4">
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-teal-400 text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
      >
        + Add New Item
      </button>

      <VaultModal isOpen={isOpen} setIsOpen={setIsOpen} />
      
    </div>
     </div>
         <div className="flex items-center gap-3 bg-gray-800/30 px-4 py-2 rounded-full border border-gray-700/50">
            <span className="text-coral-400 text-lg">🔒</span>
            <span className="text-sm text-gray-400">Hi, <span className="text-teal-400 font-medium">{user?.full_name.split(" ")[0] || "Username"}</span></span>
 
          </div>
        </header>

        {!vaultOpen && <VaultView  vaultItem={vaultItem} setVaultOpen={setVaultOpen}/>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
     
        { vaultOpen && vaultCards}
        </div>
      </main>
    </div>
  );
}


