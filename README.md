## 🎯 概要

りくめいつは、就職活動の進捗・選考状況・予定などをWeb上で効率的に一元管理するためのサービスです。データはバックエンド（Rails API）とやり取りし、Firebase Authentication を用いて安全なアクセス制御を行います。

## 🧱 技術スタック

| 分類           | 使用技術                          | 補足                                         |
| -------------- | --------------------------------- | -------------------------------------------- |
| フレームワーク | Next.js (App Router, TypeScript)  | /app ディレクトリベース構成                  |
| UI ライブラリ  | SmartHR UI                        | @emotion/react ベースの洗練されたUI          |
| 認証           | Firebase Authentication           | JWT による認可・API連携                      |
| 状態管理       | useState / useEffect / useContext | 必要に応じて SWR でデータ取得                |
| API 通信       | fetch                             | Rails 側 REST API と通信（JWT ヘッダー付き） |
| スタイリング   | SmartHR UI                        | UIコンポーネント                             |
| デプロイ       | Vercel                            | Next.js に最適化されたホスティング           |

## 🗂️ ディレクトリ構成

```
/app
  ├── (auth)                 # 認証関連のルートグループ
  │   ├── login/
  │   │   └── page.tsx      # ログインページ
  │   └── layout.tsx        # 認証ページ共通レイアウト
  │
  ├── (dashboard)           # ダッシュボード関連のルートグループ
  │   ├── page.tsx          # ダッシュボードトップ
  │   ├── layout.tsx        # ダッシュボード共通レイアウト
  │   └── loading.tsx       # ローディング状態
  │
  ├── companies/            # 企業管理
  │   ├── page.tsx          # 企業一覧
  │   ├── [id]/             # 動的ルーティング
  │   │   ├── page.tsx      # 企業詳細
  │   │   └── edit/         # 編集ページ
  │   │       └── page.tsx
  │   └── new/              # 新規作成
  │       └── page.tsx
  │
  ├── applications/         # 選考管理
  │   ├── page.tsx          # 選考一覧
  │   ├── [id]/             # 動的ルーティング
  │   │   ├── page.tsx      # 選考詳細
  │   │   └── edit/         # 編集ページ
  │   │       └── page.tsx
  │   └── new/              # 新規作成
  │       └── page.tsx
  │
  ├── api/                  # API Routes
  │   └── auth/             # 認証関連API
  │       └── route.ts
  │
  ├── layout.tsx            # ルートレイアウト
  ├── page.tsx              # トップページ
  └── error.tsx             # エラーハンドリング

/src
  ├── components/           # 共通コンポーネント
  │   ├── ui/              # 基本的なUIコンポーネント
  │   │   ├── Button/
  │   │   ├── Card/
  │   │   └── Input/
  │   └── features/        # 機能別コンポーネント
  │       ├── companies/
  │       └── applications/
  │
  ├── hooks/               # カスタムフック
  │   ├── useAuth.ts
  │   ├── useFetch.ts
  │   └── useReminder.ts
  │
  ├── lib/                 # ユーティリティ
  │   ├── api/            # API関連
  │   │   ├── client.ts   # APIクライアント
  │   │   └── types.ts    # API型定義
  │   └── utils/          # 汎用ユーティリティ
  │
  ├── firebase/           # Firebase設定
  │   └── client.ts
  │
  ├── context/            # React Context
  │   └── AuthContext.tsx
  │
  └── types/              # 型定義
      └── index.ts

/public
  ├── images/             # 画像ファイル
  └── fonts/              # フォントファイル

/styles
  └── globals.css         # グローバルスタイル

.env.local               # 環境変数
```

## 🔐 認証構成

- Firebase SDK を使用したクライアントサイド認証
- JWT による Rails API との連携
- AuthContext によるアプリ全体でのログイン状態管理

## 🚀 開発環境のセットアップ

1. 依存関係のインストール:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. 環境変数の設定:
   `.env` ファイルを作成し、必要な環境変数を設定:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_API_BASE_URL=
```

3. 開発サーバーの起動:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

## 📝 開発ガイドライン

- TypeScript の厳格な型チェックを活用
- コンポーネントは関数コンポーネントと React Hooks を使用
- SmartHR UI のデザインシステムに準拠
- パフォーマンス最適化（Next.js の機能を活用）

## 🔒 セキュリティ

- Firebase Authentication による安全な認証
- JWT による API 通信の保護
- 環境変数による機密情報の管理

## 📚 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [SmartHR UI](https://smarthr.design/products/components/)
- [Firebase Documentation](https://firebase.google.com/docs)
