import { useState } from "react";
import useAuthStore from "../store/useAuthStore";

const MSGS_KEY = "yada_messages";

function loadMessages() {
  try { return JSON.parse(localStorage.getItem(MSGS_KEY) || "[]"); }
  catch { return []; }
}

function saveMessages(msgs) {
  localStorage.setItem(MSGS_KEY, JSON.stringify(msgs));
}

const SUPPORT_USER = "Yada Hair Support";

export default function Messages() {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState(loadMessages);
  const [text, setText] = useState("");

  const myMessages = messages.filter(
    (m) => m.userId === user?.id || m.sender === SUPPORT_USER
  );

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = {
      id:     Date.now(),
      userId: user?.id,
      sender: user?.name,
      text:   text.trim(),
      ts:     new Date().toISOString(),
      fromSupport: false,
    };
    const updated = [...messages, msg];
    saveMessages(updated);
    setMessages(updated);
    setText("");

    // Auto-reply after 800ms
    setTimeout(() => {
      const reply = {
        id:          Date.now() + 1,
        userId:      user?.id,
        sender:      SUPPORT_USER,
        text:        "Thanks for reaching out! We'll get back to you shortly. For urgent inquiries please call +251 91 123 4567.",
        ts:          new Date().toISOString(),
        fromSupport: true,
      };
      const withReply = [...updated, reply];
      saveMessages(withReply);
      setMessages(withReply);
    }, 800);
  };

  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      <div className="max-w-2xl mx-auto px-5 py-14">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "#C9A961" }}>Account</p>
        <h1 className="font-serif text-3xl font-bold mb-8" style={{ color: "#fff" }}>Messages</h1>

        <div className="border flex flex-col" style={{ background: "#111", borderColor: "#222", height: 520 }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "#222" }}>
            <div className="w-9 h-9 flex items-center justify-center text-black font-bold text-sm"
              style={{ background: "#C9A961" }}>Y</div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#fff" }}>Yada Hair Support</p>
              <p className="text-xs" style={{ color: "#888" }}>Usually replies within a few hours</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {myMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg className="w-10 h-10 mb-3 opacity-30" style={{ color: "#C9A961" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm font-semibold" style={{ color: "#fff" }}>No messages yet</p>
                <p className="text-xs mt-1" style={{ color: "#888" }}>Send us a message and we'll get back to you.</p>
              </div>
            ) : (
              myMessages.map((m) => (
                <div key={m.id} className={`flex ${m.fromSupport ? "justify-start" : "justify-end"}`}>
                  <div className="max-w-[70%] px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      background:   m.fromSupport ? "#1e1e1e" : "#C9A961",
                      color:        m.fromSupport ? "#ddd"    : "#111",
                      borderRadius: m.fromSupport ? "0 16px 16px 16px" : "16px 0 16px 16px",
                    }}>
                    {m.fromSupport && (
                      <p className="text-[10px] font-bold mb-1 uppercase tracking-wide" style={{ color: "#C9A961" }}>
                        {SUPPORT_USER}
                      </p>
                    )}
                    {m.text}
                    <p className="text-[10px] mt-1 opacity-60">
                      {new Date(m.ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex gap-3 p-4 border-t" style={{ borderColor: "#222" }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 text-sm border outline-none transition focus:border-yellow-500"
              style={{ background: "transparent", borderColor: "#333", color: "#fff" }}
            />
            <button type="submit"
              className="px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all hover:opacity-90"
              style={{ background: "#C9A961", color: "#111" }}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
