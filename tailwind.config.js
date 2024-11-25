/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tailwind가 스타일을 적용할 파일 경로
  ],
  theme: {
    extend: {}, // 필요하면 커스텀 스타일 추가 가능
  },
  plugins: [],
};
