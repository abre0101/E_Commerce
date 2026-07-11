import { useEffect, useRef, useState } from "react";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const inputCls = "w-full px-4 py-3 text-sm border outline-none transition focus:border-yellow-500";
const inputStyle = { borderColor: "#333", color: "#fff", background: "transparent" };

export default function AddressPicker({ value, onChange, required, placeholder = "Search your delivery address" }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(!!value);
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (selected || debouncedQuery.length < 3) { setSuggestions([]); return; }
    setLoading(true);
    const controller = new AbortController();
    fetch(
      `${NOMINATIM}?q=${encodeURIComponent(debouncedQuery)}&countrycodes=et&format=json&addressdetails=1&limit=6`,
      { signal: controller.signal, headers: { "Accept-Language": "en" } }
    )
      .then((r) => r.json())
      .then((data) => { setSuggestions(data); setOpen(data.length > 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [debouncedQuery, selected]);

  const handleSelect = (item) => {
    const address = item.display_name;
    setQuery(address);
    setSelected(true);
    setOpen(false);
    setSuggestions([]);
    onChange(address, { lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelected(false);
    onChange(e.target.value, null);
  };

  const handleClear = () => {
    setQuery("");
    setSelected(false);
    onChange("", null);
    setSuggestions([]);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4" style={{ color: "#666" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <input
          required={required}
          placeholder={placeholder}
          className={inputCls}
          style={{ ...inputStyle, paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <svg className="w-4 h-4 animate-spin" style={{ color: "#666" }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : query ? (
            <button type="button" onClick={handleClear} style={{ color: "#888" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 overflow-hidden" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
          {suggestions.map((item) => (
            <li key={item.place_id}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left flex items-start gap-3 px-4 py-3 text-sm transition-colors"
                style={{ color: "#ddd", borderBottom: "1px solid #222" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#C9A961" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-2 leading-snug">{item.display_name}</span>
              </button>
            </li>
          ))}
          <li className="px-4 py-1.5 text-[10px] text-right" style={{ color: "#555" }}>© OpenStreetMap contributors</li>
        </ul>
      )}
    </div>
  );
}
