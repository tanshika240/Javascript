import { useState } from "react";
import { getWeatherDetails, getDestinationDate } from "../utils/weatherUtils";
import { Droplets, Wind, Thermometer } from "lucide-react";

function buildHourlyList(weatherData, currentTime) {
  const hourly = weatherData?.hourly;
  if (!hourly) return [];
  const offset = weatherData.utc_offset_seconds;
  const dest = getDestinationDate(currentTime, offset);
  const yr = dest.getUTCFullYear();
  const mo = String(dest.getUTCMonth() + 1).padStart(2, "0");
  const dy = String(dest.getUTCDate()).padStart(2, "0");
  const hr = String(dest.getUTCHours()).padStart(2, "0");
  const iso = `${yr}-${mo}-${dy}T${hr}:00`;
  let start = hourly.time.findIndex((t) => t.startsWith(iso));
  if (start === -1) start = 0;
  return hourly.time.slice(start, start + 25).map((t, idx) => {
    const date = new Date(t);
    const h = date.getHours();
    const disp = h % 12 === 0 ? 12 : h % 12;
    return {
      id: idx,
      label: idx === 0 ? "Now" : `${disp} ${h >= 12 ? "PM" : "AM"}`,
      temp: Math.round(hourly.temperature_2m[start + idx]),
      code: hourly.weather_code[start + idx],
      precip: hourly.precipitation_probability[start + idx],
      humidity: hourly.relative_humidity_2m[start + idx],
      wind: Math.round(hourly.wind_speed_10m[start + idx]),
    };
  });
}

function buildSparkline(hourlyList, displayIdx) {
  if (hourlyList.length < 2) return null;
  const temps = hourlyList.map((h) => h.temp);
  const mn = Math.min(...temps);
  const mx = Math.max(...temps);
  const range = mx - mn || 1;
  const W = 1000;
  const H = 72;
  const PAD = 12;
  const pts = hourlyList.map((h, i) => ({
    x: (i / (hourlyList.length - 1)) * W,
    y: PAD + (H - PAD * 2) * (1 - (h.temp - mn) / range),
    temp: h.temp,
  }));
  let linePath = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const cx = (p0.x + p1.x) / 2;
    linePath += ` C ${cx.toFixed(1)} ${p0.y.toFixed(1)}, ${cx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  const ap = pts[displayIdx] || pts[0];
  return {
    linePath,
    fillPath: `${linePath} L ${W} ${H} L 0 ${H} Z`,
    ap,
    apPct: (ap.x / W) * 100,
  };
}

export default function HourlyForecast({ weatherData, unit, currentTime }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState(null);
  const tempUnit = unit === "celsius" ? "°C" : "°F";
  const windUnit = unit === "celsius" ? "km/h" : "mph";

  const hourlyList = buildHourlyList(weatherData, currentTime);
  const displayIdx = hoverIdx !== null ? hoverIdx : activeIdx;
  const active = hourlyList[displayIdx] || hourlyList[0];
  const sparkline = buildSparkline(hourlyList, displayIdx);

  return (
    <section className="glass rounded-3xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div style={{ padding: "clamp(1.5rem, 3vw, 2.5rem)" }}>
        <div className="flex items-center justify-between mb-6">
          <span className="section-label">Hourly Forecast</span>
          <span className="text-[0.68rem] text-slate-400/60 tracking-[0.01em]">
            Hover to preview · Click to pin
          </span>
        </div>

        {sparkline && (
          <div className="relative mb-5">
            <svg
              viewBox="0 0 1000 72"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="w-full block"
              style={{ height: 72 }}
            >
              <defs>
                <linearGradient id="spark-fill-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={sparkline.fillPath} fill="url(#spark-fill-grad)" />
              <path
                d={sparkline.linePath}
                fill="none"
                stroke="rgba(56,189,248,0.75)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1={sparkline.ap.x}
                y1={0}
                x2={sparkline.ap.x}
                y2={72}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1.5"
                strokeDasharray="4,3"
              />
              <circle cx={sparkline.ap.x} cy={sparkline.ap.y} r="8" fill="rgba(56,189,248,0.15)" />
              <circle
                cx={sparkline.ap.x}
                cy={sparkline.ap.y}
                r="4"
                fill="#38bdf8"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.5"
              />
            </svg>
            <div
              aria-hidden="true"
              className="absolute top-0.5 pointer-events-none whitespace-nowrap text-[10px] font-bold text-sky-400 -translate-x-1/2"
              style={{
                left: `${Math.min(Math.max(sparkline.apPct, 5), 92)}%`,
                textShadow: "0 1px 4px rgba(0,0,0,0.6)",
              }}
            >
              {sparkline.ap.temp}
              {tempUnit}
            </div>
          </div>
        )}

        <div
          onMouseLeave={() => setHoverIdx(null)}
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            overflowY: "hidden",
            paddingTop: 6,
            paddingLeft: 4,
            paddingRight: 4,
            paddingBottom: 10,
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {hourlyList.map((item, idx) => {
            const wd = getWeatherDetails(item.code);
            const Icon = wd.icon;
            const isActive = idx === displayIdx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setHoverIdx(idx)}
                style={{
                  minWidth: 72,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "14px 10px",
                  borderRadius: 14,
                  cursor: "pointer",
                  scrollSnapAlign: "start",
                  transition: "all 0.18s ease",
                  border: isActive
                    ? "1px solid rgba(56,189,248,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: isActive
                    ? "linear-gradient(160deg, rgba(56,189,248,0.18), rgba(99,102,241,0.14))"
                    : "rgba(8,12,28,0.35)",
                  transform: isActive ? "scale(1.07)" : "scale(1)",
                  boxShadow: isActive ? "0 0 22px rgba(56,189,248,0.15)" : "none",
                }}
              >
                <span
                  className="text-[11px] font-medium mb-2.5"
                  style={{ color: isActive ? "#fff" : "rgba(148,163,184,0.85)" }}
                >
                  {item.label}
                </span>
                <Icon className={`${wd.color} mb-2.5`} style={{ width: 22, height: 22 }} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: isActive ? "#fff" : "rgba(226,232,240,0.95)" }}
                >
                  {item.temp}°
                </span>
                {item.precip > 20 && (
                  <span
                    className="mt-1.5 text-[10px] font-medium"
                    style={{
                      color: "rgba(147,210,255,0.85)",
                      background: "rgba(56,189,248,0.1)",
                      border: "1px solid rgba(56,189,248,0.2)",
                      borderRadius: 999,
                      padding: "2px 6px",
                    }}
                  >
                    {item.precip}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {active && (
          <div className="mt-6 pt-6 border-t border-white/6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="text-[0.75rem] font-light text-slate-400/75">
              {active.label === "Now" ? "Current conditions" : `At ${active.label}`}
            </span>
            {[
              {
                icon: <Thermometer className="w-3.25 h-3.25 text-orange-400" />,
                val: `${active.temp}${tempUnit}`,
              },
              {
                icon: <Droplets className="w-3.25 h-3.25 text-blue-400" />,
                val: `${active.humidity}% RH`,
              },
              {
                icon: <Wind className="w-3.25 h-3.25 text-emerald-400" />,
                val: `${active.wind} ${windUnit}`,
              },
              { icon: <span className="text-[11px]">💧</span>, val: `${active.precip}% rain` },
            ].map(({ icon, val }, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {icon}
                <span className="text-[0.875rem] font-medium text-slate-200/85">{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
