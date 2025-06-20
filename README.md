# 家計共有アプリ（Shared Household Expense Tracker）

## 概要

同棲・夫婦・ルームシェアなど、複数人で生活を共にする人たちのための**家計共有アプリ**です。
「誰がどれだけ立て替えたか」「今どういう精算バランスになっているか」を、わかりやすく記録・管理できます。

- 複数人での支出管理が面倒
- 立て替えや貸し借りの記憶が曖昧
- 精算タイミングで誰がどれだけ多く払ってるのかが不明

上記のような生活の困りごとを技術で解決することを目的としています。

---

## 使用技術

- **TypeScript**
- **Next.js App Router**
- **Supabase**（Auth / DB / RLS）
- **Tailwind CSS**
- **shadcn/ui**
- **Zod**（フォームバリデーション）
- **prisma**

---

## 基本機能（MVP）

- [x] Google認証によるログイン
- [x] グループ作成・参加（招待リンク機能）
- [x] 支出の記録（誰がいくら立て替えたか）
- [x] 精算ロジックによるバランス表示（「誰が誰にいくら渡すと均等か」）
- [x] ユーザープロフィール機能（名前の設定/変更）

---

## 画面構成案

| パス                | 概要                               |
| ------------------- | ---------------------------------- |
| `/login`            | ログインページ（Google認証）        |
| `/dashboard`        | 所属グループ一覧 or 新規作成ページ |
| `/profile`          | プロフィール編集ページ             |
| `/group/:id`        | グループ詳細ページ（支出一覧）     |
| `/group/:id/add`    | 支出追加ページ                     |
| `/group/:id/settle` | 現在の精算結果を表示               |

---

## データ構造（スキーマ案）

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

## 今後の拡張案

### その他

#### 1. 支出の編集・削除

- 自分が追加した支出の編集
- 削除機能

#### 2. 支出のカテゴリ分類

- 食費、日用品、光熱費など
- カテゴリ別の集計表示

#### 3. 通知機能

- 新しい支出が追加されたとき
- 精算タイミングのリマインダー
- LINEやSlack等の外部連携

#### 4. 支出の詳細情報

- レシート画像のアップロード
- メモ欄
- 支出日の記録

#### 5. 精算履歴

- 過去の精算記録を保存
- 精算完了ボタン

#### 6. グループ設定

- グループ名の変更
- メンバーの削除（管理者のみ）
- グループの削除

#### 7. ダッシュボードの充実

- 今月の支出総額
- 自分の支払い/受け取り予定額
- グラフ表示

#### 8. レスポンシブ改善

- モバイル最適化
- PWA対応

#### 9. アバター画像機能

- プロフィール画像のアップロード
- グループメンバー表示での利用

---

## デプロイ手順

### 必要な環境変数

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url

# Google OAuth (ローカル開発用)
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your_google_client_id
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your_google_client_secret

# Supabase Service Role Key (seed用)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### セットアップ

1. **Supabaseプロジェクトの作成**
   - [Supabase](https://supabase.com) でプロジェクトを作成
   - APIキーとURLを取得

2. **Google OAuth認証の設定**
   - Google Cloud ConsoleでOAuth 2.0クライアントIDを作成
   - 承認済みリダイレクトURIに以下を追加：
     - ローカル開発: `http://localhost:54321/auth/v1/callback`
     - 本番環境: `https://your-project.supabase.co/auth/v1/callback`
   - Supabase DashboardでGoogle認証を有効化し、Client IDとSecretを設定

   > **注意**: プレビュー環境や本番環境では、Google側のOAuth設定で適切なリダイレクトURLを登録する必要があります

3. **データベースのセットアップ**

   ```bash
   # Prismaでスキーマを適用
   npx prisma db push

   # SQLマイグレーションを実行
   psql $DATABASE_URL -f supabase/migrations/002_auth_user_sync.sql
   psql $DATABASE_URL -f supabase/migrations/20250619091755_fix_user_trigger.sql
   ```

4. **テストデータの作成（任意）**

   ```bash
   # テストユーザーとデータを作成
   npm run db:seed
   ```

   作成されるテストユーザー：
   - Email: `demo1@example.com` / Password: `demo123456` / Name: 田中太郎
   - Email: `demo2@example.com` / Password: `demo123456` / Name: 佐藤花子
   - Email: `demo3@example.com` / Password: `demo123456` / Name: 鈴木一郎

5. **Vercelへのデプロイ（推奨）**
   - GitHubリポジトリと連携
   - 環境変数を設定
   - デプロイ

---

## 制作背景

データのread/writeを持ち、OAuth認証を用いるサービスを、Claude CodeによるVibe Codingで作成しました。
基本機能やデータベースの設計、コーディング規約を与え、実装に関しても、自分だったらそう実装するかどうかを逐次判断して進めました。

非機能的部分における改善点は、prismaやsupabaseのクライアントが各メソッドから直接呼び出されている点です。usecase/repositoryパターンなど、再利用/変更のしやすい設計に改善する予定です。
