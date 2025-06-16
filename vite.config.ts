import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Node.js의 기본 'path' 모듈을 가져온다.

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // '@' 라는 별칭이 사용되면,
      // 현재 디렉토리(__dirname)를 기준으로 'src' 폴더를 가리키도록 설정한다.
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
});
