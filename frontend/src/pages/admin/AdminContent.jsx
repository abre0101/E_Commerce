import { useState } from "react";

const GOLD = "#C9A961";
const CARD = { background: "#111", border: "1px solid rgba(201,169,97,0.15)" };
const inputCls = "w-full px-3 py-2.5 text-sm border outline-none transition";
const inputStyle = { borderColor: "#333", color: "#fff", background: "transparent" };

const sections = [
  { key: "heroTitle",    label: "Hero Title",     type: "text"     },
  { key: "heroSubtitle", label: "Hero Subtitle",  type: "text"     },
  { key: "heroImage",    label: "Hero Image URL", type: "text"     },
  { key: "aboutSection", label: "About Text",     type: "textarea" },
  { key: "contactEmail", label: "Contact Email",  type: "email"    },
  { key: "contactPhone", label: "Contact Phone",  type: "text"     },
];

export default function AdminContent() {
  const [content, setContent] = useState({
    heroTitle:    "Enhance Your Natural Beauty",
    heroSubtitle: "Premium quality human hair extensions and wigs for every style",
    heroImage:    "/asset/yada3.png",
    aboutSection: "Yada Hair provides authentic, high-quality hair products sourced directly from Cambodia.",
    contactEmail: "hello@yadahair.com",
    contactPhone: "+251 911 000 000",
  });
  const [editing, setEditing] = useState(null);
  const [temp, setTemp] = useState({});

  const startEdit = key => { setEditing(key); setTemp({ ...content }); };
  const cancelEdit = () => setEditing(null);
  const saveEdit = () => { setContent(temp); setEditing(null); };

  const fo = e => { e.currentTarget.style.borderColor = GOLD; };
  const fb = e => { e.currentTarget.style.borderColor = "#333"; };

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="grid md:grid-cols-2 gap-5">
        {/* Editable sections */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Page Content</p>
          {sections.map(s => (
            <div key={s.key} className="p-4 border transition-all"
              style={{ background: "#111", borderColor: editing === s.key ? GOLD : "rgba(201,169,97,0.15)" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>{s.label}</p>
              {editing === s.key ? (
                <div className="space-y-3">
                  {s.type === "textarea" ? (
                    <textarea value={temp[s.key]} onChange={e => setTemp({ ...temp, [s.key]: e.target.value })}
                      rows={3} className={`${inputCls} resize-none`} style={inputStyle} onFocus={fo} onBlur={fb} />
                  ) : (
                    <input type={s.type} value={temp[s.key]} onChange={e => setTemp({ ...temp, [s.key]: e.target.value })}
                      className={inputCls} style={inputStyle} onFocus={fo} onBlur={fb} />
                  )}
                  <div className="flex gap-2">
                    <button onClick={saveEdit}
                      className="flex-1 py-2 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                      style={{ background: GOLD, color: "#111" }}>Save</button>
                    <button onClick={cancelEdit}
                      className="flex-1 py-2 text-sm font-semibold border transition-all"
                      style={{ borderColor: "#333", color: "#888" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm line-clamp-2 flex-1" style={{ color: "#ccc" }}>{content[s.key]}</p>
                  <button onClick={() => startEdit(s.key)}
                    className="px-3 py-1.5 text-xs font-semibold border shrink-0 transition-all"
                    style={{ borderColor: "rgba(201,169,97,0.3)", color: GOLD }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live preview */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: GOLD }}>Live Preview</p>
          <div className="border overflow-hidden sticky top-4" style={{ background: "#111", borderColor: "rgba(201,169,97,0.15)" }}>
            <div className="h-44 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${content.heroImage})`, background: "#0d0d0d" }}>
              <div className="absolute inset-0 flex items-end p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
                <div>
                  <p className="text-white font-serif font-bold text-lg leading-tight">{content.heroTitle}</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{content.heroSubtitle}</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD }}>About</p>
                <p className="text-sm" style={{ color: "#aaa" }}>{content.aboutSection}</p>
              </div>
              <div className="pt-3 border-t grid grid-cols-2 gap-3" style={{ borderColor: "#1a1a1a" }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD }}>Email</p>
                  <p className="text-xs font-semibold" style={{ color: "#ccc" }}>{content.contactEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD }}>Phone</p>
                  <p className="text-xs font-semibold" style={{ color: "#ccc" }}>{content.contactPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
