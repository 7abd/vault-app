'use client'
import { Header } from "@/app/settings/page"
import { SettingCard } from "./cardSettings"
import { Lock, ShieldCheck } from "lucide-react"

export default function SecuritySettings() {
    return (
      <div className="space-y-8">
        <Header title="Security" subtitle="Configure your vault encryption and access policies." />
        
        <div className="space-y-4">
          <SettingCard 
            title="Auto-Lock Timer" 
            description="Automatically lock the vault after a period of inactivity."
            action={
              <select className="bg-background border border-foreground/10 text-foreground text-sm rounded-xl p-2.5 outline-none focus:border-teal-400 transition-all cursor-pointer font-medium">
                <option>5 Minutes</option>
                <option>1 Hour</option>
                <option>Never</option>
              </select>
            }
          />
          
          <button className="w-full flex items-center justify-between p-5 bg-background hover:bg-foreground/5 rounded-2xl border border-foreground/5 transition-all group">
            <div className="text-left space-y-0.5">
              <p className="text-foreground font-bold">Change Master Password</p>
              <p className="text-foreground/40 text-sm">Update your vault encryption key.</p>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-xl group-hover:bg-teal-500/20 transition-colors">
              <Lock size={18} className="text-teal-500" />
            </div>
          </button>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-teal-500/[0.03] border border-teal-500/10 flex items-start gap-4">
            <ShieldCheck className="text-teal-500 shrink-0" size={24} />
            <div>
                <p className="text-teal-500 font-bold text-sm">Encryption Active</p>
                <p className="text-foreground/40 text-xs mt-1">Your data is secured with AES-256 encryption. Your master password is the only key to access it.</p>
            </div>
        </div>
      </div>
    )
}