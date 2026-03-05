import { useState, Dispatch, SetStateAction } from "react"
import { encryptWithKey ,fileToBase64} from "@/lib/crypto";
import { createClient } from "@/lib/supabase/SupabaseClient";
import { useAuth } from "@/lib/context/authContext";
import { Content } from "@/lib/types";
import { useVaultCtx } from "@/lib/context/vaultContext";

export default function VaultModal({ isOpen, setIsOpen }:
   { isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>>}) {
      const [content,setContent] = useState <Content> ({title:'' , secretMsg:'' , duration:1,type:'note',frequency:'once'})
      const [error,setError] = useState<string | null> (null)
      const [isSaving,setIsSaving] = useState<boolean>(false)
      const supabase = createClient()
      const {user,setVaultItems} = useAuth();
      const { cryptoKey} = useVaultCtx()
  
      const handleChange =  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setContent((prev) => ({ ...prev, [name]: value }))

    }
 
      async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
      
        
        if (file.size > 2 * 1024 * 1024) {
          alert("Image too large")
          return
        }
      
        const base64 = await fileToBase64(file)
      
        setContent(prev => ({
          ...prev,
          secretMsg: base64
        }))
      }
      

     

    const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
          setIsSaving(true)
            if(!cryptoKey) {
              setError('You need to unlock your vault first')
              return
            }
            const { encrypted_content, encryption_iv } = await encryptWithKey(content.secretMsg, cryptoKey);
        
            if (!user) return;
            const { data, error } = await supabase
            .from("vault_items")
            .insert({
              user_id: user.id,
              title: content.title,
              type: content.type,
              encrypted_content,
              encryption_iv,
              duration_minutes: content.duration,
              frequency: content.frequency,
            }).select('*').single()

            
          
          console.log(content)
          if (error) {
            setError(error.message);
          } else {
             setVaultItems(prev => prev ? [data, ...prev] : [data])
          }
          setIsOpen(false)
        setContent({title:'' , secretMsg:'' , duration:1,type:'note',frequency:'once'})

         setError(null)
         
    }
    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              
              <div 
                className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)} 
              />
    
              <div className="relative bg-sidebar border border-foreground/10 p-8 rounded-2xl w-full max-w-md shadow-2xl  transition-all duration-300 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-foreground">New Secret Capsule</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">

                  <input 
                  name="title"
                  required
                  onChange={handleChange}
                  value={content.title}
                    type="text" 
                    placeholder="Title (e.g. My Ledger Key)" 
                    className="w-full bg-background p-3 rounded-xl border border-foreground/10 text-foreground outline-none focus:border-teal-400 transition-all"
                    />
                   <select
                    name="type"
                    value={content.type}
                    onChange={handleChange}
                     className="w-full bg-background p-3 rounded-xl border border-foreground/10 text-foreground outline-none focus:border-teal-400 transition-all cursor-pointer"
                  >
                    <option value="note">Note</option>
                    <option value="password">Password</option>
                    <option value="image">Image</option>
                  </select>
                  <p className="text-[10px] text-foreground/40 italic px-1">
                    Categorizes your secret to optimize how it is displayed and handled.
                  </p>    
                <select 
                  className="w-full bg-background border border-foreground/10 text-foreground p-3.5 
                  rounded-xl  outline-none focus:border-teal-400/50 transition-all 
                  cursor-pointer text-sm font-medium"
                  name="frequency"
                  onChange={handleChange}
                >
                  <option value="once">Once (Normal Vault)</option>
                  <option value="minutely">every 5min (just for testing)</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="2-days">Every 2 Days</option>
                  <option value="weekly">Weekly</option>
                  <option value="2-weeks">Every 2 Weeks</option>
                  <option value="monthly">Monthly</option>
                  <option value="2-months">Every 2 Months</option>
                  <option value="3-months">Quarterly (3 Months)</option>
                  <option value="6-months">Bi-annually (6 Months)</option>
                  <option value="yearly">Yearly</option>
                </select>
                
               

                  <p className="text-[10px] text-foreground/40 italic px-1">
                    Controls how long the vault stays cooling down after use.
                  </p>

                  <input
                      type="number"
                      name="duration"
                      min={1}
                      value={content.duration}
                      onChange={handleChange}
                      placeholder="Lock duration (minutes)"
                      className="w-full bg-background p-3 rounded-lg border border-foreground/10 text-foreground transition-all outline-none focus:border-teal-400"
                        />
                        <p className="text-[10px] text-foreground/40 italic px-1">
                          Sets the "Access Window"—how many minutes the vault stays open before auto-locking.
                                            </p>
                              {content.type !== 'image' && 
                                      <textarea 
                                      name="secretMsg"
                                      required
                                      value={content.secretMsg}
                                      onChange={handleChange}
                                
                                        placeholder="The Secret Content..." 
                                        className="w-full bg-background p-3 rounded-xl border border-foreground/10 text-foreground h-32 outline-none focus:border-teal-400 transition-all resize-none"
                                        />
                                  }
                              {content.type === "image" && (
                              <input
                                type="file"
                                accept="image/*"
                                required
                                onChange={handleImageChange}
                                className="w-full bg-background p-3 rounded-xl border border-foreground/10 text-foreground text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-400/10 file:text-teal-500 hover:file:bg-teal-400/20 transition-all"
                                />
                            )}
                        {error && (
                              <div className="p-3 mb-4 rounded bg-red-500/10 border border-red-500 text-red-500 text-sm text-center font-medium">
                                {error}
                              </div>
        )}
                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-foreground/5 text-foreground py-3 rounded-xl hover:bg-foreground/10 transition-colors font-medium"
                    >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 bg-teal-400 text-black py-3 rounded-xl font-bold hover:bg-teal-300 transition-all shadow-lg shadow-teal-400/20 disabled:opacity-50"
              >
                  {(isSaving && !error) ? "Saving..." : "Save"}

                  </button>
                </div>
                </form>
              </div>
            </div>
          
    )
)
}

