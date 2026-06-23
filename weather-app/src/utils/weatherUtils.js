import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
} from "lucide-react";

export const getWeatherCategory = (code) => {
  if (code == null) return "sunny";
  if (code <= 1) return "sunny";
  if (code <= 3) return "cloudy";
  if (code === 45 || code === 48) return "foggy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snowy";
  if ([95, 96, 99].includes(code)) return "stormy";
  return "sunny";
};

export const getWeatherDetails = (code) => {
  switch (code) {
    case 0:
      return { description: "Clear Sky", icon: Sun, color: "text-amber-400" };
    case 1:
      return { description: "Mainly Clear", icon: CloudSun, color: "text-amber-300/90" };
    case 2:
      return { description: "Partly Cloudy", icon: CloudSun, color: "text-slate-300" };
    case 3:
      return { description: "Overcast", icon: Cloud, color: "text-slate-400" };
    case 45:
    case 48:
      return { description: "Foggy", icon: CloudFog, color: "text-zinc-400" };
    case 51:
    case 53:
    case 55:
      return { description: "Light Drizzle", icon: CloudDrizzle, color: "text-sky-300" };
    case 56:
    case 57:
      return { description: "Freezing Drizzle", icon: Snowflake, color: "text-blue-200" };
    case 61:
    case 63:
      return { description: "Rain", icon: CloudRain, color: "text-sky-400" };
    case 65:
      return { description: "Heavy Rain", icon: CloudRain, color: "text-blue-500" };
    case 66:
    case 67:
      return { description: "Freezing Rain", icon: Snowflake, color: "text-indigo-300" };
    case 71:
    case 73:
      return { description: "Light Snow", icon: Snowflake, color: "text-sky-100" };
    case 75:
      return { description: "Heavy Snow", icon: Snowflake, color: "text-white" };
    case 77:
      return { description: "Snow Grains", icon: Snowflake, color: "text-slate-200" };
    case 80:
    case 81:
    case 82:
      return { description: "Rain Showers", icon: CloudRain, color: "text-sky-400" };
    case 85:
    case 86:
      return { description: "Snow Showers", icon: Snowflake, color: "text-slate-100" };
    case 95:
      return { description: "Thunderstorm", icon: CloudLightning, color: "text-yellow-400" };
    case 96:
    case 99:
      return {
        description: "Thunderstorm with Hail",
        icon: CloudLightning,
        color: "text-amber-500",
      };
    default:
      return { description: "Clear Sky", icon: Sun, color: "text-amber-400" };
  }
};

// utcTimestamp is Date.now() (always UTC ms). Adding offsetSeconds shifts it so
// getUTC* methods return the destination's local time.
export const getDestinationDate = (utcTimestamp, offsetSeconds) =>
  new Date(utcTimestamp + offsetSeconds * 1000);
