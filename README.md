# acsl-tcu.github.io

Access to [https://acsl-tcu.github.io/](https://acsl-tcu.github.io/)

## Setup

```bash
npx create-next-app@latest my-next-app
Ok to proceed? (y)

✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? …  Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … No 
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to use Turbopack for `next dev`? … Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No
```

```bash
npm install next-i18next react-i18next i18next
npm install clsx # 
npm install lucide-react react-icons # 各種アイコン
npm install zustand
npm install next-auth 
```

## フォルダ構成

/                           # GitHub Pages にデプロイ
├── .github/                # GitHub Actions 用設定
├── app/                    # App本体
│   ├── page.tsx            # locale内にredirect
│   ├── layout.tsx          # global layout
│   ├── not-found.tsx       # 404
│   ├── globals.css         # Tailwind などのスタイル
│   ├── Login/              # ログイン画面
│   ├── Dashboard/          # 認証後表示
│   ├── lab/                # 旧ホームページ対策
│   ├── components/         # 自作コンポーネント
│   ├── BOS/                # BuildingOS用WebSocket + 認証システム 
│   ├── [locale]/           # 日・英言語切り替えページ
|   │   ├── page.tsx        # Homeにredirect
|   │   ├── layout.tsx      # locale用レイアウト
|   │   ├── components/     # localeが必要な自作コンポーネント
|   │   │   ├── ClientLayout.tsx      # 実体としてのレイアウト
├── components/ui/          # UI用コンポーネント
├── constants/              # 定数
├── contexts/               # React contexts: use***Context
├── public/                 # 基本の画像
│   └── favicon.ico         # 静的アセット
├── hooks/                  # React hooks: use***
├── lib/                    # library 関数 = ts
│   └── api.ts              # API fetch 用のラッパー関数など
├── types/                  # 各種型
├── next.config.js          # `output: 'export'` を設定
├── tsconfig.json           # 各種設定
├── package.json
└── (.nojekyll)               # GitHub Pages 用
