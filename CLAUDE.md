# CLAUDE.md - AI Assistant Context for Shared Household Expense Tracker

## プロジェクト概要

これは同棲・夫婦・ルームシェアなど、複数人で生活を共にする人たちのための家計共有アプリです。立て替えや貸し借りを記録し、誰がどれだけ多く/少なく支払っているかを可視化して精算を簡単にすることを目的としています。

## 技術スタック

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **ORM**: Prisma
- **スタイリング**: Tailwind CSS + shadcn/ui
- **バリデーション**: Zod

## プロジェクト構造（予定）

```
/app
  /(auth)
    /signup      # 新規登録
    /login       # ログイン
  /(dashboard)
    /dashboard   # グループ一覧
  /group
    /[id]        # グループ詳細（支出一覧）
    /[id]/add    # 支出追加
    /[id]/settle # 精算結果表示
```

## データベーススキーマ

- **users**: ユーザー情報（id, email, name）
- **groups**: グループ情報（id, name, created_by）
- **group_members**: グループメンバーの関連（group_id, user_id）
- **expenses**: 支出記録（id, group_id, paid_by, amount, description, created_at）

## 開発時の注意事項

1. **型安全性**: TypeScriptとZodを使用して型安全な開発を心がけてください
2. **認証**: Supabase Authを使用し、適切なRLS（Row Level Security）を設定してください
3. **UIコンポーネント**: shadcn/uiのコンポーネントを優先的に使用してください
4. **エラーハンドリング**: ユーザーフレンドリーなエラーメッセージを表示してください
5. **Server Components優先**: 可能な限りServer Componentsを使用し、Client Componentsは最小限に抑えてください
6. **Server Actions**: フォーム処理にはServer Actionsを使用し、CSRを避けてください

## 重要な実装ポイント

### 精算ロジック

- 各ユーザーの支払い総額を計算
- グループ内の平均支払い額を算出
- 誰が誰にいくら支払えば均等になるかを計算

### セキュリティ

- Supabase RLSによる行レベルセキュリティ
- グループメンバーのみがグループ内のデータにアクセス可能
- 招待コード方式でのグループ参加（予定）

## コーディング規約

- コンポーネント名: PascalCase
- 関数名: camelCase
- ファイル名: kebab-case
- コメントは日本語でOK（ただし、変数名・関数名は英語）

## テスト・ビルドコマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 型チェック
npx tsc --noEmit

# Linting
npm run lint
```

## 開発フロー

1. 機能実装前に既存のコードスタイルを確認
2. shadcn/uiのコンポーネントを活用
3. Prismaでスキーマ変更時は`npx prisma generate`と`npx prisma db push`を実行
4. 型チェックとLintを通してからコミット

## 注意事項

- 環境変数（.env.local）には機密情報が含まれるため、絶対にコミットしない
- Supabaseのプロジェクト設定は別途必要
- 本番環境へのデプロイ時はRLSポリシーの再確認が必須
