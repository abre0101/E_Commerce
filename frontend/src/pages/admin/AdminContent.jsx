import { useState } from "react";

const sections = [
  { key: "heroTitle",    label: "Hero Title",    type: "text"     },
  { key: "heroSubtitle", label: "Hero Subtitle", type: "text"     },
  { key: "heroImage",    label: "Hero Image URL",type: "text"     },
  { key: "aboutSection", label: "About Text",    type: "textarea" },
  { key: "contactEmail", label: "Contact Email", type: "email"    },
  { key: "contactPhone", label: "Contact Phone", type: "text"     },
];

export default function AdminContent() {
  const [content, setContent] = useState({
    heroTitle: "Enhance Your Natural Beauty",
    heroSubtitle: "Premium quality human hair extensions and wigs for every style",
    heroImage: "/asset/yada3.png",
    aboutSection: "Yada Hair provides authentic, high-quality hair products sourced directly from Cambodia.",
    contactEmail: "hello@yadahair.com",
    contactPhone: "+251 911 000 000",
  });

  const [editing, setEditing] = useState(null);
  const [temp, setTemp] = useState({});

  const startEdit = key => { setEditing(key); setTemp({ ...content }); };
  const cancelEdit = () => setEditing(null);
  const saveEdit = () => { setContent(temp); setEditing(null); };

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-green-200 transition-all";
  const inputStyle = { borderColor: "#d1d5db", color: "#111827" };

  return (
    <div className="space-y-5 max-w-5xl">

      <div className="grid md:grid-cols-2 gap-5">
        {/* Editable sections */}
        <div className="space-y-3">
          <p className="font-bold text-sm uppercase tracking-wider" style={{ color: "#6b7280" }}>Page Content</p>
          {sections.map(s => (
            <div key={s.key} className="bg-white rounded-2xl border p-4 transition-all hover:shadow-sm"
              style={{ borderColor: editing === s.key ? "#16a34a" : "#e5e7eb" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>
                {s.label}
              </p>

              {editing === s.key ? (
                <div className="space-y-3">
                  {s.type === "textarea" ? (
                    <textarea
                      value={temp[s.key]}
                      onChange={e => setTemp({ ...temp, [s.key]: e.target.value })}
                      rows={3}
                      className={inputCls}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  ) : (
                    <input
                      type={s.type}
                      value={temp[s.key]}
                      onChange={e => setTemp({ ...temp, [s.key]: e.target.value })}
                      className={inputCls}
                      style={inputStyle}
                    />
                  )}
                  <div className="flex gap-2">
                    <button onClick={saveEdit}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ background: "linear-gradient(135deg,#34d399,#10b981)" }}>
                      Save
                    </button>
                    <button onClick={cancelEdit}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold"
                      style={{ background: "rgba(22,163,74,0.08)", color: "#16a34a" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm line-clamp-2 flex-1" style={{ color: "#111827" }}>
                    {content[s.key]}
                  </p>
                  <button onClick={() => startEdit(s.key)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 text-white"
                    style={{ background: "linear-gradient(135deg,#15803d,#22c55e)" }}>
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live preview */}
        <div>
          <p className="font-bold text-sm uppercase tracking-wider mb-3" style={{ color: "#6b7280" }}>Live Preview</p>
          <div className="bg-white rounded-2xl border overflow-hidden sticky top-4" style={{ borderColor: "#e5e7eb" }}>
            <div className="h-44 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${content.heroImage})`, background: "#111827" }}>
              <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                <div>
                  <p className="text-white font-bold text-lg leading-tight">{content.heroTitle}</p>
                  <p className="text-white/70 text-xs mt-1">{content.heroSubtitle}</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#6b7280" }}>About</p>
                <p className="text-sm" style={{ color: "#111827" }}>{content.aboutSection}</p>
              </div>
              <div className="pt-3 border-t grid grid-cols-2 gap-3" style={{ borderColor: "#f3f4f6" }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#6b7280" }}>Email</p>
                  <p className="text-xs font-semibold" style={{ color: "#16a34a" }}>{content.contactEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#6b7280" }}>Phone</p>
                  <p className="text-xs font-semibold" style={{ color: "#16a34a" }}>{content.contactPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
