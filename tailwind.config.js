// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',        // App Router を使っているなら必須
    './app/**/**/*.{js,ts,jsx,tsx}',        // App Router を使っているなら必須
    //    './components/**/*.{js,ts,jsx,tsx}', // コンポーネントフォルダも対象に
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
