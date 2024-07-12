import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/", // add "/type-chart" for GitHub page
  plugins: [react(), tsconfigPaths()],
});
