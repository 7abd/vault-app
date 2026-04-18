'use client'
import { useState } from "react"
import { RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react"
import { useVaultCtx } from "@/lib/context/vaultContext"
import { useVaultMigration } from "@/lib/hooks/useVaultMigration"

export function ChangePasswordModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input')
  const [newPass, setNewPass] = useState("")
  const [error, setError] = useState("")
  const {migrateVault,isMigrating} = useVaultMigration();
  
  const { isUnlocked } = useVaultCtx();

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-90">
      <div className="bg-background border border-foreground/10 w-full max-w-md rounded-3xl p-8 shadow-2xl">
        
        {step === 'input' && (
          <div className="space-y-6">

            <div className="text-center space-y-2">
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isUnlocked ? 'bg-teal-500/10' : 'bg-red-500/10'}`}>
                {isUnlocked ? <ShieldCheck className="text-teal-500" /> : <AlertTriangle className="text-red-500" />}
              </div>
              <h2 className="text-2xl font-bold">
                {isUnlocked ? "Update Password" : "Reset Vault Password"}
              </h2>
              <p className="text-foreground/40 text-sm">
                {isUnlocked 
                  ? "Your data will be safely re-encrypted with the new key." 
                  : "Vault is locked. Changing password now will wipe all current data."}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/50 ml-1">
                  New Master Password
                </label>
                <input 
                  type="password" 
                  placeholder="Enter new password..."
                  className="w-full bg-foreground/5 border border-foreground/10 p-4 rounded-xl outline-none focus:border-teal-500 transition-all"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-500 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button 
               onClick={async () => {
                setError("");
                setStep('processing');
              
                try {
                  await migrateVault(newPass);
                  setStep('success');
                } catch (e: unknown) {
                  const message = e instanceof Error ? e.message : "Something went wrong";
                  setError(message);
                  setStep('input');
                }
              }}
              disabled={!newPass || newPass.length < 8 || isMigrating}
                className={`w-full font-bold p-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50
                  ${isUnlocked ? 'bg-teal-500 text-black hover:bg-teal-400' : 'bg-red-500 text-white hover:bg-red-600'}`}
              >
                {isUnlocked && (isMigrating ? <RefreshCw className="animate-spin" /> : <RefreshCw size={18} />)}
                {isUnlocked ? "Re-encrypt & Save" : "Wipe & Reset Vault"}
              </button>
              
              <button 
                onClick={onClose} 
                className="w-full p-4 rounded-xl hover:bg-foreground/5 font-medium text-foreground/60 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center space-y-4 text-center">
            <RefreshCw className="animate-spin text-teal-500" size={48} />
            <p className="font-bold text-xl">Updating Security</p>
            <p className="text-sm text-foreground/40 px-6">
              {isUnlocked 
                ? "Decrypting and re-encrypting your items locally..." 
                : "Purging vault items and resetting auth metadata..."}
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-12 flex flex-col items-center space-y-4 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-teal-500" size={40} />
            </div>
            <h3 className="text-2xl font-bold">All Set!</h3>
            <p className="text-foreground/40 text-sm px-4">
              Your master password has been updated. {isUnlocked ? "Your data is safe." : "Your vault is now empty and ready."}
            </p>
            <button onClick={onClose} className="w-full bg-foreground text-background font-bold p-4 rounded-xl mt-6">
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  )
}