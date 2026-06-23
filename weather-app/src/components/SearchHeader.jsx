import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";

const DROPDOWN_STYLE = {
  zIndex: 100,
  background: "rgba(8,12,28,0.9)",
  backdropFilter: "blur(28px)",
  WebkitBackdropFilter: "blur(28px)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 32px 80px rgba(0,0,0,0.75)",
};

export default function SearchHeader({ onLocationSelect, unit, onUnitToggle }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) return;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`,
        );
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 380);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleGeoLocate = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const data = await res.json();
          const city = data.city || data.locality || "Current Location";
          const full = data.principalSubdivision
            ? `${city}, ${data.principalSubdivision}, ${data.countryName}`
            : `${city}, ${data.countryName}`;
          onLocationSelect({ latitude, longitude, name: city, fullName: full });
        } catch {
          onLocationSelect({
            latitude,
            longitude,
            name: "Current Location",
            fullName: "GPS Coordinates",
          });
        } finally {
          setGeoLoading(false);
          setQuery("");
          setShowDropdown(false);
        }
      },
      () => {
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const selectSuggestion = (item) => {
    const full = [item.name, item.admin1, item.country].filter(Boolean).join(", ");
    onLocationSelect({
      latitude: item.latitude,
      longitude: item.longitude,
      name: item.name,
      fullName: full,
    });
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <header className="relative z-50 w-full animate-fade-in-up">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 min-w-0" ref={dropdownRef}>
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400/60" />
          <input
            type="text"
            placeholder="Search city or location..."
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              if (v.trim().length < 2) setSuggestions([]);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="glass-input w-full pl-16 pr-14 py-4.5 rounded-2xl text-[15px] font-light placeholder:text-slate-400/50 tracking-wide"
          />
          {loading && (
            <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-slate-400/50" />
          )}

          {showDropdown && suggestions.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-3.5 rounded-2xl overflow-hidden animate-fade-in-up"
              style={DROPDOWN_STYLE}
            >
              {suggestions.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectSuggestion(item)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-white/[0.07]"
                  style={{
                    borderBottom:
                      idx < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <MapPin
                      className="w-5 h-5 shrink-0"
                      style={{ color: "rgba(99,179,255,0.9)" }}
                    />
                    <span className="text-base font-medium text-white/90">{item.name}</span>
                  </div>
                  <span className="text-sm ml-2 shrink-0 text-slate-400/85">
                    {[item.admin1, item.country].filter(Boolean).join(", ")}
                  </span>
                </button>
              ))}
            </div>
          )}

          {showDropdown && query.trim().length >= 2 && suggestions.length === 0 && !loading && (
            <div
              className="absolute top-full left-0 right-0 mt-3.5 rounded-2xl px-6 py-5 text-base text-center animate-fade-in-up text-slate-400/85"
              style={DROPDOWN_STYLE}
            >
              No results found
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleGeoLocate}
            disabled={geoLoading}
            className="glass glass-hover flex items-center gap-3 px-8 py-4.5 rounded-2xl text-base font-medium cursor-pointer disabled:opacity-40 whitespace-nowrap text-slate-300/90"
          >
            {geoLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#63b3ff" }} />
            ) : (
              <MapPin className="w-5 h-5" style={{ color: "#63b3ff" }} />
            )}
            <span className="hidden sm:inline">Locate</span>
          </button>

          <div
            className="flex rounded-2xl p-1.5 gap-1.5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {["celsius", "fahrenheit"].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => onUnitToggle(u)}
                className="px-6 py-3.5 rounded-xl text-base font-medium cursor-pointer transition-all duration-200"
                style={
                  unit === u
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(56,189,248,0.3), rgba(99,102,241,0.3))",
                        color: "#fff",
                        border: "1px solid rgba(56,189,248,0.3)",
                        boxShadow: "0 0 16px rgba(56,189,248,0.12)",
                      }
                    : { color: "rgba(148,163,184,0.7)", border: "1px solid transparent" }
                }
              >
                {u === "celsius" ? "°C" : "°F"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
