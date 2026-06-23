import { useState, useEffect } from "react";
import Background from "./components/Background";
import SearchHeader from "./components/SearchHeader";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import WeatherMetrics from "./components/WeatherMetrics";
import { Loader2, CloudOff } from "lucide-react";

export default function App() {
  const [locationDetails, setLocationDetails] = useState({
    name: "Noida",
    fullName: "Noida, Uttar Pradesh, India",
    latitude: 28.58,
    longitude: 77.33,
  });
  const [unit, setUnit] = useState("celsius");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setCurrentTime(Date.now()), 0);
    const iv = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => {
      clearTimeout(t);
      clearInterval(iv);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const tempParam = unit === "celsius" ? "celsius" : "fahrenheit";
    const windParam = unit === "celsius" ? "kmh" : "mph";

    // Defer to satisfy React compiler purity
    const kickoff = setTimeout(() => {
      if (!active) return;
      setLoading(true);
      setError(null);
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${locationDetails.latitude}&longitude=${locationDetails.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,precipitation_probability,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&temperature_unit=${tempParam}&wind_speed_unit=${windParam}&precipitation_unit=mm&timezone=auto`,
      )
        .then((r) => {
          if (!r.ok) throw new Error("Weather data unavailable.");
          return r.json();
        })
        .then((data) => {
          if (active) setWeatherData(data);
        })
        .catch((err) => {
          if (active) setError(err.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 0);

    return () => {
      active = false;
      clearTimeout(kickoff);
    };
  }, [locationDetails.latitude, locationDetails.longitude, unit]);

  const weatherCode = weatherData?.current?.weather_code ?? 0;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden px-4">
      <Background weatherCode={weatherCode} />

      <div className="w-full max-w-4xl flex flex-col gap-10 py-12">
        <SearchHeader onLocationSelect={setLocationDetails} unit={unit} onUnitToggle={setUnit} />

        <main className="flex flex-col gap-5">
          {loading && (
            <div className="glass rounded-3xl flex flex-col items-center justify-center gap-4 animate-fade-in-up min-h-95">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full animate-pulse-glow bg-sky-400/15" />
                <Loader2 className="w-full h-full animate-spin text-sky-400/70" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white/70">Syncing weather data</p>
                <p className="text-xs mt-1 text-slate-500/70">
                  {locationDetails.name} — {locationDetails.fullName}
                </p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="glass rounded-3xl flex flex-col items-center justify-center gap-5 text-center animate-fade-in-up min-h-85 px-8 py-12">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(248,113,113,0.1)",
                  border: "1px solid rgba(248,113,113,0.2)",
                }}
              >
                <CloudOff className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white/90">Connection Failed</h3>
                <p className="mt-1.5 text-sm max-w-xs text-slate-400/70">
                  {error} — check your network and try again.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLocationDetails({ ...locationDetails })}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(99,102,241,0.25))",
                  border: "1px solid rgba(56,189,248,0.3)",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && weatherData && (
            <>
              <CurrentWeather
                weatherData={weatherData}
                locationDetails={locationDetails}
                unit={unit}
                currentTime={currentTime}
              />
              <HourlyForecast weatherData={weatherData} unit={unit} currentTime={currentTime} />
              <DailyForecast weatherData={weatherData} unit={unit} />
              <WeatherMetrics weatherData={weatherData} unit={unit} currentTime={currentTime} />
            </>
          )}
        </main>

        <footer className="text-center text-[11px] text-slate-400 tracking-[0.08em]">
          ATMOSPHERIC WEATHER · DATA BY OPEN-METEO
        </footer>
      </div>
    </div>
  );
}
