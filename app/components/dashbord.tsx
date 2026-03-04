
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
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-300">

      <main className="flex-1 p-10 overflow-y-auto">
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-semibold">Vault Dashboard</h1>
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
     <div className="flex items-center gap-3 bg-sidebar/50 px-4 py-2 rounded-full border border-foreground/10">
 
            <span className=" text-lg">🔒</span>
            <span className="text-sm font-bold opacity-70">Hi, <span className="text-teal-400 font-medium">{user?.full_name.split(" ")[0] || "Username"}</span></span>
 
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


