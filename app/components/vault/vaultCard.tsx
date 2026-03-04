import { VaultCardProps } from "@/lib/types";
import { useVaultTimer } from "@/lib/hooks/vaultTimerLogic";

export default function VaultCard({ vaultItem, onClick }: VaultCardProps) {
    const {isTimeLocked,windowStart,isActive,isOnce} = useVaultTimer(vaultItem)
    
    return (
      <div 
      onClick={onClick}
      className="relative group overflow-hidden rounded-3xl aspect-4/5 
      bg-sidebar border border-foreground/5 p-6 flex 
      flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02] 
      hover:border-teal-500/30 cursor-pointer shadow-xl">
        
       
        <div className="absolute top-4 left-0 right-0 flex justify-center">
        {isOnce ? (
            <span className="bg-teal-500/20 text-teal-400 border-teal-500/30
            in-[.light]:bg-teal-500/10 in-[.light]:text-teal-600 in-[.light]:border-teal-500/20
            text-[9px] font-bold px-2 py-1 rounded-md border tracking-widest uppercase"
          >
              Permanent
            </span>
              ) : isActive && !isTimeLocked ? (
        <span className="bg-green-500/20 text-green-400 border-green-500/30
          in-[.light]:bg-green-500/10 in-[.light]:text-green-600 in-[.light]:border-green-500/20
          text-[9px] font-bold px-2 py-1 rounded-md border tracking-widest uppercase animate-pulse"
        >
          Live Now
        </span>
          ) : null}
          </div>
        <div className="mb-4 flex flex-col items-center">

          {isTimeLocked ?(
            <div className="text-6xl drop-shadow-[0_0_15px_rgba(251,113,133,0.4)]">
              <span className="grayscale-[0.5] group-hover:grayscale-0 transition-all">🔒</span>
            </div>
          ) :  (
            <span className="text-6xl drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]">{isOnce ? '📦' : '🔓'}</span>
          )}
  
          {isActive && (
             <div className="absolute top-4 right-4 w-6 h-6 bg-teal-500
              rounded-full flex items-center justify-center border-2 border-background shadow-lg">
               <span className="text-[10px] text-white font-bold">✓</span>
             </div>
          )}
  
          <h3 className="text-sm font-semibold text-foreground mt-2">{vaultItem?.title}</h3>
          <p className="text-[10px] text-foreground-50 mt-2 uppercase tracking-tight">{isOnce ? "Always Available" : 
          isTimeLocked ? `Next: ${windowStart.toLocaleString()}` : `${vaultItem?.frequency} Window`}</p>
        </div>
      </div>
    );
  }
  