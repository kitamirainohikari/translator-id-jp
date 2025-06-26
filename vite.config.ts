import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import obfuscator from "rollup-plugin-obfuscator";
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig(({ mode }) => ({
  base: "/translator/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "production" &&
      obfuscator({
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        stringArray: true,
        stringArrayEncoding: ["base64"],
        stringArrayThreshold: 0.75,
        renameGlobals: true,
        reservedNames: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'], // 🛡️ proteksi nama env
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
