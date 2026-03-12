'use client'
import { Header } from "@/app/settings/page"
import { SettingCard } from "./cardSettings"
import { Lock, ShieldCheck } from "lucide-react"
import { useSettingsCtx } from "@/lib/context/settingsContext"
import { ChangePasswordModal } from "./changePasswordModal"
import { useState } from "react"


export default function SecuritySettings() {

const   [isOpen,setIsOpen] = useState<boolean>(false)
 
  const {lockTimer,setLockTimer} = useSettingsCtx()
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value)
   setLockTimer(value)
  }
    return (
      <div className="space-y-8">
        <Header title="Security" subtitle="Configure your vault encryption and access policies." />
        
        <div className="space-y-4">
          <SettingCard 
            title="Auto-Lock Timer" 
            description="Automatically lock the vault after a period of inactivity."
            action={
              <select className="bg-background border border-foreground/10 text-foreground 
              text-sm rounded-xl p-2.5 outline-none focus:border-teal-400 
              transition-all cursor-pointer font-medium"
              onChange={handleChange}
              value={lockTimer}
              >
                <option value={5}>5 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={60}>1 Hour</option>
                <option value={0}>Never</option>
              </select>
            }
          />
          
          <button className="w-full flex items-center justify-between p-5 bg-background
           hover:bg-foreground/5 rounded-2xl border border-foreground/5
            transition-all group"   onClick={() => setIsOpen(true)}>
            <div className="text-left space-y-0.5">
              <p className="text-foreground font-bold">Change Master Password</p>
              <p className="text-foreground/40 text-sm">Update your vault encryption key.</p>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-xl group-hover:bg-teal-500/20 transition-colors">
              <Lock size={18} className="text-teal-500" />
            </div>
          </button>
       {isOpen &&  <ChangePasswordModal isOpen={isOpen} onClose={() =>setIsOpen(false)}/>}
          
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-teal-500/3 border border-teal-500/10 flex items-start gap-4">
            <ShieldCheck className="text-teal-500 shrink-0" size={24} />
            <div>
                <p className="text-teal-500 font-bold text-sm">Encryption Active</p>
                <p className="text-foreground/40 text-xs mt-1">Your data is secured with AES-256 encryption. Your master password is the only key to access it.</p>
            </div>
        </div>
      </div>
    )
}