import { useState, Dispatch, SetStateAction } from "react"

type Content = {
 title: string 
  secretMsg : string 
}

export default function VaultModal({ isOpen, setIsOpen }:
   { isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>> }) {
      const [content,setContent] = useState <Content> ({title:'' , secretMsg:''})

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target
        setContent((prev) => ({ ...prev, [name]: value }))

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
                
                <div className="space-y-4">
                  <input 
                  name="title"
                  onChange={handleChange}
                  value={content.title}
                    type="text" 
                    placeholder="Title (e.g. My Ledger Key)" 
                    className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 outline-none focus:border-teal-400"
                  />
                  <textarea 
                  name="secretMsg"
                  value={content.secretMsg}
                  onChange={handleChange}
            
                    placeholder="The Secret Content..." 
                    className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 h-32 outline-none focus:border-teal-400"
                  />
                </div>
    
                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-gray-800 py-3 rounded-xl hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-teal-400 text-black py-3 rounded-xl font-bold">
                    Lock & Save
                  </button>
                </div>
              </div>
            </div>
          
    )
)
}