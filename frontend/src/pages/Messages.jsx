import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { IconMessage, IconSend } from "../components/Icons";
import api from "../services/api";
import useAuthStore from "../store/useAuthStore";

export default function Messages() {
  const { userId } = useParams();
  const { user } = useAuthStore();
  const [inbox, setInbox] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [activeUser, setActiveUser] = useState(userId || null);
  const bottom = useRef(null);

  useEffect(() => { api.get("/messages/inbox").then((r) => setInbox(r.data)); }, []);

  useEffect(() => {
    if (activeUser) api.get(`/messages/conversation/${activeUser}`).then((r) => setMessages(r.data));
  }, [activeUser]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await api.post("/messages/send", { receiver_id: activeUser, text });
    setText("");
    const r = await api.get(`/messages/conversation/${activeUser}`);
    setMessages(r.data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-5">Messages</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex h-[600px]">
        {/* Inbox sidebar */}
        <div className="w-64 border-r border-gray-100 shrink-0 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {inbox.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center px-4">
                <IconMessage size={28} className="mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              inbox.map((c) => (
                <button key={c.with_user} onClick={() => setActiveUser(c.with_user)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 text-left transition-colors ${
                    activeUser === c.with_user
                      ? "bg-gray-50 border-l-2 border-l-accent-500"
                      : "hover:bg-gray-50"
                  }`}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-brand text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {c.with_user?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{c.with_user}</p>
                    <p className="text-xs text-gray-400 truncate">{c.last_message?.text}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {!activeUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <IconMessage size={40} className="mb-3 opacity-30" />
              <p className="font-medium text-gray-500">Select a conversation</p>
              <p className="text-sm mt-1">Choose from the left to start messaging</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-brand text-white flex items-center justify-center font-bold text-sm">
                    {activeUser?.[0]?.toUpperCase()}
                  </div>
                  <p className="font-semibold text-sm text-gray-800">{activeUser}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.sender_id === user?.id
                        ? "bg-[#1a1a2e] text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={bottom} />
              </div>

              {/* Input */}
              <form onSubmit={send} className="border-t border-gray-100 p-3 flex gap-2.5 bg-gray-50/50">
                <input value={text} onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-300 transition-colors" />
                <button type="submit"
                  className="w-10 h-10 bg-accent-500 hover:bg-accent-600 text-white rounded-xl flex items-center justify-center shrink-0 transition-colors active:scale-95">
                  <IconSend size={15} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
