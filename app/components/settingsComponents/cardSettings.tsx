export function SettingCard({ title, description, action }: { title: string, description: string, action: any }) {
  return (
    <div className="flex items-center justify-between p-5 bg-background rounded-2xl border border-foreground/5 transition-all hover:border-foreground/10 shadow-sm">
      <div className="space-y-1">
        <p className="text-foreground font-bold leading-none">{title}</p>
        <p className="text-foreground/40 text-sm leading-tight">{description}</p>
      </div>
      <div className="sshrink-0 ml-4">
        {action}
      </div>
    </div>
  )
}