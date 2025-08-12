import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  // server: {
  //   // proxy: {
  //   //   "/api": {
  //   //     // target: "http://localhost:4000", // development
  //   //     target: "https://formbuilder-qpp8.onrender.com/", // prod
  //   //     changeOrigin: true,
  //   //     rewrite: (path) => path.replace(/^\/api/, ""),
  //   //   },
  //   },
  // },
});
