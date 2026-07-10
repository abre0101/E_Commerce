import { useEffect, useRef, useState, useCallback } from "react";

// Uses OpenStreetMap Nominatim — completely free, no API key needed
const NOMINATIM = "https://nominatim.openstreetmap.org/search";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function AddressPicker({
  value,
  onChange,
  required,
  placeholder = "Search your delivery address",
}) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(!!value);
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 400);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch suggestions from Nominatim
  useEffect(() => {
    if (selected || debouncedQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    fetch(
      `${NOMINATIM}?q=${encodeURIComponent(debouncedQuery)}&countrycodes=et&format=json&addressdetails=1&limit=6`,
      {
        signal: controller.signal,
        headers: { "Accept-Language": "en" },
      }
    )
      .then((r) => r.json())
      .then((data) => {
        setSuggestions(data);
        setOpen(data.length > 0);
      })
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
    onChange(address, {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    });
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
      {/* Input */}
      <div className="relative">
        {/* Pin icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-sand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <input
          required={required}
          placeholder={placeholder}
          className="form-input pl-9 pr-9"
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          autoComplete="off"
        />

        {/* Right: spinner or clear */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <svg className="w-4 h-4 text-sand-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : query ? (
            <button type="button" onClick={handleClear}
              className="text-sand-300 hover:text-sand-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-sand-200 shadow-float overflow-hidden animate-fade-in">
          {suggestions.map((item) => (
            <li key={item.place_id}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-4 py-3 text-sm text-espresso hover:bg-sand-50 transition-colors flex items-start gap-3 border-b border-sand-50 last:border-0"
              >
                <svg className="w-4 h-4 text-sand-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-2 leading-snug">{item.display_name}</span>
              </button>
            </li>
          ))}
          <li className="px-4 py-2 text-[10px] text-sand-300 text-right">
            © OpenStreetMap contributors
          </li>
        </ul>
      )}
    </div>
  );
}
