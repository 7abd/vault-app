import { VaultCardProps } from "@/lib/types";
import { useVaultTimer } from "@/lib/hooks/vaultTimerLogic";

export default function VaultCard({ vaultItem, onClick }: VaultCardProps) {
    const {isTimeLocked,windowStart,isActive,isOnce} = useVaultTimer(vaultItem)
    
    return (
      <div 
      onClick={onClick}
      className="relative group overflow-hidden rounded-3xl aspect-[4/5] 
      bg-gradient-to-b from-gray-800/40 to-gray-900/40 border border-white/5 p-6 flex 
      flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] 
      cursor-pointer shadow-2xl">
        
       
  
        <div className='mb-6 text-6xl drop-shadow-[0_0_8px_rgba(25,113,133,0.4)]'>
        {isOnce ? (
            <span className="bg-teal-500/20 text-teal-400 text-[9px] font-bold px-2 py-1 
            rounded-md border border-teal-500/30 tracking-widest uppercase">
              Permanent
            </span>
          ) : isActive && !isTimeLocked ? (
            <span className="bg-green-500/20 text-green-400 text-[9px] font-bold px-2 py-1 
            rounded-md border border-green-500/30 tracking-widest uppercase animate-pulse">
              Live Now
            </span>
          ) : null}
          
          {isTimeLocked ?(
            <div className="mb-6 text-6xl drop-shadow-[0_0_15px_rgba(251,113,133,0.4)]">
              <span className="text-[#fb7185]">🔒</span>
            </div>
          ) :  (
            <span className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]">{isOnce ? '📦' : '🔓'}</span>
          )}
  
          {isActive && (
             <div className="absolute top-4 right-4 w-6 h-6 bg-teal-500
              rounded-full flex items-center justify-center border-2 border-[#0a0a0c]">
               <span className="text-[10px] text-white">✓</span>
             </div>
          )}
  
          <h3 className="text-sm font-semibold text-gray-200 mt-2">{vaultItem?.title}</h3>
          <p className="text-[10px] text-gray-500 mt-2 uppercase">{isOnce ? "Always Available" : 
          isTimeLocked ? `Next: ${windowStart.toLocaleString()}` : `${vaultItem?.frequency} Window`}</p>
        </div>
      </div>
    );
  }
  