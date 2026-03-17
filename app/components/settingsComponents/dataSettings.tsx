'use client'
import { Header } from "@/app/settings/page"
import { Download, Trash2 } from "lucide-react"

export default function DataSettings() {
    return (
      <div className="space-y-8">
        <Header title="Vault Data" subtitle="Export or reset your encrypted information." />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-6 bg-background border border-foreground/5 rounded-2xl hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/5 transition-all text-left group">
            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-black transition-colors">
              <Download className="text-teal-500 group-hover:text-inherit" size={24} />
            </div>
            <p className="text-foreground font-bold text-lg">Export Vault</p>
            <p className="text-foreground/40 text-xs mt-1 leading-relaxed">
              Download your encrypted backup as a .json file. Keep this file safe.
            </p>
          </button>
        </div>
  
        <div className="pt-8 border-t border-foreground/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-red-500 font-black uppercase text-[10px] tracking-[0.2em]">Danger Zone</h3>
          </div>
          
          <div className="p-6 bg-red-500/[0.03] border border-red-500/10 rounded-2xl">
            <p className="text-foreground/60 text-sm mb-4">
              Resetting your vault will permanently delete all encrypted capsules. This action cannot be undone.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all active:scale-[0.98]">
              <Trash2 size={18} />
              Reset Entire Vault
            </button>
          </div>
        </div>
      </div>
    )
}