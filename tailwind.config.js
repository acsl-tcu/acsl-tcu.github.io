// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',        // App Router を使っているなら必須
    './app/**/**/*.{js,ts,jsx,tsx}',        // App Router を使っているなら必須
    //    './components/**/*.{js,ts,jsx,tsx}', // コンポーネントフォルダも対象に
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(0, 167, 235)',
        // 文字や背景用に薄いバリエーションも追加するなら：
        'primary-light': 'rgb(204, 234, 250)',
        'primary-dark': 'rgb(0, 140, 200)',
      },
    },
  },
  plugins: [],
};
