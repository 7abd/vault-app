'use client'
import { useState } from "react"
import { Shield, Download, Sun, Menu, X } from "lucide-react" // Ensure you have these
import SidebarItem from "../components/settingsComponents/sidebarSettings"
import GeneralSettings from "../components/settingsComponents/generalSettings"
import SecuritySettings from "../components/settingsComponents/securitySettings"
import DataSettings from "../components/settingsComponents/dataSettings"

type SettingSection = 'general' | 'security' | 'data'

export default function Settings() {
  const [activeSection, setActiveSection] = useState<SettingSection>('general')
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (section: SettingSection) => {
    setActiveSection(section);
    setIsMenuOpen(false); 
  }

  return (
    <div className="flex min-h-[600px] w-full max-w-4xl bg-sidebar border border-foreground/10 rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300 relative">
      
      <button 
        className="md:hidden fixed bottom-6 right-6 z-70 bg-teal-500 text-black p-4 rounded-full shadow-xl"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`
        fixed inset-y-0 left-0 z-60 w-72 bg-sidebar border-r border-foreground/10 p-6 
        transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}

        md:relative md:translate-x-0 md:flex md:w-64 md:border-r md:border-foreground/5 md:bg-background/50
      `}>
        <div className="flex flex-col w-full">
            <h2 className="text-xl font-black text-foreground mb-8 tracking-tight">Settings</h2>
            <nav className="space-y-1.5">
                <SidebarItem 
                    label="General" 
                    icon={<Sun size={18} />} 
                    active={activeSection === 'general'} 
                    onClick={() => handleNav('general')} 
                />
                <SidebarItem 
                    label="Security" 
                    icon={<Shield size={18} />} 
                    active={activeSection === 'security'} 
                    onClick={() => handleNav('security')} 
                />
                <SidebarItem 
                    label="Vault Data" 
                    icon={<Download size={18} />} 
                    active={activeSection === 'data'} 
                    onClick={() => handleNav('data')} 
                />
            </nav>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-2xl">
          {activeSection === 'general' && <GeneralSettings />}
          {activeSection === 'security' && <SecuritySettings />}
          {activeSection === 'data' && <DataSettings />}
        </div>
      </main>

      {isMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  )
}

export function Header({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="mb-10">
      <h3 className="text-3xl font-black text-foreground tracking-tight">{title}</h3>
      <p className="text-foreground/40 text-sm mt-2 font-medium leading-relaxed">{subtitle}</p>
      <div className="h-px w-full bg-foreground/5 mt-6" />
    </div>
  )
}