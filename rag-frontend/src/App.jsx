import { useState, useRef, useEffect } from "react"
import axios from "axios"

export default function App() {
  const API_URL = window.location.hostname.includes("localhost")
    ? "http://localhost:8000"
    : "https://rag-project-sx7h.onrender.com"

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [pdfUploaded, setPdfUploaded] = useState(false)
  const [pdfName, setPdfName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mode, setMode] = useState("pdf")
  const [dark, setDark] = useState(true)
  const fileRef = useRef()
  const bottomRef = useRef()
  const textareaRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const uploadPDF = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    try {
      await axios.post(`${API_URL}/upload`, formData)
      setPdfUploaded(true)
      setPdfName(file.name)
      setMessages([{ role: "ai", text: `**${file.name}** uploaded! Ask anything 🚀`, mode: "pdf" }])
      setSidebarOpen(false)
    } catch {
      alert("Upload failed!")
    }
    setUploading(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    if (mode === "pdf" && !pdfUploaded) return
    const userMsg = { role: "user", text: input, mode }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    setLoading(true)
    try {
      if (mode === "pdf") {
        const res = await axios.post(`${API_URL}/ask`, { question: input })
        setMessages(prev => [...prev, { role: "ai", text: res.data.answer, mode: "pdf" }])
      } else {
        const res = await axios.post(`${API_URL}/search`, { query: input })
        setMessages(prev => [...prev, { role: "ai", text: res.data.answer, sources: res.data.sources, mode: "web" }])
      }
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Error! Try again.", mode }])
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
          <span className="text-violet-500 font-bold shrink-0 text-base">{line.match(/^\d+/)[0]}.</span>
          <span>{line.replace(/^\d+\.\s/, "")}</span>
        </div>
      )
      if (/^[-*•]\s/.test(line)) return (
        <div key={i} className="flex gap-2 my-1.5 pl-1">
          <span className="text-pink-500 shrink-0 text-base">▸</span>
          <span>{line.replace(/^[-*•]\s/, "")}</span>
        </div>
      )
      if (line.trim() === "") return <div key={i} className="h-3" />
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <div key={i} className="my-1">
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="font-bold">{p}</strong> : p)}
        </div>
      )
    })
  }

  const isDisabled = mode === "pdf" ? !pdfUploaded : false

  // Theme colors
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
    modeBg: dark ? "bg-[#0f3460]/50 border-[#0f3460]" : "bg-[#dcdce8] border-[#c0c0d0]",
    modeInactive: dark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700",
    avatar: dark ? "bg-[#16213e] border-[#0f3460]" : "bg-[#dcdce8] border-[#c0c0d0]",
    emptyIcon: dark ? "bg-violet-900/20 border-violet-500/20" : "bg-violet-100 border-violet-300",
  }

  return (
    <div className={`flex h-screen w-screen ${t.bg} ${t.text} overflow-hidden transition-colors duration-300`}>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <div className={`fixed md:relative z-30 md:z-auto w-72 h-full ${t.sidebar} border-r flex flex-col p-5 gap-4 shrink-0 transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

        {/* Logo */}
        <div className={`flex items-center gap-3 pb-4 border-b ${dark ? "border-gray-800" : "border-gray-200"}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xl shadow-lg">⚡</div>
          <div>
            <div className="font-black text-base bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">PDF Chat</div>
            <div className={`text-xs ${t.muted}`}>RAG · AI · Web Search</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className={`md:hidden ml-auto ${t.muted} hover:${t.text} text-xl`}>✕</button>
        </div>

        {/* Mode Toggle */}
        <div className={`flex ${t.modeBg} border rounded-xl p-1 gap-1`}>
          {[["pdf", "📄 PDF"], ["web", "🔍 Web"]].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === m ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-md" : t.modeInactive}`}>
              {label}
            </button>
          ))}
        </div>

        {/* PDF Upload */}
        {mode === "pdf" && (
          <>
            <button onClick={() => fileRef.current.click()} disabled={uploading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 disabled:opacity-40 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md">
              {uploading ? "⏳ Uploading..." : "+ Upload PDF"}
            </button>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={uploadPDF} />
            {pdfUploaded && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-emerald-500 flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span className="truncate font-medium">{pdfName}</span>
              </div>
            )}
          </>
        )}

        {mode === "web" && (
          <div className={`${t.hintBg} border rounded-xl p-4 text-sm leading-relaxed`}>
            <div className="text-base mb-1">🔍 Web Search</div>
            <div className={t.muted}>Real-time internet search powered by Tavily AI</div>
          </div>
        )}

        {/* Steps */}
        <div className={`mt-auto ${t.hintBg} border rounded-xl p-4 space-y-3`}>
          {(mode === "pdf"
            ? [["1", "PDF upload karo"], ["2", "Question pucho"], ["3", "AI jawab dega"]]
            : [["1", "Web mode chuno"], ["2", "Kuch bhi likho"], ["3", "Answer + sources milenge"]]
          ).map(([n, text]) => (
            <div key={n} className={`flex items-center gap-3 text-sm ${t.muted}`}>
              <div className="w-6 h-6 rounded-full border border-violet-500/50 flex items-center justify-center text-xs text-violet-500 font-bold shrink-0">{n}</div>
              {text}
            </div>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <button onClick={() => setDark(!dark)}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${t.hintBg} ${t.muted} hover:${t.text}`}>
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">

        {/* Topbar */}
        <div className={`px-4 md:px-6 py-4 border-b ${t.topbar} flex items-center gap-3 backdrop-blur-xl`}>
          <button onClick={() => setSidebarOpen(true)} className={`md:hidden ${t.muted} hover:${t.text} text-2xl`}>☰</button>
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${mode === "web" ? "bg-pink-500" : pdfUploaded ? "bg-emerald-500" : "bg-gray-500"}`} />
          <span className={`text-sm font-medium truncate ${mode === "web" ? "text-pink-500" : pdfUploaded ? "text-emerald-500" : t.muted}`}>
            {mode === "web" ? "Web Search Active" : pdfUploaded ? pdfName : "No PDF loaded"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${mode === "web" ? "text-pink-500 border-pink-500/30 bg-pink-500/10" : "text-violet-500 border-violet-500/30 bg-violet-500/10"}`}>
              {mode === "web" ? "🔍 WEB" : "📄 PDF"}
            </span>
            <button onClick={() => setDark(!dark)}
              className={`w-8 h-8 rounded-lg border ${t.hintBg} flex items-center justify-center text-base transition-all`}>
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-5">
              <div className={`w-24 h-24 rounded-3xl ${t.emptyIcon} border flex items-center justify-center text-5xl`}>
                {mode === "web" ? "🔍" : "⚡"}
              </div>
              <div>
                <div className="font-black text-3xl mb-2">{mode === "web" ? "Web Search" : "PDF ChatBot"}</div>
                <div className={`text-base ${t.muted}`}>{mode === "web" ? "Search anything on the internet" : "Upload a PDF and ask anything"}</div>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-black ${msg.role === "user" ? `${t.avatar} border text-violet-500` : "bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg"}`}>
                {msg.role === "user" ? "U" : "AI"}
              </div>
              <div className={`max-w-[80%] md:max-w-[72%] rounded-2xl px-5 py-4 text-base leading-relaxed ${msg.role === "user" ? `${t.userBubble} border rounded-tr-sm` : `${t.aiBubble} border rounded-tl-sm`}`}>
                {msg.role === "ai" ? (
                  <>
                    {formatText(msg.text)}
                    {msg.sources?.length > 0 && (
                      <div className={`mt-4 pt-4 border-t ${dark ? "border-gray-700" : "border-gray-200"} flex flex-wrap gap-2`}>
                        <span className={`text-xs ${t.muted} w-full mb-1 font-medium`}>SOURCES</span>
                        {msg.sources.slice(0, 3).map((src, j) => (
                          <a key={j} href={src} target="_blank" rel="noreferrer"
                            className="text-xs text-pink-500 bg-pink-500/10 border border-pink-500/20 rounded-lg px-3 py-1.5 font-medium hover:bg-pink-500/20 transition-colors max-w-[200px] truncate block">
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
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shrink-0 flex items-center justify-center text-sm font-black text-white shadow-lg">AI</div>
              <div className={`${t.aiBubble} border rounded-2xl rounded-tl-sm px-5 py-4`}>
                <div className="flex gap-2 items-center">
                  {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={`px-4 md:px-6 py-4 border-t ${t.inputArea} backdrop-blur-xl`}>
          <div className={`flex gap-3 items-end ${t.input} border rounded-2xl px-4 py-3 transition-all focus-within:ring-2 ${mode === "web" ? "focus-within:ring-pink-500/30" : "focus-within:ring-violet-500/30"}`}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }}}
              placeholder={mode === "web" ? "Search anything..." : pdfUploaded ? "Ask anything..." : "First upload a PDF..."}
              disabled={isDisabled}
              rows={1}
              className={`flex-1 bg-transparent text-base outline-none resize-none leading-relaxed ${t.text} placeholder:${t.muted} max-h-32 disabled:cursor-not-allowed`}
            />
            <button onClick={sendMessage} disabled={loading || isDisabled || !input.trim()}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-base transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-br text-white shadow-md ${mode === "web" ? "from-pink-500 to-violet-500" : "from-violet-500 to-pink-500"}`}>
              {mode === "web" ? "🔍" : "➤"}
            </button>
          </div>
          <p className={`text-center text-xs ${t.muted} mt-2`}>↵ send · ⇧↵ new line</p>
        </div>
      </div>
    </div>
  )
}