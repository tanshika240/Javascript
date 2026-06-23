import { Compass, Sun, Sunset, Droplets, Gauge, Eye } from "lucide-react";
import { getDestinationDate } from "../utils/weatherUtils";

function MetricCard({ label, icon, footer, children }) {
  return (
    <div
      className="metric-card rounded-[20px] flex flex-col gap-4 transition-[background,border-color] duration-200"
      style={{ padding: "clamp(1.1rem, 2vw, 1.6rem)" }}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="section-label">{label}</span>
      </div>
      {children}
      {footer && (
        <p className="text-[0.7rem] font-light text-slate-400/70 -mt-1 leading-relaxed">{footer}</p>
      )}
    </div>
  );
}

function BigValue({ value, unit }) {
  return (
    <div className="flex items-end gap-1 leading-none">
      <span
        className="font-semibold text-slate-100 tracking-[-0.03em]"
        style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)", lineHeight: 1 }}
      >
        {value}
      </span>
      {unit && <span className="text-[0.85rem] font-light text-slate-400/80 mb-1">{unit}</span>}
    </div>
  );
}

function parseDecHr(iso) {
  if (!iso) return 0;
  const d = new Date(iso);
  return d.getHours() + d.getMinutes() / 60;
}

function getSolarCycle(daily, weatherData, currentTime) {
  if (!daily)
    return { progress: 0, isDaytime: true, formattedSunrise: "--", formattedSunset: "--" };
  const local = getDestinationDate(currentTime, weatherData.utc_offset_seconds);
  const now = local.getUTCHours() + local.getUTCMinutes() / 60;
  const sr = parseDecHr(daily.sunrise[0]);
  const ss = parseDecHr(daily.sunset[0]);
  const fmtTime = (s) =>
    new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(
      new Date(s),
    );
  if (now >= sr && now <= ss) {
    return {
      progress: (now - sr) / (ss - sr || 1),
      isDaytime: true,
      now,
      sr,
      ss,
      formattedSunrise: fmtTime(daily.sunrise[0]),
      formattedSunset: fmtTime(daily.sunset[0]),
    };
  }
  return {
    progress: 0,
    isDaytime: false,
    now,
    sr,
    ss,
    formattedSunrise: fmtTime(daily.sunrise[0]),
    formattedSunset: fmtTime(daily.sunset[0]),
  };
}

function getUvInfo(daily) {
  const uv = daily?.uv_index_max[0] || 0;
  const cat = [
    { min: 11, label: "Extreme", color: "#a78bfa", bg: "rgba(167,139,250,0.15)" },
    { min: 8, label: "Very High", color: "#f87171", bg: "rgba(248,113,113,0.15)" },
    { min: 6, label: "High", color: "#fb923c", bg: "rgba(251,146,60,0.15)" },
    { min: 3, label: "Moderate", color: "#facc15", bg: "rgba(250,204,21,0.15)" },
    { min: 0, label: "Low", color: "#4ade80", bg: "rgba(74,222,128,0.15)" },
  ].find((c) => uv >= c.min);
  return { uv, ...cat, pct: Math.min((uv / 12) * 100, 100) };
}

export default function WeatherMetrics({ weatherData, unit, currentTime }) {
  const current = weatherData.current;
  const daily = weatherData.daily;
  const windUnit = unit === "celsius" ? "km/h" : "mph";

  const solarCycle = getSolarCycle(daily, weatherData, currentTime);
  const uvInfo = getUvInfo(daily);
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const windDir = dirs[Math.round((current.wind_direction_10m || 0) / 45) % 8];

  const circumference = 2 * Math.PI * 28;
  const isHighPressure = current.pressure_msl >= 1013;

  return (
    <section className="w-full animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <span className="section-label block mb-4">Weather Details</span>

      <div
        className="grid grid-cols-2 lg:grid-cols-3"
        style={{ gap: "clamp(0.6rem, 1.5vw, 1rem)" }}
      >
        <MetricCard
          label="Wind"
          icon={<Compass className="w-3.75 h-3.75 text-[#63b3ff]" />}
          footer={`Gusts up to ${Math.round(daily.wind_speed_10m_max[0])} ${windUnit} today`}
        >
          <div className="flex items-center gap-5">
            <div
              className="relative w-16 h-16 shrink-0 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="absolute top-1.25 text-[8px] font-bold text-red-400 leading-none">
                N
              </span>
              <div
                className="w-1 h-9.5 rounded-sm"
                style={{
                  background:
                    "linear-gradient(to bottom, #f87171 40%, rgba(255,255,255,0.5) 50%, #60a5fa 60%)",
                  transform: `rotate(${current.wind_direction_10m}deg)`,
                  transition: "transform 1.2s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              />
            </div>
            <div>
              <BigValue value={Math.round(current.wind_speed_10m)} unit={windUnit} />
              <p className="text-[0.8rem] font-light mt-1.5 text-slate-400/90">
                From <strong className="text-slate-200/90 font-semibold">{windDir}</strong>
              </p>
            </div>
          </div>
        </MetricCard>

        <MetricCard
          label="UV Index"
          icon={<Sun className="w-3.75 h-3.75 text-amber-400" />}
          footer="Peak radiation between 11 AM – 3 PM"
        >
          <div className="flex items-center gap-5">
            <div className="relative w-16 h-16 shrink-0">
              <svg
                width="64"
                height="64"
                style={{ transform: "rotate(-90deg)", overflow: "visible" }}
              >
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke={uvInfo.color}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * uvInfo.pct) / 100}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke-dashoffset 1s ease",
                    filter: `drop-shadow(0 0 6px ${uvInfo.color})`,
                  }}
                />
              </svg>
              <div
                className="absolute inset-0 flex items-center justify-center text-[1.15rem] font-bold"
                style={{ color: uvInfo.color }}
              >
                {Math.round(uvInfo.uv)}
              </div>
            </div>
            <div>
              <div
                className="text-[0.9rem] font-semibold px-3 py-1 rounded-full inline-block"
                style={{ color: uvInfo.color, background: uvInfo.bg }}
              >
                {uvInfo.label}
              </div>
              <p className="text-[0.75rem] font-light mt-1.5 text-slate-400/85">Max today</p>
            </div>
          </div>
        </MetricCard>

        <MetricCard
          label="Humidity"
          icon={<Droplets className="w-3.75 h-3.75 text-blue-400" />}
          footer={`Dew point ${Math.round(current.temperature_2m - (100 - current.relative_humidity_2m) / 5)}° · ${current.relative_humidity_2m >= 70 ? "Feels muggy" : "Comfortable"}`}
        >
          <div className="flex items-center gap-5">
            <div
              className="w-7 h-15 shrink-0 rounded-[14px] overflow-hidden relative"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 rounded-[14px]"
                style={{
                  height: `${current.relative_humidity_2m}%`,
                  background: "linear-gradient(to top, #1d4ed8, #38bdf8)",
                  transition: "height 1s ease",
                }}
              />
            </div>
            <div>
              <BigValue value={current.relative_humidity_2m} unit="%" />
              <p className="text-[0.75rem] font-light mt-1.5 text-slate-400/85">
                Relative humidity
              </p>
            </div>
          </div>
        </MetricCard>

        <MetricCard
          label="Sunrise & Sunset"
          icon={<Sun className="w-3.75 h-3.75 text-orange-400" />}
          footer={
            solarCycle.isDaytime
              ? `${Math.floor(solarCycle.ss - solarCycle.now)}h ${Math.round(((solarCycle.ss - solarCycle.now) % 1) * 60)}m until sunset`
              : "Nighttime · sun rises tomorrow"
          }
        >
          <div className="relative h-18.5 flex items-end justify-between">
            <svg
              viewBox="0 0 200 65"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M 10 60 Q 100 8 190 60"
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {solarCycle.isDaytime && (
                <>
                  <path
                    d="M 10 60 Q 100 8 190 60"
                    fill="none"
                    stroke="url(#sun-arc-grad)"
                    strokeWidth="2.5"
                    strokeDasharray={400}
                    strokeDashoffset={400 - 400 * solarCycle.progress}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                  <circle
                    cx={10 + 180 * solarCycle.progress}
                    cy={60 - 52 * Math.sin(Math.PI * solarCycle.progress)}
                    r="5.5"
                    fill="#fbbf24"
                    style={{ filter: "drop-shadow(0 0 8px #fbbf24)" }}
                  />
                </>
              )}
              <defs>
                <linearGradient id="sun-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[0.7rem] font-medium text-slate-300/90">
                {solarCycle.formattedSunrise}
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <Sunset className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[0.7rem] font-medium text-slate-300/90">
                {solarCycle.formattedSunset}
              </span>
            </div>
          </div>
        </MetricCard>

        <MetricCard
          label="Pressure"
          icon={<Gauge className="w-3.75 h-3.75 text-violet-400" />}
          footer="Normal sea-level pressure is 1013 hPa"
        >
          <BigValue value={Math.round(current.pressure_msl)} unit="hPa" />
          <div
            className="-mt-1.5 inline-flex items-center gap-1 text-[0.75rem] font-semibold px-2.5 py-1 rounded-full"
            style={{
              color: isHighPressure ? "#4ade80" : "#f87171",
              background: isHighPressure ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
              border: `1px solid ${isHighPressure ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
            }}
          >
            {isHighPressure ? "↑ High · Stable" : "↓ Low · Unstable"}
          </div>
        </MetricCard>

        <MetricCard
          label="Visibility"
          icon={<Eye className="w-3.75 h-3.75 text-emerald-400" />}
          footer="Excellent conditions · no mist or smog"
        >
          <BigValue value="10.0" unit="km" />
          <div
            className="h-1.25 rounded-full overflow-hidden -mt-1.5"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-[90%] h-full rounded-full transition-[width] duration-1000"
              style={{ background: "linear-gradient(90deg, #34d399, #6ee7b7)" }}
            />
          </div>
        </MetricCard>
      </div>
    </section>
  );
}
