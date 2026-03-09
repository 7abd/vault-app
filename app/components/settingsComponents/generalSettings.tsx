'use client'
import { Header } from "@/app/settings/page"
import { useSettingsCtx } from "@/lib/context/settingsContext"
export default function GeneralSettings() {
    const {isLight,toggleTheme} = useSettingsCtx()

    return (
      <div className="space-y-6">
        <Header title="General" subtitle="Manage your app appearance and basic behavior." />
        
        <div className="flex items-center justify-between p-5 bg-background rounded-2xl border border-foreground/5 transition-all">
          <div className="space-y-0.5">
            <p className="text-foreground font-bold">Theme Mode</p>
            <p className="text-foreground/40 text-sm">Toggle between light and dark visual modes.</p>
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`w-14 h-8 rounded-full relative transition-all duration-300 ${isLight ? 'bg-teal-500' : 'bg-foreground/20'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${isLight ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>
    )
}