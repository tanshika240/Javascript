import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  css: {
    transformer: "lightningcss",
  },
  plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
});
