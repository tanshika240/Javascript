import { getWeatherCategory } from "../utils/weatherUtils";

const BACKGROUNDS = {
  sunny: {
    gradient: "from-amber-950/40 via-sky-900/40 to-[#040712]",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop",
    accent: "rgba(251,191,36,0.06)",
  },
  cloudy: {
    gradient: "from-slate-700/30 via-slate-800/40 to-[#040712]",
    image:
      "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1920&auto=format&fit=crop",
    accent: "rgba(148,163,184,0.04)",
  },
  rainy: {
    gradient: "from-sky-950/40 via-indigo-950/50 to-[#040712]",
    image:
      "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?q=80&w=1920&auto=format&fit=crop",
    accent: "rgba(96,165,250,0.06)",
  },
  snowy: {
    gradient: "from-blue-950/30 via-slate-900/40 to-[#040712]",
    image:
      "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=1920&auto=format&fit=crop",
    accent: "rgba(186,230,253,0.05)",
  },
  stormy: {
    gradient: "from-violet-950/40 via-slate-950/50 to-[#040712]",
    image:
      "https://images.unsplash.com/photo-1461088945293-0c17689e48ac?q=80&w=1920&auto=format&fit=crop",
    accent: "rgba(167,139,250,0.05)",
  },
  foggy: {
    gradient: "from-zinc-800/30 via-slate-900/40 to-[#040712]",
    image:
      "https://images.unsplash.com/photo-1494548162494-384bba4ab999?q=80&w=1920&auto=format&fit=crop",
    accent: "rgba(161,161,170,0.04)",
  },
};

export default function Background({ weatherCode }) {
  const category = getWeatherCategory(weatherCode);
  const config = BACKGROUNDS[category] || BACKGROUNDS.sunny;

  const rainDrops = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${(i * 2.1) % 100}%`,
    delay: `${(i * 0.11) % 2.5}s`,
    duration: `${0.7 + ((i * 0.06) % 0.5)}s`,
  }));

  const snowflakes = Array.from({ length: 55 }).map((_, i) => ({
    id: i,
    left: `${(i * 1.9) % 100}%`,
    size: `${2 + ((i * 2.5) % 5)}px`,
    delay: `${(i * 0.21) % 7}s`,
    duration: `${5 + ((i * 0.19) % 4)}s`,
  }));

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden select-none pointer-events-none"
      style={{ zIndex: -10 }}
    >
      {/* Background photo with high blur for mesh gradient effect */}
      <img
        src={config.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "brightness(0.55) saturate(1.4) contrast(1.05) blur(60px)",
          transform: "scale(1.16)",
          transition: "all 1.2s ease",
        }}
      />

      {/* Weather-specific accent orb */}
      {category === "sunny" && (
        <div
          className="absolute animate-pulse-glow"
          style={{
            top: "-5%",
            right: "-8%",
            width: "55%",
            aspectRatio: "1",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      )}
      {category === "rainy" && (
        <div
          className="absolute"
          style={{
            top: "0",
            left: "0",
            right: "0",
            height: "40%",
            background: "linear-gradient(180deg, rgba(96,165,250,0.07) 0%, transparent 100%)",
          }}
        />
      )}

      {/* Rain particles */}
      {(category === "rainy" || category === "stormy") && (
        <div className="absolute inset-0">
          {rainDrops.slice(0, category === "stormy" ? 35 : 50).map((drop) => (
            <div
              key={drop.id}
              className="rain-drop"
              style={{
                left: drop.left,
                animationDelay: drop.delay,
                animationDuration: drop.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* Snow particles */}
      {category === "snowy" && (
        <div className="absolute inset-0">
          {snowflakes.map((flake) => (
            <div
              key={flake.id}
              className="snow-flake"
              style={{
                left: flake.left,
                width: flake.size,
                height: flake.size,
                animationDelay: flake.delay,
                animationDuration: flake.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* Lightning */}
      {category === "stormy" && <div className="lightning-flash" />}

      {/* Drifting clouds */}
      {category === "cloudy" && (
        <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.12 }}>
          <div className="absolute top-[12%] -left-20 w-125 h-50 animate-drift-slow">
            <svg viewBox="0 0 200 80" fill="white" className="w-full h-full">
              <ellipse cx="70" cy="55" rx="60" ry="25" />
              <ellipse cx="110" cy="45" rx="50" ry="22" />
              <ellipse cx="150" cy="55" rx="40" ry="20" />
              <ellipse cx="90" cy="38" rx="40" ry="20" />
            </svg>
          </div>
          <div
            className="absolute top-[38%] -left-20 w-87.5 h-35 animate-drift-med"
            style={{ animationDelay: "-25s" }}
          >
            <svg viewBox="0 0 160 60" fill="white" className="w-full h-full">
              <ellipse cx="60" cy="42" rx="50" ry="18" />
              <ellipse cx="100" cy="35" rx="42" ry="18" />
              <ellipse cx="130" cy="42" rx="30" ry="16" />
            </svg>
          </div>
        </div>
      )}

      {/* Foggy mist layers */}
      {category === "foggy" && (
        <>
          <div
            className="absolute bottom-0 left-0 right-0 h-[45%] animate-pulse-glow"
            style={{
              background: "linear-gradient(to top, rgba(161,161,170,0.08), transparent)",
              filter: "blur(30px)",
            }}
          />
          <div
            className="absolute bottom-[15%] left-0 right-0 h-[20%]"
            style={{
              background: "rgba(148,163,184,0.04)",
              filter: "blur(20px)",
            }}
          />
        </>
      )}
    </div>
  );
}
