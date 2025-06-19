# 家計共有アプリ（Shared Household Expense Tracker）

## 概要

同棲・夫婦・ルームシェアなど、複数人で生活を共にする人たちのための**家計共有アプリ**です。
「誰がどれだけ立て替えたか」「今どういう精算バランスになっているか」を、わかりやすく記録・管理できます。

- 複数人での支出管理が面倒
- 立て替えや貸し借りの記憶が曖昧
- 精算タイミングで誰がどれだけ多く払ってるのかが不明

そんな生活の困りごとを技術で解決することを目的としています。

---

## 🛠 使用技術

- **TypeScript**
- **Next.js App Router**
- **Supabase**（Auth / DB / RLS）
- **Tailwind CSS**
- **shadcn/ui**
- **Zod**（フォームバリデーション）
- **prisma**

---

## 🔐 コア機能（MVP）

- [x] ユーザー登録 / ログイン
- [x] グループ作成・参加（招待リンク機能）
- [x] 支出の記録（誰がいくら立て替えたか）
- [x] 精算ロジックによるバランス表示（「誰が誰にいくら渡すと均等か」）

---

## 🖼 画面構成（予定）

| パス                | 概要                               |
| ------------------- | ---------------------------------- |
| `/signup`           | 新規登録ページ                     |
| `/login`            | ログインページ                     |
| `/dashboard`        | 所属グループ一覧 or 新規作成ページ |
| `/group/:id`        | グループ詳細ページ（支出一覧）     |
| `/group/:id/add`    | 支出追加ページ                     |
| `/group/:id/settle` | 現在の精算結果を表示               |

---

## 🧩 データ構造（スキーマ案）

### `users`

| フィールド | 型     |
| ---------- | ------ |
| id         | uuid   |
| email      | string |
| name       | string |

### `groups`

| フィールド | 型      |
| ---------- | ------- |
| id         | uuid    |
| name       | string  |
| created_by | user_id |

### `group_members`

| フィールド | 型   |
| ---------- | ---- |
| group_id   | uuid |
| user_id    | uuid |

### `expenses`

| フィールド  | 型        |
| ----------- | --------- |
| id          | uuid      |
| group_id    | uuid      |
| paid_by     | user_id   |
| amount      | number    |
| description | string    |
| created_at  | timestamp |

---

## 技術的アピールポイント

- 多対多関係のスキーマ設計（Group ⇄ Member ⇄ Expense）
- 精算ロジックの実装（誰がどれだけ多く/少なく支払っているか計算）
- 認証と行レベルセキュリティ（RLS）によるデータ保護
- 招待コードによるグループ参加機能（予定）
- TypeScript + Zodによる型安全な開発

---

## 🚧 今後の拡張案（任意）

- 精算履歴の保存
- 支出のカテゴリ分けとグラフ可視化
- グループ内でのコメント機能
- LINE通知やSlack Webhookなどの外部連携

### その他

#### 1. ユーザープロフィール機能

- 名前の設定/変更
- アバター画像
- /profile ページ

#### 2. 支出の編集・削除

- 自分が追加した支出の編集
- 削除機能（ソフトデリート）

#### 3. 支出のカテゴリ分類

- 食費、日用品、光熱費など
- カテゴリ別の集計表示

#### 4. 通知機能

- 新しい支出が追加されたとき
- 精算タイミングのリマインダー

#### 5. 支出の詳細情報

- レシート画像のアップロード
- メモ欄
- 支出日の記録

#### 6. 精算履歴

- 過去の精算記録を保存
- 精算完了ボタン

#### 7. グループ設定

- グループ名の変更
- メンバーの削除（管理者のみ）
- グループの削除

#### 8. ダッシュボードの充実

- 今月の支出総額
- 自分の支払い/受け取り予定額
- グラフ表示

#### 9. レスポンシブ改善

- モバイル最適化
- PWA対応

#### 10. ログアウト機能

- ヘッダーにログアウトボタン
- /logout エンドポイント

---

## 🚀 デプロイ手順

### 必要な環境変数

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database
DATABASE_URL=your_database_url

# App URL (本番環境)
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

### セットアップ

1. **Supabaseプロジェクトの作成**
   - [Supabase](https://supabase.com) でプロジェクトを作成
   - APIキーとURLを取得

2. **データベースのセットアップ**

   ```bash
   # Prismaでスキーマを適用
   npx prisma db push

   # SQLマイグレーションを実行
   psql $DATABASE_URL -f supabase/migrations/002_auth_user_sync.sql
   psql $DATABASE_URL -f supabase/migrations/20250619091755_fix_user_trigger.sql
   ```

3. **Vercelへのデプロイ（推奨）**
   - GitHubリポジトリと連携
   - 環境変数を設定
   - デプロイ

---

## 制作背景

このアプリは、実生活で「同棲時の家計精算がめんどうだった」という課題から着想を得て開発しました。
生活の中のちょっとした困りごとを、エンジニアリングで解決する力をアピールするために設計・構築しています。
