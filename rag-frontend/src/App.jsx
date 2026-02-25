import { useState, useRef, useEffect } from "react"
import axios from "axios"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050507;
    --surface: #0d0d12;
    --surface2: #12121a;
    --border: rgba(255,255,255,0.06);
    --accent: #7c6aff;
    --accent2: #ff6ab0;
    --accent3: #6affd4;
    --text: #e8e8f0;
    --muted: #555566;
    --user-bg: rgba(124,106,255,0.12);
    --ai-bg: rgba(255,255,255,0.03);
  }

  html, body, #root { height: 100%; background: var(--bg); font-family: 'Syne', sans-serif; }

  .app {
    display: flex;
    height: 100vh;
    background: var(--bg);
    color: var(--text);
    overflow: hidden;
  }

  /* Noise overlay */
  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.4;
  }

  /* SIDEBAR */
  .sidebar {
    width: 260px;
    flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    gap: 12px;
    position: relative;
    z-index: 10;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 8px 20px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 4px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 20px rgba(124,106,255,0.4);
  }

  .logo-text {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.3px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .logo-sub {
    font-size: 10px;
    color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.5px;
  }

  .upload-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none;
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    padding: 12px 16px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.2px;
    position: relative;
    overflow: hidden;
  }

  .upload-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: white;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .upload-btn:hover::after { opacity: 0.08; }
  .upload-btn:active { transform: scale(0.98); }
  .upload-btn:disabled {
    background: var(--surface2);
    color: var(--muted);
    cursor: not-allowed;
  }

  .pdf-chip {
    background: rgba(106,255,212,0.06);
    border: 1px solid rgba(106,255,212,0.2);
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--accent3);
    animation: slideIn 0.3s ease;
  }

  .pdf-chip-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
  }

  .pdf-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent3);
    flex-shrink: 0;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(106,255,212,0.4); }
    50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(106,255,212,0); }
  }

  .sidebar-hint {
    margin-top: auto;
    padding: 12px;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: 10px;
  }

  .hint-step {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    padding: 4px 0;
  }

  .hint-num {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    color: var(--accent);
    flex-shrink: 0;
  }

  /* MAIN AREA */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    z-index: 5;
  }

  /* Topbar */
  .topbar {
    padding: 16px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(5,5,7,0.8);
    backdrop-filter: blur(20px);
  }

  .topbar-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transition: all 0.3s;
  }
  .status-dot.active {
    background: var(--accent3);
    box-shadow: 0 0 8px rgba(106,255,212,0.6);
  }
  .status-dot.inactive { background: var(--muted); }

  .topbar-text {
    color: var(--muted);
    transition: color 0.3s;
  }
  .topbar-text.active { color: var(--accent3); }

  .hamburger {
    display: none;
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    font-size: 20px;
    padding: 2px;
    margin-right: 4px;
  }

  /* Messages */
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scroll-behavior: smooth;
  }

  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-track { background: transparent; }
  .messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 20px;
    text-align: center;
    animation: fadeUp 0.6s ease;
  }

  .empty-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, rgba(124,106,255,0.1), rgba(255,106,176,0.1));
    border: 1px solid rgba(124,106,255,0.2);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
  }

  .empty-title {
    font-size: 22px;
    font-weight: 800;
    background: linear-gradient(135deg, var(--text), var(--muted));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .empty-sub {
    font-size: 13px;
    color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
  }

  /* Message row */
  .msg-row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    animation: fadeUp 0.25s ease;
  }

  .msg-row.user { flex-direction: row-reverse; }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
  }

  .avatar.ai {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    box-shadow: 0 0 16px rgba(124,106,255,0.3);
    letter-spacing: 0;
  }

  .avatar.user {
    background: rgba(124,106,255,0.2);
    border: 1px solid rgba(124,106,255,0.3);
    color: var(--accent);
  }

  .bubble {
    max-width: 72%;
    border-radius: 16px;
    padding: 12px 16px;
    font-size: 14px;
    line-height: 1.65;
  }

  .bubble.user {
    background: var(--user-bg);
    border: 1px solid rgba(124,106,255,0.2);
    border-top-right-radius: 4px;
    color: var(--text);
  }

  .bubble.ai {
    background: var(--ai-bg);
    border: 1px solid var(--border);
    border-top-left-radius: 4px;
    color: #c8c8d8;
  }

  /* Loading dots */
  .loading-dots {
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 4px 0;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    animation: bounce 1.2s infinite;
  }

  .dot:nth-child(2) { animation-delay: 0.15s; background: var(--accent2); }
  .dot:nth-child(3) { animation-delay: 0.3s; background: var(--accent3); }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  /* Input area */
  .input-area {
    padding: 16px 28px 20px;
    border-top: 1px solid var(--border);
    background: rgba(5,5,7,0.6);
    backdrop-filter: blur(20px);
  }

  .input-box {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 12px 14px;
    transition: border-color 0.2s;
  }

  .input-box:focus-within {
    border-color: rgba(124,106,255,0.4);
    box-shadow: 0 0 0 3px rgba(124,106,255,0.06);
  }

  .input-box textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    resize: none;
    line-height: 1.5;
    max-height: 120px;
    overflow-y: auto;
  }

  .input-box textarea::placeholder { color: var(--muted); }
  .input-box textarea:disabled { cursor: not-allowed; }

  .send-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    font-size: 14px;
  }

  .send-btn:hover { transform: scale(1.05); box-shadow: 0 0 16px rgba(124,106,255,0.5); }
  .send-btn:active { transform: scale(0.95); }
  .send-btn:disabled {
    background: var(--surface2);
    color: var(--muted);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .input-hint {
    text-align: center;
    font-size: 11px;
    color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    margin-top: 8px;
  }

  /* Overlay */
  .overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 20;
    backdrop-filter: blur(4px);
  }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* Scrollbar for sidebar */
  .sidebar::-webkit-scrollbar { display: none; }

  /* Mobile */
  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      transform: translateX(-100%);
      z-index: 30;
    }
    .sidebar.open { transform: translateX(0); }
    .overlay.open { display: block; }
    .hamburger { display: block; }
    .messages { padding: 20px 16px; }
    .input-area { padding: 12px 16px 16px; }
    .topbar { padding: 12px 16px; }
    .bubble { max-width: 85%; }
  }
`

export default function App() {

  const API_URL =
  window.location.hostname.includes("localhost")
    ? "http://localhost:8000"
    : "https://rag-project-sx7h.onrender.com";

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [pdfUploaded, setPdfUploaded] = useState(false)
  const [pdfName, setPdfName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
      setMessages([{ role: "ai", text: `**${file.name}** successfully uploaded! Ask Anything 🚀` }])
      setSidebarOpen(false)
    } catch {
      alert("Upload failed!")
    }
    setUploading(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || !pdfUploaded || loading) return
    const userMsg = { role: "user", text: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/ask`, { question: input })
      setMessages(prev => [...prev, { role: "ai", text: res.data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Error aaya! Dobara try karo." }])
    }
    setLoading(false)
  }

  const handleTextareaChange = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const formatText = (text) => {
    const lines = text.split('\n')
    return lines.map((line, i) => {
      if (/^\d+\.\s/.test(line)) {
        return <div key={i} style={{ display:'flex', gap:'8px', margin:'4px 0' }}>
          <span style={{ color:'var(--accent)', fontWeight:700, flexShrink:0, fontFamily:'JetBrains Mono, monospace', fontSize:'12px' }}>{line.match(/^\d+/)[0]}.</span>
          <span>{parseBold(line.replace(/^\d+\.\s/, ''))}</span>
        </div>
      }
      if (/^[-*•]\s/.test(line)) {
        return <div key={i} style={{ display:'flex', gap:'8px', margin:'4px 0', paddingLeft:'4px' }}>
          <span style={{ color:'var(--accent2)', flexShrink:0 }}>▸</span>
          <span>{parseBold(line.replace(/^[-*•]\s/, ''))}</span>
        </div>
      }
      if (/^\*\*.*\*\*$/.test(line.trim())) {
        return <div key={i} style={{ fontWeight:700, color:'var(--text)', marginTop:'12px', marginBottom:'4px', fontSize:'15px' }}>{line.replace(/\*\*/g, '')}</div>
      }
      if (line.trim() === '') return <div key={i} style={{ height:'8px' }} />
      return <div key={i} style={{ margin:'2px 0' }}>{parseBold(line)}</div>
    })
  }

  const parseBold = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return parts.map((p, j) => j % 2 === 1
      ? <strong key={j} style={{ color:'var(--text)', fontWeight:700 }}>{p}</strong>
      : p
    )
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* Overlay */}
        <div className={`overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">⚡</div>
            <div>
              <div className="logo-text">PDF Chat</div>
              <div className="logo-sub">RAG · AI</div>
            </div>
          </div>

          <button
            className="upload-btn"
            onClick={() => fileRef.current.click()}
            disabled={uploading}
          >
            {uploading
              ? <><span style={{ animation:'spin 1s linear infinite', display:'inline-block' }}>⏳</span> Uploading...</>
              : <><span style={{ fontSize:'18px' }}>＋</span> Upload PDF</>
            }
          </button>
          <input ref={fileRef} type="file" accept=".pdf" style={{ display:'none' }} onChange={uploadPDF} />

          {pdfUploaded && (
            <div className="pdf-chip">
              <div className="pdf-dot" />
              <span className="pdf-chip-name">📄 {pdfName}</span>
            </div>
          )}

          <div className="sidebar-hint">
            {[['01', 'PDF upload karo'], ['02', 'Question pucho'], ['03', 'AI jawab dega']].map(([n, t]) => (
              <div className="hint-step" key={n}>
                <div className="hint-num">{n}</div>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="main">

          {/* Topbar */}
          <div className="topbar">
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
            <div className="topbar-indicator">
              <div className={`status-dot ${pdfUploaded ? 'active' : 'inactive'}`} />
              <span className={`topbar-text ${pdfUploaded ? 'active' : ''}`}>
                {pdfUploaded ? `${pdfName}` : 'No PDF loaded'}
              </span>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:'6px' }}>
              {['⚡','🔍','✨'].map((e,i) => (
                <div key={i} style={{
                  width:28, height:28, borderRadius:8,
                  background:'var(--surface2)', border:'1px solid var(--border)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:12, cursor:'default', opacity: 0.5
                }}>{e}</div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="messages">
            {messages.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">⚡</div>
                <div>
                  <div className="empty-title">PDF ChatBot</div>
                  <div className="empty-sub" style={{ marginTop:8 }}>Upload a PDF → Ask anything</div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.role === 'user' ? 'user' : ''}`}>
                <div className={`avatar ${msg.role}`}>{msg.role === 'user' ? 'U' : 'AI'}</div>
                <div className={`bubble ${msg.role}`}>
                  {msg.role === 'ai' ? formatText(msg.text) : msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg-row">
                <div className="avatar ai">AI</div>
                <div className="bubble ai">
                  <div className="loading-dots">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="input-area">
            <div className="input-box">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder={pdfUploaded ? "Ask Anything..." : "First upload a PDF..."}
                disabled={!pdfUploaded}
                rows={1}
              />
              <button className="send-btn" onClick={sendMessage} disabled={loading || !pdfUploaded || !input.trim()}>
                ➤
              </button>
            </div>
            <div className="input-hint">↵ send · ⇧↵ new line</div>
          </div>
        </div>
      </div>
    </>
  )
}