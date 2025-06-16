// 기존의 module.exports (CommonJS 방식) 대신
// export default (ES Module 방식)를 사용한다.
// 네 package.json에 "type": "module"이라고 명시했기 때문에,
// 모든 설정 파일은 이 문법을 따라야 한다.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
