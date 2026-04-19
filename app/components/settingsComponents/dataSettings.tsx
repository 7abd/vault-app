'use client'
import { useState } from "react"
import { Header } from "@/app/settings/page"
import { Download, Trash2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/SupabaseClient"
import { useVaultCtx } from "@/lib/context/vaultContext"
import { decryptWithKey } from "@/lib/crypto"

export default function DataSettings() {
  const supabase = createClient()
  const { isUnlocked, withDecrypted, lockVault } = useVaultCtx()
  const [isExporting, setIsExporting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleExport = async () => {
    if (!isUnlocked) {
      alert("Please unlock your vault first to export your data.")
      return
    }

    setIsExporting(true)
    try {
      await withDecrypted(async (masterKey) => {
        const { data: items, error } = await supabase
          .from("vault_items")
          .select("*")

        if (error) throw error
        if (!items || items.length === 0) {
          alert("No items found to export.")
          return
        }

        const decryptedEntries = await Promise.all(
          items.map(async (item) => {
            try {
              const plainText = await decryptWithKey(
                item.encrypted_content,
                item.encryption_iv,
                masterKey
              );
        
              let parsedContent;
              try {
                parsedContent = JSON.parse(plainText);
              } catch {
                parsedContent = plainText;
              }
        
              return {
                title: item.title,
                content: parsedContent,
                created_at: item.created_at,
              };
            } catch (err) {
              console.error(`Failed to decrypt item: ${item.id}`, err);
              return null;
            }
          })
        );

        const finalData = {
          vault_version: "1.0",
          export_date: new Date().toISOString(),
          entries: decryptedEntries.filter(Boolean)
        }

        const blob = new Blob([JSON.stringify(finalData, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `vault_export_${new Date().toISOString().split('T')[0]}.json`
        link.click()
        URL.revokeObjectURL(url)
      })
    } catch (err) {
      console.error("Export Error:", err)
      alert("An error occurred during export.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleReset = async () => {
    const confirmWipe = window.confirm(
      "DANGER: This will permanently delete all encrypted data and your vault configuration. This cannot be undone. Proceed?"
    )
    if (!confirmWipe) return

    setIsResetting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { error: dbError } = await supabase
        .from("vault_items")
        .delete()
        .eq("user_id", user.id)

      if (dbError) throw dbError

      const { error: authError } = await supabase.auth.updateUser({
        data: { vault_salt: null, vault_verifier: null }
      })

      if (authError) throw authError

      lockVault()
      alert("Vault successfully wiped.")
    } catch (err) {
      console.error("Reset Error:", err)
      alert("Failed to reset vault.")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="space-y-8">
      <Header title="Vault Data" subtitle="Export or reset your encrypted information." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="p-6 bg-background border border-foreground/5 rounded-2xl hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/5 transition-all text-left group disabled:opacity-50"
        >
          <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-black transition-colors">
            {isExporting ? <Loader2 className="animate-spin" size={24} /> : <Download className="text-teal-500 group-hover:text-inherit" size={24} />}
          </div>
          <p className="text-foreground font-bold text-lg">Export Vault</p>
          <p className="text-foreground/40 text-xs mt-1 leading-relaxed">
            Download your data as a decrypted .json file. Keep this file safe as it will be unencrypted.
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
            Resetting your vault will permanently delete all encrypted capsules and your vault access key.
          </p>
          <button 
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isResetting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
            Reset Entire Vault
          </button>
        </div>
      </div>
    </div>
  )
}