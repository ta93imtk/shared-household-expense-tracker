import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ヘッダー */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">家計共有アプリ</h1>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">新規登録</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="mb-6 text-5xl leading-tight font-bold">
          <span className="text-blue-600">お金の管理</span>を簡単に
        </h2>
        <p className="mb-8 text-xl text-gray-600">
          誰がいくら立て替えたか、誰が誰にいくら払えばいいか
          <br />
          複雑な計算はアプリにお任せ
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">無料で始める</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">ログインする</Link>
          </Button>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h3 className="mb-12 text-center text-3xl font-bold">主な機能</h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="mb-2 text-xl font-semibold">グループ管理</h4>
              <p className="text-gray-600">
                同棲相手、ルームメイト、家族など、グループを作成してメンバーを管理
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <span className="text-2xl">💳</span>
              </div>
              <h4 className="mb-2 text-xl font-semibold">支出記録</h4>
              <p className="text-gray-600">
                誰がいくら立て替えたかを簡単に記録。レシートの写真も保存可能
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <span className="text-2xl">🧮</span>
              </div>
              <h4 className="mb-2 text-xl font-semibold">自動精算</h4>
              <p className="text-gray-600">
                複雑な計算は不要。誰が誰にいくら払えばいいかを自動で算出
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="mb-12 text-center text-3xl font-bold">使い方は簡単</h3>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                1
              </div>
              <div>
                <h4 className="mb-2 text-xl font-semibold">グループを作成</h4>
                <p className="text-gray-600">一緒に生活している人たちとグループを作成します</p>
              </div>
            </div>
            <div className="mb-8 flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                2
              </div>
              <div>
                <h4 className="mb-2 text-xl font-semibold">支出を記録</h4>
                <p className="text-gray-600">日用品や食材など、立て替えた支出を記録します</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                3
              </div>
              <div>
                <h4 className="mb-2 text-xl font-semibold">精算を確認</h4>
                <p className="text-gray-600">
                  月末などのタイミングで、誰が誰にいくら払えばいいかを確認します
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA セクション */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="mb-4 text-3xl font-bold">お金の管理でもう悩まない</h3>
          <p className="mb-8 text-xl">今すぐ始めて、快適なシェア生活を</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">無料アカウントを作成</Link>
          </Button>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2024 家計共有アプリ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
