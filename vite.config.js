import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  optimizeDeps: {
    include: ["recharts", "lodash"],
    exclude: ["lodash/get"],
  },

  resolve: {
    alias: {
      "lodash/get": "lodash-es/get",
    },
  },

  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  ssr: {
    noExternal: ["recharts"],
  },
});
