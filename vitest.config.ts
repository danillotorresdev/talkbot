import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["components/**/*.tsx", "app/**/*.tsx"],
      exclude: ["**/*.test.ts", "app/layout.tsx", "**/*.test.tsx", "**/mockServer.ts", "vitest.setup.ts"], 
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
