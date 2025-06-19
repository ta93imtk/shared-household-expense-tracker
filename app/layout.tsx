import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '家計共有アプリ - みんなでシンプルに支出管理',
  description: '同棲・ルームシェアの支出管理をシンプルに。誰がいくら立て替えたか記録し、自動で精算額を計算します。',
  keywords: '家計簿,支出管理,精算,ルームシェア,同棲,家計共有',
  openGraph: {
    title: '家計共有アプリ',
    description: '同棲・ルームシェアの支出管理をシンプルに',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  )
}