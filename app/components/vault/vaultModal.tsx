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
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)} 
              />
    
              <div className="relative bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                <h2 className="text-xl font-bold mb-4">New Secret Capsule</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">

                  <input 
                  name="title"
                  onChange={handleChange}
                  value={content.title}
                    type="text" 
                    placeholder="Title (e.g. My Ledger Key)" 
                    className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 outline-none focus:border-teal-400"
                  />
                   <select
                    name="type"
                    value={content.type}
                    onChange={handleChange}
                    className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 outline-none focus:border-teal-400"
                  >
                    <option value="note">Note</option>
                    <option value="password">Password</option>
                    <option value="image">Image</option>
                  </select>
                  <p className="text-[10px] text-gray-600 px-1">
                    Categorizes your secret to optimize how it is displayed and handled.
                  </p>    
                <select 
                  className="w-full bg-gray-800/50 border border-gray-700 text-gray-300 p-3.5 
                  rounded-xl appearance-none outline-none focus:border-teal-400/50 transition-all 
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
                
               

                  <p className="text-[10px] text-gray-600 px-1">
                    Controls how long the vault stays cooling down after use.
                  </p>

                  <input
                      type="number"
                      name="duration"
                      min={1}
                      value={content.duration}
                      onChange={handleChange}
                      placeholder="Lock duration (minutes)"
                      className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 outline-none focus:border-teal-400"
                        />
                        <p className="text-[10px] text-gray-600 px-1">
                          Sets the "Access Window"—how many minutes the vault stays open before auto-locking.
                        </p>
          {content.type !== 'image' && 
                  <textarea 
                  name="secretMsg"
                  value={content.secretMsg}
                  onChange={handleChange}
            
                    placeholder="The Secret Content..." 
                    className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 h-32 outline-none focus:border-teal-400"
                  />
              }
          {content.type === "image" && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700"
          />
        )}
     {error && (
          <div className="p-3 mb-4 rounded bg-red-500/10 border border-red-500 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-gray-800 py-3 rounded-xl hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button type="submit"  className="flex-1 bg-teal-400 text-black py-3 rounded-xl font-bold">
                  {isSaving ? "Saving..." : "Save"}

                  </button>
                </div>
                </form>
              </div>
            </div>
          
    )
)
}

