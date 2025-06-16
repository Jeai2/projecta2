/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // 여기에 프로젝트 전체에서 사용할 디자인 시스템을 정의한다.
    extend: {
      // ---------------------------------------------------------
      // 1. 색상 (Colors)
      // 네가 고른 색상들을 의미론적 구조로 재구성했다.
      // 이제 너는 마법의 숫자(#0B0F1A)가 아닌, 의미(bg-background-main)를 사용하게 된다.
      // ---------------------------------------------------------
      colors: {
        // 배경색 (Background Colors)
        background: {
          main: "#0B0F1A", // deepNavy
          sub: "#1B1F2A", // charcoalGray
        },
        // 텍스트 색상 (Text Colors)
        text: {
          light: "#F6F4F1", // ivory (주요 텍스트 색상)
          dark: "#222222", // textDark (밝은 배경용)
          muted: "#BFC1C5", // mistSilver (덜 중요한 텍스트)
          subtle: "#D8D8D8", // cloudGray (더 덜 중요한 텍스트)
        },
        // 포인트 색상 (Accent Colors)
        accent: {
          gold: "#D1B681", // subtleGold (주요 포인트 색상)
          teal: "#88BEB2", // teal (보조 포인트 색상 1)
          lavender: "#CABCE0", // lavender (보조 포인트 색상 2)
        },
        // 시스템 색상 (System Colors)
        system: {
          danger: "#A94438", // crimsonRed (경고/에러)
        },
      },

      // ---------------------------------------------------------
      // 2. 타이포그래피 (Typography) - 이전 설정을 유지.
      // ---------------------------------------------------------
      fontFamily: {
        sans: ['"Noto Sans KR"', "Helvetica", "sans-serif"],
      },
      fontSize: {
        "h1-xl": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        "h2-m": ["20px", { lineHeight: "30px", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        caption: ["14px", { lineHeight: "20px", fontWeight: "400" }],
      },

      // ---------------------------------------------------------
      // 3. 기타 (애니메이션 등) - 이전 설정을 유지.
      // ---------------------------------------------------------
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // 터미널에서 'npm install -D tailwindcss-animate'가 설치되어 있어야 한다.
  plugins: [require("tailwindcss-animate")],
};
