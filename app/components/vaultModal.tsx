import { useState, Dispatch, SetStateAction } from "react"
import { encryptWithKey ,generateSalt ,deriveCryptoKey,fileToBase64} from "@/lib/crypto";
import { createClient } from "@/lib/supabase/SupabaseClient";
import { useAuth } from "@/lib/context";
type Content = {
 title: string 
  secretMsg : string 
  duration : number
  type: 'note' | 'password' | 'image'
}

export default function VaultModal({ isOpen, setIsOpen }:
   { isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>>}) {
      const [content,setContent] = useState <Content> ({title:'' , secretMsg:'' , duration:0,type:'note'})
   const supabase = createClient()
   const {user,fetchVaultItems} = useAuth();
  
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
            const saltUint8 = generateSalt();
            const salt = btoa(String.fromCharCode(...saltUint8));
            const key = await deriveCryptoKey("myMasterPassword", salt);
            const { encrypted_content, encryption_iv } = await encryptWithKey(content.secretMsg, key);
        
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
              next_unlock_at: new Date(Date.now() + content.duration * 60 * 1000),
              frequency: "once",
            })
           
          
          if (error) {
            console.error("Error inserting vault item:", error);
          } else {
            
           await fetchVaultItems()
          }
          setIsOpen(false)
          setContent({title:'' , secretMsg:'' , duration:0,type:'note'})
    }
      console.log(content)
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
                  <input
                      type="number"
                      name="duration"
                      min={1}
                      value={content.duration}
                      onChange={handleChange}
                      placeholder="Lock duration (minutes)"
                      className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 outline-none focus:border-teal-400"
                        />
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
    
                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-gray-800 py-3 rounded-xl hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button type="submit"  className="flex-1 bg-teal-400 text-black py-3 rounded-xl font-bold">
                    Lock & Save
                  </button>
                </div>
                </form>
              </div>
            </div>
          
    )
)
}

