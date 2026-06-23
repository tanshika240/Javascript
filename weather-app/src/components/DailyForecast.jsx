import { useState } from "react";
import { getWeatherDetails } from "../utils/weatherUtils";
import { ChevronDown, Sun, Wind, Droplets, Zap } from "lucide-react";

const fmt = (s) =>
  s
    ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(
        new Date(s),
      )
    : "--";

export default function DailyForecast({ weatherData, unit }) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const daily = weatherData.daily;
  const windUnit = unit === "celsius" ? "km/h" : "mph";

  const list = !daily
    ? []
    : daily.time.map((t, idx) => {
        const date = new Date(t);
        const isToday = idx === 0;
        return {
          id: idx,
          label: isToday
            ? "Today"
            : new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
          dayFull: new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          }).format(date),
          isToday,
          min: Math.round(daily.temperature_2m_min[idx]),
          max: Math.round(daily.temperature_2m_max[idx]),
          code: daily.weather_code[idx],
          precip: daily.precipitation_probability_max[idx],
          precipSum: daily.precipitation_sum[idx],
          uv: daily.uv_index_max[idx],
          wind: Math.round(daily.wind_speed_10m_max[idx]),
          sunrise: fmt(daily.sunrise[idx]),
          sunset: fmt(daily.sunset[idx]),
        };
      });

  return (
    <section
      className="glass rounded-3xl overflow-hidden animate-fade-in-up"
      style={{ animationDelay: "0.15s" }}
    >
      <div style={{ padding: "clamp(1.5rem, 3vw, 2.5rem)" }}>
        <span className="section-label">7-Day Forecast</span>

        <div className="mt-6 flex flex-col gap-0.5">
          {list.map((day, idx) => {
            const wd = getWeatherDetails(day.code);
            const Icon = wd.icon;
            const isOpen = expandedIdx === idx;

            return (
              <div
                key={day.id}
                className="rounded-2xl overflow-hidden transition-all duration-250"
                style={{
                  background: day.isToday
                    ? "rgba(56,189,248,0.07)"
                    : isOpen
                      ? "rgba(255,255,255,0.045)"
                      : "transparent",
                  border: day.isToday
                    ? "1px solid rgba(56,189,248,0.18)"
                    : isOpen
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid transparent",
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedIdx(isOpen ? null : idx)}
                  className="w-full flex items-center text-left cursor-pointer bg-transparent border-0 min-h-15.5 px-5 py-4"
                  style={{ gap: "clamp(0.5rem, 2vw, 1.25rem)" }}
                >
                  <div className="w-20 shrink-0">
                    <div
                      className="text-[0.9rem] font-semibold leading-[1.2]"
                      style={{
                        color: day.isToday ? "rgba(99,179,255,0.95)" : "rgba(226,232,240,0.9)",
                      }}
                    >
                      {day.label}
                    </div>
                    <div className="text-[0.7rem] font-light mt-0.5 text-slate-400/70">
                      {day.dayFull.split(",")[0]}
                    </div>
                  </div>

                  <div className="flex-1 flex items-center gap-2.5 min-w-0">
                    <Icon className={`shrink-0 ${wd.color} w-5 h-5`} />
                    <span className="text-[0.82rem] font-light text-slate-400/90 truncate">
                      {wd.description}
                    </span>
                    {day.precip > 20 && (
                      <span
                        className="shrink-0 text-[10px] font-medium px-1.75 py-0.5 rounded-full"
                        style={{
                          background: "rgba(56,189,248,0.1)",
                          color: "rgba(147,210,255,0.85)",
                          border: "1px solid rgba(56,189,248,0.15)",
                        }}
                      >
                        {day.precip}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[0.82rem] font-normal text-slate-400/80">{day.min}°</span>
                    <span className="text-[0.75rem] text-slate-400/40">→</span>
                    <span className="text-[0.88rem] font-semibold text-slate-200/95">
                      {day.max}°
                    </span>
                  </div>

                  <ChevronDown
                    className="w-4 h-4 shrink-0 text-slate-500/65 transition-transform duration-250"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? 200 : 0,
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.3s ease, opacity 0.25s ease",
                  }}
                >
                  <div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 px-5 pb-5 pt-0 border-t border-white/6"
                    style={{ paddingTop: "0.75rem" }}
                  >
                    {[
                      {
                        icon: <Zap className="w-3.25 h-3.25 text-yellow-400" />,
                        label: "UV Max",
                        val: `${day.uv}`,
                      },
                      {
                        icon: <Wind className="w-3.25 h-3.25 text-emerald-400" />,
                        label: "Wind",
                        val: `${day.wind} ${windUnit}`,
                      },
                      {
                        icon: <Droplets className="w-3.25 h-3.25 text-blue-400" />,
                        label: "Precip",
                        val: `${day.precipSum} mm`,
                      },
                      {
                        icon: <Sun className="w-3.25 h-3.25 text-orange-400" />,
                        label: "Sunrise",
                        val: day.sunrise,
                      },
                    ].map(({ icon, label, val }) => (
                      <div key={label} className="micro-card">
                        <div className="flex items-center gap-1">
                          {icon}
                          <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400/85">
                            {label}
                          </span>
                        </div>
                        <span className="text-[0.85rem] font-semibold mt-0.5 text-slate-200/90">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
