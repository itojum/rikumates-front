# りくめいつ

## 🎯 概要

りくめいつは、就職活動の進捗・選考状況・予定などをWeb上で効率的に一元管理するためのサービスです。

## 🧱 技術スタック

| 分類           | 使用技術                          | 補足                                          |
| -------------- | --------------------------------- | --------------------------------------------- |
| フレームワーク | Next.js (App Router, TypeScript)  | /app ディレクトリベース構成                   |
| UI ライブラリ  | SmartHR UI                        | @emotion/react ベースの洗練されたUI           |
| 認証           | Supabase Authentication           | Google/GitHub OAuth によるログイン認証        |
| 状態管理       | useState / useEffect / useContext | 必要に応じて SWR でデータ取得                 |
| API 通信       | fetch                             | Next.js API Routes 経由で Supabase とやり取り |
| データベース   | Supabase（PostgreSQL）            | Prisma or Supabase Client を利用（開発中）    |
| デプロイ       | Vercel                            | Next.js に最適化されたホスティング            |

## 🗂️ ディレクトリ構成（主要）

```
/app
  ├── (auth)/                  # 認証ルート（ログイン/ログアウトなど）
  ├── (dashboard)/             # ダッシュボード表示
  ├── companies/               # 企業情報のCRUD
  ├── applications/            # 選考情報のCRUD
  ├── api/                     # Next.js API Routes
  │   └── auth/                # サーバーサイド認証連携など
  └── layout.tsx / page.tsx    # ルートレイアウト・トップページ

/src
  ├── components/              # UI / 機能別コンポーネント
  ├── hooks/                   # カスタムフック群（useAuth 等）
  ├── lib/                     # API クライアント、ユーティリティ
  ├── context/                 # React Context（認証など）
  └── types/                   # 型定義群

/public                       # 画像やフォント
/styles                       # グローバルCSS

.env.local                    # 環境変数設定
```

## 🔐 認証構成（Supabase OAuth）

- Supabase Auth を使用し、Google / GitHub の OAuth 認証を実装
- ログイン後に Supabase から JWT を取得し、セッションを管理
- クライアント側では AuthContext によってグローバルに認証状態を保持

## 🚀 開発環境のセットアップ

### 依存関係のインストール

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 環境変数の設定

`.env.local` に以下の環境変数を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 開発サーバーの起動

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

ブラウザでアクセス：http://localhost:3000

## 📝 開発ガイドライン

- TypeScript による静的型付けを徹底
- 関数コンポーネント + Hooks による構成
- UIは SmartHR UI に統一
- データ通信は Next.js API Routes 経由でSupabaseと連携
- 状態管理は最小限にしつつ、必要に応じて Context / SWR を活用

## 🔒 セキュリティ

- Supabase Auth による OAuth ベースの認証（Google / GitHub）
- セッション管理は Cookie / JWT ベース
- 機密情報は .env.local で安全に管理

## 📚 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [SmartHR UI](https://smarthr.design/)
- [Supabase Documentation](https://supabase.com/docs)
