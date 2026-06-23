import { ArrowUp, ArrowDown, Droplets, Wind } from "lucide-react";
import { getWeatherDetails, getWeatherCategory, getDestinationDate } from "../utils/weatherUtils";

const ACCENTS = {
  sunny: {
    color: "#fbbf24",
    cardGlow: "rgba(251,191,36,0.18)",
    iconGlow: "rgba(251,191,36,0.45)",
    line: "rgba(251,191,36,0.65)",
  },
  cloudy: {
    color: "#94a3b8",
    cardGlow: "rgba(148,163,184,0.1)",
    iconGlow: "rgba(148,163,184,0.3)",
    line: "rgba(148,163,184,0.45)",
  },
  rainy: {
    color: "#60a5fa",
    cardGlow: "rgba(96,165,250,0.14)",
    iconGlow: "rgba(96,165,250,0.38)",
    line: "rgba(96,165,250,0.65)",
  },
  snowy: {
    color: "#bae6fd",
    cardGlow: "rgba(186,230,253,0.12)",
    iconGlow: "rgba(186,230,253,0.35)",
    line: "rgba(186,230,253,0.55)",
  },
  stormy: {
    color: "#a78bfa",
    cardGlow: "rgba(167,139,250,0.18)",
    iconGlow: "rgba(167,139,250,0.45)",
    line: "rgba(167,139,250,0.65)",
  },
  foggy: {
    color: "#9ca3af",
    cardGlow: "rgba(156,163,175,0.08)",
    iconGlow: "rgba(156,163,175,0.25)",
    line: "rgba(156,163,175,0.35)",
  },
};

export default function CurrentWeather({ weatherData, locationDetails, unit, currentTime }) {
  const current = weatherData.current;
  const daily = weatherData.daily;
  const tempUnit = unit === "celsius" ? "°C" : "°F";
  const windUnit = unit === "celsius" ? "km/h" : "mph";

  const weather = getWeatherDetails(current.weather_code);
  const WeatherIcon = weather.icon;
  const accent = ACCENTS[getWeatherCategory(current.weather_code)] || ACCENTS.sunny;

  const localDateTimeString = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(getDestinationDate(currentTime, weatherData.utc_offset_seconds));

  const temp = Math.round(current.temperature_2m);
  const feelsLike = Math.round(current.apparent_temperature);
  const maxTemp = Math.round(daily.temperature_2m_max[0]);
  const minTemp = Math.round(daily.temperature_2m_min[0]);

  const badges = [
    {
      icon: <ArrowUp className="w-3.25 h-3.25 text-green-400" />,
      label: "High",
      val: `${maxTemp}${tempUnit}`,
    },
    {
      icon: <ArrowDown className="w-3.25 h-3.25 text-red-400" />,
      label: "Low",
      val: `${minTemp}${tempUnit}`,
    },
    {
      icon: <Droplets className="w-3.25 h-3.25 text-blue-400" />,
      label: "Precip",
      val: `${current.precipitation} mm`,
    },
    {
      icon: <Wind className="w-3.25 h-3.25 text-emerald-400" />,
      label: "Wind",
      val: `${Math.round(current.wind_speed_10m)} ${windUnit}`,
    },
  ];

  return (
    <section
      className="glass rounded-3xl overflow-hidden relative animate-fade-in-up"
      style={{ animationDelay: "0.05s" }}
    >
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${accent.line} 50%, transparent 100%)`,
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          top: -80,
          right: -80,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${accent.cardGlow}, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      <div className="relative" style={{ padding: "clamp(1.75rem, 4vw, 3rem)" }}>
        <div className="flex justify-between items-start gap-6">
          <div className="min-w-0">
            <h1
              className="font-semibold text-white leading-[1.1] tracking-tight m-0"
              style={{ fontSize: "clamp(1.65rem, 3.5vw, 2.5rem)" }}
            >
              {locationDetails.name}
            </h1>
            <p className="mt-1.5 text-[0.8rem] font-light text-slate-400/90 truncate">
              {locationDetails.fullName}
            </p>
            <p className="mt-1 text-sm font-medium" style={{ color: "rgba(99,179,255,0.9)" }}>
              {localDateTimeString}
            </p>
          </div>

          <div className="animate-float-gentle shrink-0 relative" style={{ marginTop: -4 }}>
            <div
              className="absolute rounded-full"
              style={{
                inset: -20,
                background: `radial-gradient(circle, ${accent.iconGlow}, transparent 68%)`,
                filter: "blur(14px)",
              }}
            />
            <WeatherIcon
              className={weather.color}
              style={{
                width: "clamp(70px, 9vw, 110px)",
                height: "clamp(70px, 9vw, 110px)",
                position: "relative",
                zIndex: 1,
                filter: `drop-shadow(0 0 24px ${accent.color}AA)`,
              }}
            />
          </div>
        </div>

        <div className="mt-7">
          <div className="flex items-end gap-1 leading-none">
            <span
              className="font-extralight text-white tracking-[-0.045em]"
              style={{ fontSize: "clamp(5rem, 14vw, 9.5rem)", lineHeight: 0.88 }}
            >
              {temp}
            </span>
            <span
              className="font-light text-white/55 mb-2.5 tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              {tempUnit}
            </span>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
            <span className="text-[1.2rem] font-medium text-slate-200/95">
              {weather.description}
            </span>
            <span className="text-[0.85rem] font-light text-slate-400/75">
              Feels like{" "}
              <strong className="text-slate-200/88 font-medium">
                {feelsLike}
                {tempUnit}
              </strong>
            </span>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {badges.map(({ icon, label, val }) => (
            <div
              key={label}
              className="badge"
              style={{ padding: "6px 14px", gap: 6, fontSize: "0.8rem" }}
            >
              {icon}
              <span className="text-slate-400/85">{label}</span>
              <span className="font-semibold text-slate-200/92">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
