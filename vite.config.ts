import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Node.js의 기본 'path' 모듈을 가져온다.

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ✅✅✅ 아래 server 객체를 추가해주세요. ✅✅✅
  server: {
    proxy: {
      // '/api'로 시작하는 모든 요청을 http://localhost:3001 로 보냅니다.
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
