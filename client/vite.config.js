// ============================================================
// FILE: frontend/vite.config.js
// PURPOSE: Configures the Vite build tool.
//   - Registers the React plugin so Vite understands JSX
//   - Registers the Tailwind CSS v4 plugin for styling
//   - Sets up a path alias "@" so you can write:
//       import Button from "@/components/ui/Button"
//     instead of:
//       import Button from "../../components/ui/Button"
// ============================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),        // Enables JSX syntax and fast refresh in development
    tailwindcss(),  // Processes Tailwind CSS v4 classes
  ],
  resolve: {
    alias: {
      // "@" maps to the "src" folder — makes imports cleaner
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,         // The port the frontend runs on (http://localhost:5173)
    open: true,         // Automatically opens the browser when you run npm run dev
    proxy: {
      // Any API call starting with "/api" will be forwarded to our backend
      // This avoids CORS issues during development
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
