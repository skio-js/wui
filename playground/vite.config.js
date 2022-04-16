import { defineConfig } from "vite";
import vuePlugin from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  root: __dirname,
  plugins: [
    vuePlugin(),
    vueJsx({optimize: false, enableObjectSlots: true})
  ]
})
