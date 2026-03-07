export default function SidebarItem({ label, icon, active, onClick }: { 
  label: string; 
  icon: React.ReactNode; 
  active: boolean; 
  onClick: () => void 
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full sm-block flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        active 
          ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/20' 
          : 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}