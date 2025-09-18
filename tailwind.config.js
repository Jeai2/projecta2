/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // 여기에 프로젝트 전체에서 사용할 디자인 시스템을 정의한다.
    extend: {
      // ---------------------------------------------------------
      // 1. 색상 (Colors)
      // ---------------------------------------------------------
      colors: {
        background: {
          main: "#F7F5F2", // 아주 밝은 아이보리 계열
          sub: "#EAE7E1", // 메인보다 살짝 어두운 베이지색
        },

        // 텍스트 색상 (Text Colors)
        text: {
          light: "#333333", // ivory (주요 텍스트 색상)
          dark: "#222222", // textDark (밝은 배경용)
          muted: "#666666", // mistSilver (덜 중요한 텍스트)
          subtle: "#999999", // cloudGray (더 덜 중요한 텍스트)
        },
        // 포인트 색상 (Accent Colors)
        accent: {
          gold: "#A98A62", // subtleGold (주요 포인트 색상)
          teal: "#6F9A8A", // teal (보조 포인트 색상 1)
          lavender: "#B59EAD", // lavender (보조 포인트 색상 2)
        },
        // 시스템 색상 (System Colors)
        system: {
          danger: "#A94438", // crimsonRed (경고/에러)
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          foreground: "hsl(var(--gold-foreground))",
        },
      },

      // ---------------------------------------------------------
      // 2. 타이포그래피 (Typography) - 이전 설정을 유지.
      // ---------------------------------------------------------
      fontFamily: {
        sans: ['"Noto Sans KR"', "Helvetica", "sans-serif"],
        myeongjo: ["'Nanum Myeongjo'", "serif"],
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
