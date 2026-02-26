// import { useState, useRef, useEffect } from "react"
// import axios from "axios"

// export default function App() {
//   const API_URL = window.location.hostname.includes("localhost")
//     ? "http://localhost:8000"
//     : "https://rag-project-sx7h.onrender.com"

//   const [messages, setMessages] = useState([])
//   const [input, setInput] = useState("")
//   const [pdfUploaded, setPdfUploaded] = useState(false)
//   const [pdfName, setPdfName] = useState("")
//   const [uploading, setUploading] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [mode, setMode] = useState("pdf")
//   const [dark, setDark] = useState(true)
//   const fileRef = useRef()
//   const bottomRef = useRef()
//   const textareaRef = useRef()

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages, loading])

//   const uploadPDF = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return
//     setUploading(true)
//     const formData = new FormData()
//     formData.append("file", file)
//     try {
//       await axios.post(`${API_URL}/upload`, formData)
//       setPdfUploaded(true)
//       setPdfName(file.name)
//       setMessages([{ role: "ai", text: `**${file.name}** uploaded! Ask anything 🚀`, mode: "pdf" }])
//       setSidebarOpen(false)
//     } catch {
//       alert("Upload failed!")
//     }
//     setUploading(false)
//   }

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return
//     if (mode === "pdf" && !pdfUploaded) return
//     const userMsg = { role: "user", text: input, mode }
//     setMessages(prev => [...prev, userMsg])
//     setInput("")
//     if (textareaRef.current) textareaRef.current.style.height = "auto"
//     setLoading(true)
//     try {
//       if (mode === "pdf") {
//         const res = await axios.post(`${API_URL}/ask`, { question: input })
//         setMessages(prev => [...prev, { role: "ai", text: res.data.answer, mode: "pdf" }])
//       } else {
//         const res = await axios.post(`${API_URL}/search`, { query: input })
//         setMessages(prev => [...prev, { role: "ai", text: res.data.answer, sources: res.data.sources, mode: "web" }])
//       }
//     } catch {
//       setMessages(prev => [...prev, { role: "ai", text: "Error! Try again.", mode }])
//     }
//     setLoading(false)
//   }

//   const handleTextareaChange = (e) => {
//     setInput(e.target.value)
//     e.target.style.height = "auto"
//     e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
//   }

//   const formatText = (text) => {
//     return text.split("\n").map((line, i) => {
//       if (/^\d+\.\s/.test(line)) return (
//         <div key={i} className="flex gap-2 my-1.5">
//           <span className="text-violet-500 font-bold shrink-0 text-base">{line.match(/^\d+/)[0]}.</span>
//           <span>{line.replace(/^\d+\.\s/, "")}</span>
//         </div>
//       )
//       if (/^[-*•]\s/.test(line)) return (
//         <div key={i} className="flex gap-2 my-1.5 pl-1">
//           <span className="text-pink-500 shrink-0 text-base">▸</span>
//           <span>{line.replace(/^[-*•]\s/, "")}</span>
//         </div>
//       )
//       if (line.trim() === "") return <div key={i} className="h-3" />
//       const parts = line.split(/\*\*(.*?)\*\*/g)
//       return (
//         <div key={i} className="my-1">
//           {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="font-bold">{p}</strong> : p)}
//         </div>
//       )
//     })
//   }

//   const isDisabled = mode === "pdf" ? !pdfUploaded : false

//   // Theme colors
//   const t = {
//     bg: dark ? "bg-[#1a1a2e]" : "bg-[#f0f0f5]",
//     sidebar: dark ? "bg-[#16213e] border-[#0f3460]/50" : "bg-[#e8e8f0] border-[#c8c8d8]",
//     topbar: dark ? "bg-[#1a1a2e]/90 border-[#0f3460]/50" : "bg-[#e8e8f0]/90 border-[#c8c8d8]",
//     input: dark ? "bg-[#16213e] border-[#0f3460]/60" : "bg-[#dcdce8] border-[#b8b8cc]",
//     inputArea: dark ? "bg-[#1a1a2e]/80 border-[#0f3460]/50" : "bg-[#e8e8f0]/80 border-[#c8c8d8]",
//     userBubble: dark ? "bg-violet-900/40 border-violet-600/30 text-gray-100" : "bg-violet-100 border-violet-300 text-gray-800",
//     aiBubble: dark ? "bg-[#16213e] border-[#0f3460]/60 text-gray-200" : "bg-[#dcdce8] border-[#c0c0d0] text-gray-800",
//     text: dark ? "text-gray-100" : "text-gray-800",
//     muted: dark ? "text-gray-400" : "text-gray-500",
//     hintBg: dark ? "bg-[#16213e]/80 border-[#0f3460]/40" : "bg-[#dcdce8] border-[#c0c0d0]",
//     modeBg: dark ? "bg-[#0f3460]/50 border-[#0f3460]" : "bg-[#dcdce8] border-[#c0c0d0]",
//     modeInactive: dark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700",
//     avatar: dark ? "bg-[#16213e] border-[#0f3460]" : "bg-[#dcdce8] border-[#c0c0d0]",
//     emptyIcon: dark ? "bg-violet-900/20 border-violet-500/20" : "bg-violet-100 border-violet-300",
//   }

//   return (
//     <div className={`flex h-screen w-screen ${t.bg} ${t.text} overflow-hidden transition-colors duration-300`}>

//       {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

//       {/* Sidebar */}
//       <div className={`fixed md:relative z-30 md:z-auto w-72 h-full ${t.sidebar} border-r flex flex-col p-5 gap-4 shrink-0 transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

//         {/* Logo */}
//         <div className={`flex items-center gap-3 pb-4 border-b ${dark ? "border-gray-800" : "border-gray-200"}`}>
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xl shadow-lg">⚡</div>
//           <div>
//             <div className="font-black text-base bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">PDF Chat</div>
//             <div className={`text-xs ${t.muted}`}>RAG · AI · Web Search</div>
//           </div>
//           <button onClick={() => setSidebarOpen(false)} className={`md:hidden ml-auto ${t.muted} hover:${t.text} text-xl`}>✕</button>
//         </div>

//         {/* Mode Toggle */}
//         <div className={`flex ${t.modeBg} border rounded-xl p-1 gap-1`}>
//           {[["pdf", "📄 PDF"], ["web", "🔍 Web"]].map(([m, label]) => (
//             <button key={m} onClick={() => setMode(m)}
//               className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === m ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-md" : t.modeInactive}`}>
//               {label}
//             </button>
//           ))}
//         </div>

//         {/* PDF Upload */}
//         {mode === "pdf" && (
//           <>
//             <button onClick={() => fileRef.current.click()} disabled={uploading}
//               className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 disabled:opacity-40 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md">
//               {uploading ? "⏳ Uploading..." : "+ Upload PDF"}
//             </button>
//             <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={uploadPDF} />
//             {pdfUploaded && (
//               <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-emerald-500 flex items-center gap-2">
//                 <span className="text-lg">✅</span>
//                 <span className="truncate font-medium">{pdfName}</span>
//               </div>
//             )}
//           </>
//         )}

//         {mode === "web" && (
//           <div className={`${t.hintBg} border rounded-xl p-4 text-sm leading-relaxed`}>
//             <div className="text-base mb-1">🔍 Web Search</div>
//             <div className={t.muted}>Real-time internet search powered by Tavily AI</div>
//           </div>
//         )}

//         {/* Steps */}
//         <div className={`mt-auto ${t.hintBg} border rounded-xl p-4 space-y-3`}>
//           {(mode === "pdf"
//             ? [["1", "PDF upload karo"], ["2", "Question pucho"], ["3", "AI jawab dega"]]
//             : [["1", "Web mode chuno"], ["2", "Kuch bhi likho"], ["3", "Answer + sources milenge"]]
//           ).map(([n, text]) => (
//             <div key={n} className={`flex items-center gap-3 text-sm ${t.muted}`}>
//               <div className="w-6 h-6 rounded-full border border-violet-500/50 flex items-center justify-center text-xs text-violet-500 font-bold shrink-0">{n}</div>
//               {text}
//             </div>
//           ))}
//         </div>

//         {/* Dark Mode Toggle */}
//         <button onClick={() => setDark(!dark)}
//           className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${t.hintBg} ${t.muted} hover:${t.text}`}>
//           {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
//         </button>
//       </div>

//       {/* Main */}
//       <div className="flex flex-col flex-1 overflow-hidden min-w-0">

//         {/* Topbar */}
//         <div className={`px-4 md:px-6 py-4 border-b ${t.topbar} flex items-center gap-3 backdrop-blur-xl`}>
//           <button onClick={() => setSidebarOpen(true)} className={`md:hidden ${t.muted} hover:${t.text} text-2xl`}>☰</button>
//           <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${mode === "web" ? "bg-pink-500" : pdfUploaded ? "bg-emerald-500" : "bg-gray-500"}`} />
//           <span className={`text-sm font-medium truncate ${mode === "web" ? "text-pink-500" : pdfUploaded ? "text-emerald-500" : t.muted}`}>
//             {mode === "web" ? "Web Search Active" : pdfUploaded ? pdfName : "No PDF loaded"}
//           </span>
//           <div className="ml-auto flex items-center gap-2">
//             <span className={`text-xs font-medium px-3 py-1 rounded-full border ${mode === "web" ? "text-pink-500 border-pink-500/30 bg-pink-500/10" : "text-violet-500 border-violet-500/30 bg-violet-500/10"}`}>
//               {mode === "web" ? "🔍 WEB" : "📄 PDF"}
//             </span>
//             <button onClick={() => setDark(!dark)}
//               className={`w-8 h-8 rounded-lg border ${t.hintBg} flex items-center justify-center text-base transition-all`}>
//               {dark ? "☀️" : "🌙"}
//             </button>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
//           {messages.length === 0 && (
//             <div className="flex flex-col items-center justify-center h-full text-center gap-5">
//               <div className={`w-24 h-24 rounded-3xl ${t.emptyIcon} border flex items-center justify-center text-5xl`}>
//                 {mode === "web" ? "🔍" : "⚡"}
//               </div>
//               <div>
//                 <div className="font-black text-3xl mb-2">{mode === "web" ? "Web Search" : "PDF ChatBot"}</div>
//                 <div className={`text-base ${t.muted}`}>{mode === "web" ? "Search anything on the internet" : "Upload a PDF and ask anything"}</div>
//               </div>
//             </div>
//           )}

//           {messages.map((msg, i) => (
//             <div key={i} className={`flex gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
//               <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-black ${msg.role === "user" ? `${t.avatar} border text-violet-500` : "bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg"}`}>
//                 {msg.role === "user" ? "U" : "AI"}
//               </div>
//               <div className={`max-w-[80%] md:max-w-[72%] rounded-2xl px-5 py-4 text-base leading-relaxed ${msg.role === "user" ? `${t.userBubble} border rounded-tr-sm` : `${t.aiBubble} border rounded-tl-sm`}`}>
//                 {msg.role === "ai" ? (
//                   <>
//                     {formatText(msg.text)}
//                     {msg.sources?.length > 0 && (
//                       <div className={`mt-4 pt-4 border-t ${dark ? "border-gray-700" : "border-gray-200"} flex flex-wrap gap-2`}>
//                         <span className={`text-xs ${t.muted} w-full mb-1 font-medium`}>SOURCES</span>
//                         {msg.sources.slice(0, 3).map((src, j) => (
//                           <a key={j} href={src} target="_blank" rel="noreferrer"
//                             className="text-xs text-pink-500 bg-pink-500/10 border border-pink-500/20 rounded-lg px-3 py-1.5 font-medium hover:bg-pink-500/20 transition-colors max-w-[200px] truncate block">
//                             🔗 {new URL(src).hostname}
//                           </a>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 ) : msg.text}
//               </div>
//             </div>
//           ))}

//           {loading && (
//             <div className="flex gap-3 items-start">
//               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shrink-0 flex items-center justify-center text-sm font-black text-white shadow-lg">AI</div>
//               <div className={`${t.aiBubble} border rounded-2xl rounded-tl-sm px-5 py-4`}>
//                 <div className="flex gap-2 items-center">
//                   {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={bottomRef} />
//         </div>

//         {/* Input */}
//         <div className={`px-4 md:px-6 py-4 border-t ${t.inputArea} backdrop-blur-xl`}>
//           <div className={`flex gap-3 items-end ${t.input} border rounded-2xl px-4 py-3 transition-all focus-within:ring-2 ${mode === "web" ? "focus-within:ring-pink-500/30" : "focus-within:ring-violet-500/30"}`}>
//             <textarea
//               ref={textareaRef}
//               value={input}
//               onChange={handleTextareaChange}
//               onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }}}
//               placeholder={mode === "web" ? "Search anything..." : pdfUploaded ? "Ask anything..." : "First upload a PDF..."}
//               disabled={isDisabled}
//               rows={1}
//               className={`flex-1 bg-transparent text-base outline-none resize-none leading-relaxed ${t.text} placeholder:${t.muted} max-h-32 disabled:cursor-not-allowed`}
//             />
//             <button onClick={sendMessage} disabled={loading || isDisabled || !input.trim()}
//               className={`w-10 h-10 rounded-xl flex items-center justify-center text-base transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-br text-white shadow-md ${mode === "web" ? "from-pink-500 to-violet-500" : "from-violet-500 to-pink-500"}`}>
//               {mode === "web" ? "🔍" : "➤"}
//             </button>
//           </div>
//           <p className={`text-center text-xs ${t.muted} mt-2`}>↵ send · ⇧↵ new line</p>
//         </div>
//       </div>
//     </div>
//   )
// } 

// import { useState, useRef, useEffect } from "react"
// import axios from "axios"

// export default function App() {
//   const API_URL = window.location.hostname.includes("localhost")
//     ? "http://localhost:8000"
//     : "https://rag-project-sx7h.onrender.com"

//   const [messages, setMessages] = useState([])
//   const [input, setInput] = useState("")
//   const [pdfUploaded, setPdfUploaded] = useState(false)
//   const [pdfName, setPdfName] = useState("")
//   const [uploading, setUploading] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [mode, setMode] = useState("pdf")
//   const [dark, setDark] = useState(true)
//   const fileRef = useRef()
//   const bottomRef = useRef()
//   const textareaRef = useRef()

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages, loading])

//   const uploadPDF = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return
//     setUploading(true)
//     const formData = new FormData()
//     formData.append("file", file)
//     try {
//       await axios.post(`${API_URL}/upload`, formData)
//       setPdfUploaded(true)
//       setPdfName(file.name)
//       setMessages([{ role: "ai", text: `**${file.name}** uploaded! Ask anything 🚀`, mode: "pdf" }])
//       setSidebarOpen(false)
//     } catch {
//       alert("Upload failed!")
//     }
//     setUploading(false)
//   }

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return
//     if (mode === "pdf" && !pdfUploaded) return
//     const userMsg = { role: "user", text: input, mode }
//     setMessages(prev => [...prev, userMsg])
//     setInput("")
//     if (textareaRef.current) textareaRef.current.style.height = "auto"
//     setLoading(true)
//     try {
//       if (mode === "pdf") {
//         const res = await axios.post(`${API_URL}/ask`, { question: input })
//         setMessages(prev => [...prev, { role: "ai", text: res.data.answer, mode: "pdf" }])
//       } else {
//         const res = await axios.post(`${API_URL}/search`, { query: input })
//         setMessages(prev => [...prev, { role: "ai", text: res.data.answer, sources: res.data.sources, mode: "web" }])
//       }
//     } catch {
//       setMessages(prev => [...prev, { role: "ai", text: "Error! Try again.", mode }])
//     }
//     setLoading(false)
//   }

//   const handleTextareaChange = (e) => {
//     setInput(e.target.value)
//     e.target.style.height = "auto"
//     e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
//   }

//   const formatText = (text) => {
//     return text.split("\n").map((line, i) => {
//       if (/^\d+\.\s/.test(line)) return (
//         <div key={i} className="flex gap-2 my-1.5">
//           <span className="text-violet-500 font-bold shrink-0">{line.match(/^\d+/)[0]}.</span>
//           <span>{line.replace(/^\d+\.\s/, "")}</span>
//         </div>
//       )
//       if (/^[-*•]\s/.test(line)) return (
//         <div key={i} className="flex gap-2 my-1.5 pl-1">
//           <span className="text-pink-500 shrink-0">▸</span>
//           <span>{line.replace(/^[-*•]\s/, "")}</span>
//         </div>
//       )
//       if (line.trim() === "") return <div key={i} className="h-2" />
//       const parts = line.split(/\*\*(.*?)\*\*/g)
//       return (
//         <div key={i} className="my-0.5">
//           {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="font-bold">{p}</strong> : p)}
//         </div>
//       )
//     })
//   }

//   const isDisabled = mode === "pdf" ? !pdfUploaded : false

//   const t = {
//     bg: dark ? "bg-[#1a1a2e]" : "bg-[#f0f0f5]",
//     sidebar: dark ? "bg-[#16213e] border-[#0f3460]/50" : "bg-[#e8e8f0] border-[#c8c8d8]",
//     topbar: dark ? "bg-[#1a1a2e]/90 border-[#0f3460]/50" : "bg-[#e8e8f0]/90 border-[#c8c8d8]",
//     input: dark ? "bg-[#16213e] border-[#0f3460]/60" : "bg-[#dcdce8] border-[#b8b8cc]",
//     inputArea: dark ? "bg-[#1a1a2e]/80 border-[#0f3460]/50" : "bg-[#e8e8f0]/80 border-[#c8c8d8]",
//     userBubble: dark ? "bg-violet-900/40 border-violet-600/30 text-gray-100" : "bg-violet-100 border-violet-300 text-gray-800",
//     aiBubble: dark ? "bg-[#16213e] border-[#0f3460]/60 text-gray-200" : "bg-[#dcdce8] border-[#c0c0d0] text-gray-800",
//     text: dark ? "text-gray-100" : "text-gray-800",
//     muted: dark ? "text-gray-400" : "text-gray-500",
//     hintBg: dark ? "bg-[#16213e]/80 border-[#0f3460]/40" : "bg-[#dcdce8] border-[#c0c0d0]",
//     modeBg: dark ? "bg-[#0f3460]/50 border-[#0f3460]" : "bg-[#dcdce8] border-[#c0c0d0]",
//     modeInactive: dark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700",
//     avatar: dark ? "bg-[#16213e] border-[#0f3460]" : "bg-[#dcdce8] border-[#c0c0d0]",
//     emptyIcon: dark ? "bg-violet-900/20 border-violet-500/20" : "bg-violet-100 border-violet-300",
//   }

//   return (
//     <div className={`flex h-screen w-screen ${t.bg} ${t.text} overflow-hidden transition-colors duration-300`}>

//       {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

//       {/* Sidebar */}
//       <div className={`fixed md:relative z-30 md:z-auto w-64 h-full ${t.sidebar} border-r flex flex-col p-4 gap-3 shrink-0 transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

//         {/* Logo */}
//         <div className={`flex items-center gap-3 pb-3 border-b ${dark ? "border-[#0f3460]/50" : "border-[#c8c8d8]"}`}>
//           <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-lg shadow-lg shrink-0">⚡</div>
//           <div className="min-w-0">
//             <div className="font-black text-sm bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">PDF Chat</div>
//             <div className={`text-xs ${t.muted} truncate`}>RAG · AI · Web Search</div>
//           </div>
//           <button onClick={() => setSidebarOpen(false)} className={`md:hidden ml-auto ${t.muted} text-xl shrink-0`}>✕</button>
//         </div>

//         {/* Mode Toggle */}
//         <div className={`flex ${t.modeBg} border rounded-xl p-1 gap-1`}>
//           {[["pdf", "📄 PDF"], ["web", "🔍 Web"]].map(([m, label]) => (
//             <button key={m} onClick={() => setMode(m)}
//               className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === m ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-md" : t.modeInactive}`}>
//               {label}
//             </button>
//           ))}
//         </div>

//         {/* PDF Upload */}
//         {mode === "pdf" && (
//           <>
//             <button onClick={() => fileRef.current.click()} disabled={uploading}
//               className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 disabled:opacity-40 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md">
//               {uploading ? "⏳ Uploading..." : "+ Upload PDF"}
//             </button>
//             <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={uploadPDF} />
//             {pdfUploaded && (
//               <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2.5 text-sm text-emerald-500 flex items-center gap-2">
//                 <span>✅</span>
//                 <span className="truncate font-medium text-xs">{pdfName}</span>
//               </div>
//             )}
//           </>
//         )}

//         {mode === "web" && (
//           <div className={`${t.hintBg} border rounded-xl p-3 text-sm leading-relaxed`}>
//             <div className="mb-1">🔍 Web Search</div>
//             <div className={`text-xs ${t.muted}`}>Real-time search powered by Tavily AI</div>
//           </div>
//         )}

//         {/* Steps */}
//         <div className={`mt-auto ${t.hintBg} border rounded-xl p-3 space-y-2`}>
//           {(mode === "pdf"
//             ? [["1", "PDF upload karo"], ["2", "Question pucho"], ["3", "AI jawab dega"]]
//             : [["1", "Web mode chuno"], ["2", "Kuch bhi likho"], ["3", "Answer + sources"]]
//           ).map(([n, text]) => (
//             <div key={n} className={`flex items-center gap-2 text-xs ${t.muted}`}>
//               <div className="w-5 h-5 rounded-full border border-violet-500/50 flex items-center justify-center text-[10px] text-violet-500 font-bold shrink-0">{n}</div>
//               {text}
//             </div>
//           ))}
//         </div>

//         {/* Dark Mode Toggle */}
//         <button onClick={() => setDark(!dark)}
//           className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${t.hintBg}`}>
//           {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
//         </button>
//       </div>

//       {/* Main */}
//       <div className="flex flex-col flex-1 overflow-hidden min-w-0">

//         {/* Topbar */}
//         <div className={`px-3 md:px-6 py-3 border-b ${t.topbar} flex items-center gap-2 backdrop-blur-xl`}>
//           <button onClick={() => setSidebarOpen(true)} className={`md:hidden ${t.muted} text-xl mr-1`}>☰</button>
//           <div className={`w-2 h-2 rounded-full shrink-0 ${mode === "web" ? "bg-pink-500" : pdfUploaded ? "bg-emerald-500" : "bg-gray-500"}`} />
//           <span className={`text-xs md:text-sm font-medium truncate ${mode === "web" ? "text-pink-500" : pdfUploaded ? "text-emerald-500" : t.muted}`}>
//             {mode === "web" ? "Web Search Active" : pdfUploaded ? pdfName : "No PDF loaded"}
//           </span>
//           <div className="ml-auto flex items-center gap-2">
//             <span className={`text-xs font-medium px-2 py-1 rounded-full border hidden sm:block ${mode === "web" ? "text-pink-500 border-pink-500/30 bg-pink-500/10" : "text-violet-500 border-violet-500/30 bg-violet-500/10"}`}>
//               {mode === "web" ? "🔍 WEB" : "📄 PDF"}
//             </span>
//             <button onClick={() => setDark(!dark)}
//               className={`w-8 h-8 rounded-lg border ${t.hintBg} flex items-center justify-center text-base transition-all`}>
//               {dark ? "☀️" : "🌙"}
//             </button>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto px-3 md:px-8 py-4 space-y-4 md:space-y-6">
//           {messages.length === 0 && (
//             <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-4">
//               <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl ${t.emptyIcon} border flex items-center justify-center text-3xl md:text-4xl`}>
//                 {mode === "web" ? "🔍" : "⚡"}
//               </div>
//               <div>
//                 <div className="font-black text-xl md:text-2xl mb-1">{mode === "web" ? "Web Search" : "PDF ChatBot"}</div>
//                 <div className={`text-sm ${t.muted}`}>{mode === "web" ? "Search anything on the internet" : "Upload a PDF and ask anything"}</div>
//               </div>
//             </div>
//           )}

//           {messages.map((msg, i) => (
//             <div key={i} className={`flex gap-2 md:gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
//               <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl shrink-0 flex items-center justify-center text-xs font-black ${msg.role === "user" ? `${t.avatar} border text-violet-500` : "bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-md"}`}>
//                 {msg.role === "user" ? "U" : "AI"}
//               </div>
//               <div className={`max-w-[88%] md:max-w-[75%] rounded-2xl px-3 md:px-5 py-2.5 md:py-4 text-sm leading-relaxed ${msg.role === "user" ? `${t.userBubble} border rounded-tr-sm` : `${t.aiBubble} border rounded-tl-sm`}`}>
//                 {msg.role === "ai" ? (
//                   <>
//                     {formatText(msg.text)}
//                     {msg.sources?.length > 0 && (
//                       <div className={`mt-3 pt-3 border-t ${dark ? "border-[#0f3460]/60" : "border-[#c0c0d0]"} flex flex-wrap gap-1.5`}>
//                         <span className={`text-[10px] ${t.muted} w-full mb-1 font-medium`}>SOURCES</span>
//                         {msg.sources.slice(0, 3).map((src, j) => (
//                           <a key={j} href={src} target="_blank" rel="noreferrer"
//                             className="text-[10px] text-pink-500 bg-pink-500/10 border border-pink-500/20 rounded-lg px-2 py-1 font-medium hover:bg-pink-500/20 transition-colors max-w-[150px] truncate block">
//                             🔗 {new URL(src).hostname}
//                           </a>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 ) : msg.text}
//               </div>
//             </div>
//           ))}

//           {loading && (
//             <div className="flex gap-2 md:gap-3 items-start">
//               <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shrink-0 flex items-center justify-center text-xs font-black text-white shadow-md">AI</div>
//               <div className={`${t.aiBubble} border rounded-2xl rounded-tl-sm px-4 py-3`}>
//                 <div className="flex gap-1.5 items-center">
//                   {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={bottomRef} />
//         </div>

//         {/* Input */}
//         <div className={`px-3 md:px-6 py-3 border-t ${t.inputArea} backdrop-blur-xl`}>
//           <div className={`flex gap-2 items-end ${t.input} border rounded-2xl px-3 md:px-4 py-2.5 transition-all focus-within:ring-2 ${mode === "web" ? "focus-within:ring-pink-500/30" : "focus-within:ring-violet-500/30"}`}>
//             <textarea
//               ref={textareaRef}
//               value={input}
//               onChange={handleTextareaChange}
//               onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }}}
//               placeholder={mode === "web" ? "Search anything..." : pdfUploaded ? "Ask anything..." : "First upload a PDF..."}
//               disabled={isDisabled}
//               rows={1}
//               className={`flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed ${t.text} placeholder:text-gray-500 max-h-28 disabled:cursor-not-allowed`}
//             />
//             <button onClick={sendMessage} disabled={loading || isDisabled || !input.trim()}
//               className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-sm transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-br text-white shadow-md ${mode === "web" ? "from-pink-500 to-violet-500" : "from-violet-500 to-pink-500"}`}>
//               {mode === "web" ? "🔍" : "➤"}
//             </button>
//           </div>
//           <p className={`text-center text-[10px] ${t.muted} mt-1.5 hidden md:block`}>↵ send · ⇧↵ new line</p>
//         </div>
//       </div>
//     </div>
//   )
// } 


// import { useState, useRef, useEffect } from "react"
// import axios from "axios"

// export default function App() {
//   const API_URL = window.location.hostname.includes("localhost")
//     ? "http://localhost:8000"
//     : "https://rag-project-sx7h.onrender.com"

//   const [messages, setMessages] = useState([])
//   const [input, setInput] = useState("")
//   const [pdfUploaded, setPdfUploaded] = useState(false)
//   const [pdfName, setPdfName] = useState("")
//   const [uploading, setUploading] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [mode, setMode] = useState("pdf")
//   const [dark, setDark] = useState(true)
//   const fileRef = useRef()
//   const bottomRef = useRef()
//   const textareaRef = useRef()

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages, loading])

//   const uploadPDF = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return
//     setUploading(true)
//     const formData = new FormData()
//     formData.append("file", file)
//     try {
//       await axios.post(`${API_URL}/upload`, formData)
//       setPdfUploaded(true)
//       setPdfName(file.name)
//       setMessages([{ role: "ai", text: `**${file.name}** uploaded! Ask anything 🚀`, mode: "pdf" }])
//       setSidebarOpen(false)
//     } catch {
//       alert("Upload failed!")
//     }
//     setUploading(false)
//   }

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return
//     if (mode === "pdf" && !pdfUploaded) return
//     const userMsg = { role: "user", text: input, mode }
//     setMessages(prev => [...prev, userMsg])
//     setInput("")
//     if (textareaRef.current) textareaRef.current.style.height = "auto"
//     setLoading(true)
//     try {
//       if (mode === "pdf") {
//         const res = await axios.post(`${API_URL}/ask`, { question: input })
//         setMessages(prev => [...prev, { role: "ai", text: res.data.answer, mode: "pdf" }])
//       } else if (mode === "web") {
//         const res = await axios.post(`${API_URL}/search`, { query: input })
//         setMessages(prev => [...prev, { role: "ai", text: res.data.answer, sources: res.data.sources, mode: "web" }])
//       } else if (mode === "agent") {
//         const res = await axios.post(`${API_URL}/agent`, { message: input })
//         setMessages(prev => [...prev, { role: "ai", text: res.data.response, mode: "agent" }])
//       }
//     } catch {
//       setMessages(prev => [...prev, { role: "ai", text: "Error! Try again.", mode }])
//     }
//     setLoading(false)
//   }

//   const handleTextareaChange = (e) => {
//     setInput(e.target.value)
//     e.target.style.height = "auto"
//     e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
//   }

//   const formatText = (text) => {
//     return text.split("\n").map((line, i) => {
//       if (/^\d+\.\s/.test(line)) return (
//         <div key={i} className="flex gap-2 my-1.5">
//           <span className="text-violet-500 font-bold shrink-0">{line.match(/^\d+/)[0]}.</span>
//           <span>{line.replace(/^\d+\.\s/, "")}</span>
//         </div>
//       )
//       if (/^[-*•]\s/.test(line)) return (
//         <div key={i} className="flex gap-2 my-1.5 pl-1">
//           <span className="text-pink-500 shrink-0">▸</span>
//           <span>{line.replace(/^[-*•]\s/, "")}</span>
//         </div>
//       )
//       if (line.trim() === "") return <div key={i} className="h-2" />
//       const parts = line.split(/\*\*(.*?)\*\*/g)
//       return (
//         <div key={i} className="my-0.5">
//           {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="font-bold">{p}</strong> : p)}
//         </div>
//       )
//     })
//   }

//   const isDisabled = mode === "pdf" ? !pdfUploaded : false

//   const t = {
//     bg: dark ? "bg-[#1a1a2e]" : "bg-[#f0f0f5]",
//     sidebar: dark ? "bg-[#16213e] border-[#0f3460]/50" : "bg-[#e8e8f0] border-[#c8c8d8]",
//     topbar: dark ? "bg-[#1a1a2e]/90 border-[#0f3460]/50" : "bg-[#e8e8f0]/90 border-[#c8c8d8]",
//     input: dark ? "bg-[#16213e] border-[#0f3460]/60" : "bg-[#dcdce8] border-[#b8b8cc]",
//     inputArea: dark ? "bg-[#1a1a2e]/80 border-[#0f3460]/50" : "bg-[#e8e8f0]/80 border-[#c8c8d8]",
//     userBubble: dark ? "bg-violet-900/40 border-violet-600/30 text-gray-100" : "bg-violet-100 border-violet-300 text-gray-800",
//     aiBubble: dark ? "bg-[#16213e] border-[#0f3460]/60 text-gray-200" : "bg-[#dcdce8] border-[#c0c0d0] text-gray-800",
//     text: dark ? "text-gray-100" : "text-gray-800",
//     muted: dark ? "text-gray-400" : "text-gray-500",
//     hintBg: dark ? "bg-[#16213e]/80 border-[#0f3460]/40" : "bg-[#dcdce8] border-[#c0c0d0]",
//     modeBg: dark ? "bg-[#0f3460]/50 border-[#0f3460]" : "bg-[#dcdce8] border-[#c0c0d0]",
//     modeInactive: dark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700",
//     avatar: dark ? "bg-[#16213e] border-[#0f3460]" : "bg-[#dcdce8] border-[#c0c0d0]",
//     emptyIcon: dark ? "bg-violet-900/20 border-violet-500/20" : "bg-violet-100 border-violet-300",
//   }

//   const modeConfig = {
//     pdf:   { label: "📄 PDF",   color: "text-violet-500", border: "border-violet-500/30", bg: "bg-violet-500/10" },
//     web:   { label: "🔍 Web",   color: "text-pink-500",   border: "border-pink-500/30",   bg: "bg-pink-500/10"   },
//     agent: { label: "🤖 Agent", color: "text-emerald-500", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
//   }

//   const emptyStateInfo = {
//     pdf:   { icon: "⚡", title: "PDF ChatBot",    sub: "Upload a PDF and ask anything" },
//     web:   { icon: "🔍", title: "Web Search",     sub: "Search anything on the internet" },
//     agent: { icon: "🤖", title: "AI Agent",       sub: "Add todos, save notes, search web — just ask!" },
//   }

//   const placeholders = {
//     pdf:   pdfUploaded ? "Ask anything about PDF..." : "First upload a PDF...",
//     web:   "Search anything...",
//     agent: "Add a todo, save a note, search web...",
//   }

//   const agentExamples = [
//     "Add task: finish project report",
//     "Show my todos",
//     "Save note: Meeting at 3pm tomorrow",
//     "Search latest AI news",
//   ]

//   return (
//     <div className={`flex h-screen w-screen ${t.bg} ${t.text} overflow-hidden transition-colors duration-300`}>

//       {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

//       {/* Sidebar */}
//       <div className={`fixed md:relative z-30 md:z-auto w-64 h-full ${t.sidebar} border-r flex flex-col p-4 gap-3 shrink-0 transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

//         {/* Logo */}
//         <div className={`flex items-center gap-3 pb-3 border-b ${dark ? "border-[#0f3460]/50" : "border-[#c8c8d8]"}`}>
//           <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-lg shadow-lg shrink-0">⚡</div>
//           <div className="min-w-0">
//             <div className="font-black text-sm bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">PDF Chat</div>
//             <div className={`text-xs ${t.muted} truncate`}>RAG · AI · Agent</div>
//           </div>
//           <button onClick={() => setSidebarOpen(false)} className={`md:hidden ml-auto ${t.muted} text-xl shrink-0`}>✕</button>
//         </div>

//         {/* Mode Toggle */}
//         <div className={`flex flex-col ${t.modeBg} border rounded-xl p-1 gap-1`}>
//           {[["pdf", "📄 PDF"], ["web", "🔍 Web"], ["agent", "🤖 Agent"]].map(([m, label]) => (
//             <button key={m} onClick={() => setMode(m)}
//               className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${mode === m ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-md" : t.modeInactive}`}>
//               {label}
//             </button>
//           ))}
//         </div>

//         {/* PDF Upload */}
//         {mode === "pdf" && (
//           <>
//             <button onClick={() => fileRef.current.click()} disabled={uploading}
//               className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 disabled:opacity-40 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md">
//               {uploading ? "⏳ Uploading..." : "+ Upload PDF"}
//             </button>
//             <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={uploadPDF} />
//             {pdfUploaded && (
//               <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2.5 text-sm text-emerald-500 flex items-center gap-2">
//                 <span>✅</span>
//                 <span className="truncate font-medium text-xs">{pdfName}</span>
//               </div>
//             )}
//           </>
//         )}

//         {mode === "web" && (
//           <div className={`${t.hintBg} border rounded-xl p-3 text-sm leading-relaxed`}>
//             <div className="mb-1">🔍 Web Search</div>
//             <div className={`text-xs ${t.muted}`}>Real-time search powered by Tavily AI</div>
//           </div>
//         )}

//         {mode === "agent" && (
//           <div className={`${t.hintBg} border rounded-xl p-3 space-y-2`}>
//             <div className="text-xs font-bold text-emerald-500 mb-2">🤖 Agent can:</div>
//             {["📝 Save notes", "✅ Manage todos", "🔍 Search web", "💬 Remember context"].map((f, i) => (
//               <div key={i} className={`text-xs ${t.muted} flex items-center gap-2`}>
//                 <span>{f}</span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Steps */}
//         <div className={`mt-auto ${t.hintBg} border rounded-xl p-3 space-y-2`}>
//           {(mode === "pdf"
//             ? [["1", "PDF upload karo"], ["2", "Question pucho"], ["3", "AI jawab dega"]]
//             : mode === "web"
//             ? [["1", "Web mode chuno"], ["2", "Kuch bhi likho"], ["3", "Answer + sources"]]
//             : [["1", "Agent mode chuno"], ["2", "Task/note/search bolo"], ["3", "Agent kaam karega"]]
//           ).map(([n, text]) => (
//             <div key={n} className={`flex items-center gap-2 text-xs ${t.muted}`}>
//               <div className="w-5 h-5 rounded-full border border-violet-500/50 flex items-center justify-center text-[10px] text-violet-500 font-bold shrink-0">{n}</div>
//               {text}
//             </div>
//           ))}
//         </div>

//         {/* Dark Mode Toggle */}
//         <button onClick={() => setDark(!dark)}
//           className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${t.hintBg}`}>
//           {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
//         </button>
//       </div>

//       {/* Main */}
//       <div className="flex flex-col flex-1 overflow-hidden min-w-0">

//         {/* Topbar */}
//         <div className={`px-3 md:px-6 py-3 border-b ${t.topbar} flex items-center gap-2 backdrop-blur-xl`}>
//           <button onClick={() => setSidebarOpen(true)} className={`md:hidden ${t.muted} text-xl mr-1`}>☰</button>
//           <div className={`w-2 h-2 rounded-full shrink-0 ${mode === "web" ? "bg-pink-500" : mode === "agent" ? "bg-emerald-500" : pdfUploaded ? "bg-violet-500" : "bg-gray-500"}`} />
//           <span className={`text-xs md:text-sm font-medium truncate ${modeConfig[mode].color}`}>
//             {mode === "agent" ? "AI Agent Active" : mode === "web" ? "Web Search Active" : pdfUploaded ? pdfName : "No PDF loaded"}
//           </span>
//           <div className="ml-auto flex items-center gap-2">
//             <span className={`text-xs font-medium px-2 py-1 rounded-full border hidden sm:block ${modeConfig[mode].color} ${modeConfig[mode].border} ${modeConfig[mode].bg}`}>
//               {modeConfig[mode].label}
//             </span>
//             <button onClick={() => setDark(!dark)}
//               className={`w-8 h-8 rounded-lg border ${t.hintBg} flex items-center justify-center text-base`}>
//               {dark ? "☀️" : "🌙"}
//             </button>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto px-3 md:px-8 py-4 space-y-4 md:space-y-6">
//           {messages.length === 0 && (
//             <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-4">
//               <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${t.emptyIcon} border flex items-center justify-center text-3xl md:text-4xl`}>
//                 {emptyStateInfo[mode].icon}
//               </div>
//               <div>
//                 <div className="font-black text-xl md:text-2xl mb-1">{emptyStateInfo[mode].title}</div>
//                 <div className={`text-sm ${t.muted}`}>{emptyStateInfo[mode].sub}</div>
//               </div>
//               {mode === "agent" && (
//                 <div className="flex flex-wrap justify-center gap-2 mt-2 max-w-md">
//                   {agentExamples.map((ex, i) => (
//                     <button key={i} onClick={() => setInput(ex)}
//                       className={`text-xs px-3 py-1.5 rounded-full border ${t.hintBg} ${t.muted} hover:text-emerald-500 hover:border-emerald-500/30 transition-all`}>
//                       {ex}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {messages.map((msg, i) => (
//             <div key={i} className={`flex gap-2 md:gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
//               <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl shrink-0 flex items-center justify-center text-xs font-black
//                 ${msg.role === "user"
//                   ? `${t.avatar} border text-violet-500`
//                   : msg.mode === "agent"
//                   ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md"
//                   : "bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-md"
//                 }`}>
//                 {msg.role === "user" ? "U" : msg.mode === "agent" ? "🤖" : "AI"}
//               </div>
//               <div className={`max-w-[88%] md:max-w-[75%] rounded-2xl px-3 md:px-5 py-2.5 md:py-4 text-sm leading-relaxed
//                 ${msg.role === "user"
//                   ? `${t.userBubble} border rounded-tr-sm`
//                   : `${t.aiBubble} border rounded-tl-sm`
//                 }`}>
//                 {msg.role === "ai" ? (
//                   <>
//                     {formatText(msg.text)}
//                     {msg.sources?.length > 0 && (
//                       <div className={`mt-3 pt-3 border-t ${dark ? "border-[#0f3460]/60" : "border-[#c0c0d0]"} flex flex-wrap gap-1.5`}>
//                         <span className={`text-[10px] ${t.muted} w-full mb-1 font-medium`}>SOURCES</span>
//                         {msg.sources.slice(0, 3).map((src, j) => (
//                           <a key={j} href={src} target="_blank" rel="noreferrer"
//                             className="text-[10px] text-pink-500 bg-pink-500/10 border border-pink-500/20 rounded-lg px-2 py-1 font-medium hover:bg-pink-500/20 transition-colors max-w-[150px] truncate block">
//                             🔗 {new URL(src).hostname}
//                           </a>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 ) : msg.text}
//               </div>
//             </div>
//           ))}

//           {loading && (
//             <div className="flex gap-2 md:gap-3 items-start">
//               <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl shrink-0 flex items-center justify-center text-xs font-black text-white shadow-md
//                 ${mode === "agent" ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-gradient-to-br from-violet-500 to-pink-500"}`}>
//                 {mode === "agent" ? "🤖" : "AI"}
//               </div>
//               <div className={`${t.aiBubble} border rounded-2xl rounded-tl-sm px-4 py-3`}>
//                 <div className="flex gap-1.5 items-center">
//                   {[0,1,2].map(i => (
//                     <div key={i} className={`w-2 h-2 rounded-full animate-bounce ${mode === "agent" ? "bg-emerald-500" : "bg-violet-500"}`}
//                       style={{ animationDelay: `${i*0.15}s` }} />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={bottomRef} />
//         </div>

//         {/* Input */}
//         <div className={`px-3 md:px-6 py-3 border-t ${t.inputArea} backdrop-blur-xl`}>
//           <div className={`flex gap-2 items-end ${t.input} border rounded-2xl px-3 md:px-4 py-2.5 transition-all focus-within:ring-2
//             ${mode === "web" ? "focus-within:ring-pink-500/30" : mode === "agent" ? "focus-within:ring-emerald-500/30" : "focus-within:ring-violet-500/30"}`}>
//             <textarea
//               ref={textareaRef}
//               value={input}
//               onChange={handleTextareaChange}
//               onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }}}
//               placeholder={placeholders[mode]}
//               disabled={isDisabled}
//               rows={1}
//               className={`flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed ${t.text} placeholder:text-gray-500 max-h-28 disabled:cursor-not-allowed`}
//             />
//             <button onClick={sendMessage} disabled={loading || isDisabled || !input.trim()}
//               className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-sm transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-br text-white shadow-md
//                 ${mode === "web" ? "from-pink-500 to-violet-500" : mode === "agent" ? "from-emerald-500 to-teal-500" : "from-violet-500 to-pink-500"}`}>
//               {mode === "web" ? "🔍" : mode === "agent" ? "🤖" : "➤"}
//             </button>
//           </div>
//           <p className={`text-center text-[10px] ${t.muted} mt-1.5 hidden md:block`}>↵ send · ⇧↵ new line</p>
//         </div>
//       </div>
//     </div>
//   )
// } 

import { useState, useRef, useEffect } from "react"
import axios from "axios"

export default function App() {
  const API_URL = window.location.hostname.includes("localhost")
    ? "http://localhost:8000"
    : "https://rag-project-sx7h.onrender.com"

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [dark, setDark] = useState(true)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()
  const bottomRef = useRef()
  const textareaRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const uploadFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await axios.post(`${API_URL}/upload`, formData)
      setUploadedFile({ name: file.name, type: res.data.type })
      setMessages(prev => [...prev, {
        role: "ai",
        text: `**${file.name}** uploaded! ${res.data.type === "image" ? "Ask me anything about this image 🖼️" : "Ask me anything about this PDF 📄"}`,
        mode: res.data.type
      }])
    } catch {
      alert("Upload failed!")
    }
    setUploading(false)
    e.target.value = ""
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: "user", text: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/chat`, { message: input })
      setMessages(prev => [...prev, {
        role: "ai",
        text: res.data.answer,
        mode: res.data.mode,
        sources: res.data.sources || []
      }])
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Error! Try again.", mode: "general" }])
    }
    setLoading(false)
  }

  const handleTextareaChange = (e) => {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
  }

  const formatText = (text) => {
    return text.split("\n").map((line, i) => {
      if (/^\d+\.\s/.test(line)) return (
        <div key={i} className="flex gap-2 my-1.5">
          <span className="text-violet-500 font-bold shrink-0">{line.match(/^\d+/)[0]}.</span>
          <span>{line.replace(/^\d+\.\s/, "")}</span>
        </div>
      )
      if (/^[-*•]\s/.test(line)) return (
        <div key={i} className="flex gap-2 my-1.5 pl-1">
          <span className="text-pink-500 shrink-0">▸</span>
          <span>{line.replace(/^[-*•]\s/, "")}</span>
        </div>
      )
      if (line.trim() === "") return <div key={i} className="h-2" />
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <div key={i} className="my-0.5">
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="font-bold">{p}</strong> : p)}
        </div>
      )
    })
  }

  const modeBadge = {
    pdf:     { label: "📄 PDF",     color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    image:   { label: "🖼️ Image",   color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    web:     { label: "🔍 Web",     color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
    agent:   { label: "🤖 Agent",   color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    general: { label: "💬 AI",      color: "text-gray-400 bg-gray-500/10 border-gray-500/20" },
  }

  const t = {
    bg: dark ? "bg-[#1a1a2e]" : "bg-[#f0f0f5]",
    sidebar: dark ? "bg-[#16213e] border-[#0f3460]/50" : "bg-[#e8e8f0] border-[#c8c8d8]",
    topbar: dark ? "bg-[#1a1a2e]/90 border-[#0f3460]/50" : "bg-[#e8e8f0]/90 border-[#c8c8d8]",
    input: dark ? "bg-[#16213e] border-[#0f3460]/60" : "bg-[#dcdce8] border-[#b8b8cc]",
    inputArea: dark ? "bg-[#1a1a2e]/80 border-[#0f3460]/50" : "bg-[#e8e8f0]/80 border-[#c8c8d8]",
    userBubble: dark ? "bg-violet-900/40 border-violet-600/30 text-gray-100" : "bg-violet-100 border-violet-300 text-gray-800",
    aiBubble: dark ? "bg-[#16213e] border-[#0f3460]/60 text-gray-200" : "bg-[#dcdce8] border-[#c0c0d0] text-gray-800",
    text: dark ? "text-gray-100" : "text-gray-800",
    muted: dark ? "text-gray-400" : "text-gray-500",
    hintBg: dark ? "bg-[#16213e]/80 border-[#0f3460]/40" : "bg-[#dcdce8] border-[#c0c0d0]",
  }

  const suggestions = [
    "What's the latest news in AI?",
    "Add todo: finish my project",
    "Search: best laptops 2025",
    "Save note: important meeting tomorrow",
  ]

  return (
    <div className={`flex h-screen w-screen ${t.bg} ${t.text} overflow-hidden transition-colors duration-300`}>

      {/* Sidebar */}
      <div className={`hidden md:flex w-64 h-full ${t.sidebar} border-r flex-col p-4 gap-4 shrink-0`}>

        {/* Logo */}
        <div className={`flex items-center gap-3 pb-3 border-b ${dark ? "border-[#0f3460]/50" : "border-[#c8c8d8]"}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-lg shadow-lg shrink-0">⚡</div>
          <div>
            <div className="font-black text-sm bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">AI Assistant</div>
            <div className={`text-xs ${t.muted}`}>Smart · Fast · Powerful</div>
          </div>
        </div>

        {/* Upload */}
        <div className="space-y-2">
          <p className={`text-xs font-bold ${t.muted} uppercase tracking-wider`}>Upload File</p>
          <button onClick={() => fileRef.current.click()} disabled={uploading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 disabled:opacity-40 text-white text-sm font-bold py-2.5 rounded-xl transition-all">
            {uploading ? "⏳ Uploading..." : "📎 Upload PDF / Image"}
          </button>
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={uploadFile} />

          {uploadedFile && (
            <div className={`${t.hintBg} border rounded-xl px-3 py-2.5 flex items-center gap-2`}>
              <span>{uploadedFile.type === "image" ? "🖼️" : "📄"}</span>
              <span className={`text-xs truncate ${t.muted}`}>{uploadedFile.name}</span>
            </div>
          )}
        </div>

        {/* Capabilities */}
        <div className={`${t.hintBg} border rounded-xl p-3 space-y-2.5`}>
          <p className={`text-xs font-bold ${t.muted} uppercase tracking-wider mb-1`}>I can help with</p>
          {[
            ["📄", "Ask about PDFs"],
            ["🖼️", "Describe images"],
            ["🔍", "Search the web"],
            ["✅", "Manage todos"],
            ["📝", "Save notes"],
            ["💬", "General questions"],
          ].map(([icon, text]) => (
            <div key={text} className={`flex items-center gap-2 text-xs ${t.muted}`}>
              <span>{icon}</span> {text}
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-2">
          <button onClick={() => setDark(!dark)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium ${t.hintBg}`}>
            {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={() => { setMessages([]); setUploadedFile(null) }}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-xs ${t.muted} ${t.hintBg}`}>
            🗑️ Clear Chat
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">

        {/* Topbar */}
        <div className={`px-4 md:px-6 py-3 border-b ${t.topbar} flex items-center gap-3 backdrop-blur-xl`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-base md:hidden shadow-lg">⚡</div>
          <div>
            <div className="font-black text-sm bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">AI Assistant</div>
            <div className={`text-xs ${t.muted}`}>{uploadedFile ? `📎 ${uploadedFile.name}` : "Ask anything..."}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Mobile upload */}
            <button onClick={() => fileRef.current.click()}
              className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm">
              📎
            </button>
            <button onClick={() => setDark(!dark)}
              className={`w-8 h-8 rounded-lg border ${t.hintBg} flex items-center justify-center text-base`}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => { setMessages([]); setUploadedFile(null) }}
              className={`w-8 h-8 rounded-lg border ${t.hintBg} flex items-center justify-center text-sm md:hidden`}>
              🗑️
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 md:px-8 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-5 px-4">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/20 flex items-center justify-center text-4xl`}>⚡</div>
              <div>
                <div className="font-black text-2xl mb-1">AI Assistant</div>
                <div className={`text-sm ${t.muted}`}>Upload a PDF/Image or just ask anything!</div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2 max-w-lg">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => setInput(s)}
                    className={`text-xs px-3 py-2 rounded-full border ${t.hintBg} ${t.muted} hover:text-violet-500 hover:border-violet-500/30 transition-all`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 md:gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-black
                ${msg.role === "user"
                  ? `${t.hintBg} border text-violet-500`
                  : "bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-md"}`}>
                {msg.role === "user" ? "U" : "⚡"}
              </div>
              <div className={`max-w-[88%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                ${msg.role === "user"
                  ? `${t.userBubble} border rounded-tr-sm`
                  : `${t.aiBubble} border rounded-tl-sm`}`}>
                {msg.role === "ai" ? (
                  <>
                    {msg.mode && modeBadge[msg.mode] && (
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium mb-2 ${modeBadge[msg.mode].color}`}>
                        {modeBadge[msg.mode].label}
                      </span>
                    )}
                    {formatText(msg.text)}
                    {msg.sources?.length > 0 && (
                      <div className={`mt-3 pt-3 border-t ${dark ? "border-[#0f3460]/60" : "border-[#c0c0d0]"} flex flex-wrap gap-1.5`}>
                        <span className={`text-[10px] ${t.muted} w-full mb-1`}>SOURCES</span>
                        {msg.sources.slice(0, 3).map((src, j) => (
                          <a key={j} href={src} target="_blank" rel="noreferrer"
                            className="text-[10px] text-pink-500 bg-pink-500/10 border border-pink-500/20 rounded-lg px-2 py-1 hover:bg-pink-500/20 transition-colors max-w-[160px] truncate block">
                            🔗 {new URL(src).hostname}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 md:gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shrink-0 flex items-center justify-center text-sm text-white shadow-md">⚡</div>
              <div className={`${t.aiBubble} border rounded-2xl rounded-tl-sm px-4 py-3`}>
                <div className="flex gap-1.5 items-center">
                  {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={`px-3 md:px-6 py-3 border-t ${t.inputArea} backdrop-blur-xl`}>
          <div className={`flex gap-2 items-end ${t.input} border rounded-2xl px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-violet-500/30`}>
            <button onClick={() => fileRef.current.click()}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 transition-all ${t.hintBg} border hover:border-violet-500/50`}
              title="Upload PDF or Image">
              📎
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }}}
              placeholder="Ask anything, upload a file, or manage your tasks..."
              rows={1}
              className={`flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed ${t.text} placeholder:text-gray-500 max-h-28`}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all shrink-0 disabled:opacity-30 bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-md hover:opacity-90">
              ➤
            </button>
          </div>
          <p className={`text-center text-[10px] ${t.muted} mt-1.5 hidden md:block`}>↵ send · ⇧↵ new line · 📎 upload PDF or image</p>
        </div>
      </div>
    </div>
  )
}