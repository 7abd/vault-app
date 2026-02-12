
import { useState } from "react";
import { useAuth } from "@/lib/context";
import VaultModal from "./vaultModal";


export default function Dashboard() {
  const [isOpen, setIsOpen] = useState <boolean> (false);

  const {user,vaultItems} = useAuth()
  
  console.log(vaultItems);
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

      <VaultModal isOpen={isOpen} setIsOpen={setIsOpen} setItemId={setItemId} />
      
    </div>
  

        
            </div>
        
          
          <div className="flex items-center gap-3 bg-gray-800/30 px-4 py-2 rounded-full border border-gray-700/50">
            <span className="text-coral-400 text-lg">🔒</span>
            <span className="text-sm text-gray-400">Hi, <span className="text-teal-400 font-medium">{user?.full_name.split(" ")[0] || "Username"}</span></span>
 
          </div>
        </header>

        <p className="text-xs text-gray-500 uppercase tracking-widest mb-6 font-semibold">Frequency</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <VaultCard 
            title="Holiday Photos" 
            status="Unlocks Dec 23, 2024" 
            isLocked 
          />
          <VaultCard 
            title="Private Key" 
            status="Opens in 3 days" 
            isLocked 
          />
          <VaultCard 
            title="Holiday Photos" 
            status="Unlocks Dec 23, 2024" 
            isLocked 
          />
           <VaultCard 
            title="Private Recipe" 
            status="Opens in 5.8 days" 
            isLocked 
          />

          <VaultCard 
            title="Secret Recipe" 
            status="Next: Nov 1, 2026" 
            isBlurred 
            bgImage="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200"
          />
          <VaultCard 
            title="Secret Recipe" 
            status="Next: Feb 20, 2025" 
            isBlurred 
            hasCheck
          />
        </div>
      </main>
    </div>
  );
}



function VaultCard({ title, status, isLocked, isBlurred, bgImage, hasCheck }: any) {
  return (
    <div className="relative group overflow-hidden rounded-3xl aspect-[4/5] 
    bg-gradient-to-b from-gray-800/40 to-gray-900/40 border border-white/5 p-6 flex 
    flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] cursor-pointer shadow-2xl">
      
      {bgImage && (
        <img src={bgImage} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm" alt="" />
      )}

      <div className={`z-10 flex flex-col items-center ${isBlurred ? 'backdrop-blur-md bg-black/20 w-full h-full justify-center rounded-2xl' : ''}`}>
        
        {isLocked && (
          <div className="mb-6 text-6xl drop-shadow-[0_0_15px_rgba(251,113,133,0.4)]">
            <span className="text-[#fb7185]">🔒</span>
          </div>
        )}

        {hasCheck && (
           <div className="absolute top-4 right-4 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center border-2 border-[#0a0a0c]">
             <span className="text-[10px] text-white">✓</span>
           </div>
        )}

        <h3 className="text-sm font-semibold text-gray-200 mt-2">{title}</h3>
        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">{status}</p>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent 
      opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
