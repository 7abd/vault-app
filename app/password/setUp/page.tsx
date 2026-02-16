




export default function setUpPassword() {


    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/60  backdrop-blur-md" 
        />
  
        <div className="relative bg-gray-900 border border-gray-800 p-8
         rounded-2xl w-full max-w-sm shadow-2xl">
  
         
            <div className="relative bg-gray-900 border border-teal-500/30 p-8 rounded-2xl w-full max-w-sm shadow-2xl">
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-400 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
      New Vault
    </div>
  
    <h2 className="text-xl font-bold mb-1 text-white">Create Vault Password</h2>
    <p className="text-gray-400 text-sm mb-6">Set a strong password to encrypt your files.</p>
  
    <form className="space-y-4">
      <div className="space-y-2">
        <input
          type="password"
          placeholder="Create password"
          className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 text-white outline-none focus:border-teal-400 transition-colors"
        />
        
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 text-white outline-none focus:border-teal-400 transition-colors"
        />
      </div>
  
      <div className="flex gap-1">
          <div className="h-1 flex-1 bg-teal-400 rounded-full"></div>
          <div className="h-1 flex-1 bg-teal-400 rounded-full"></div>
          <div className="h-1 flex-1 bg-gray-700 rounded-full"></div>
          <div className="h-1 flex-1 bg-gray-700 rounded-full"></div>
      </div>
      <p className="text-[11px] text-gray-500 italic">Use at least 8 characters with numbers.</p>
  
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-xl hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
  
        <button
          type="submit"
          className="flex-1 bg-teal-400 text-black py-3 rounded-xl font-bold hover:bg-teal-300 transition-all shadow-lg shadow-teal-400/20"
        >
          Initialize
        </button>
      </div>
    </form>
  </div>
  </div>
  </div>
  
  
          )
    
}