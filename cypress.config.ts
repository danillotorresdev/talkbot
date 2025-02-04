import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // Verifique se a porta está correta
    supportFile: false,
  },
});
