import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { TestLoginForm } from './test-login-form'

export default function TestLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block mb-4 text-sm text-gray-600 hover:text-gray-900">
            ← トップページに戻る
          </Link>
          <h1 className="text-2xl font-bold">テストユーザーログイン</h1>
          <p className="mt-2 text-sm text-gray-600">開発・デモ用のログイン画面です</p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-sm">
          <TestLoginForm />

          <div className="mt-6 border-t pt-6">
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold">テストアカウント:</p>
              <div className="space-y-1">
                <p>📧 demo1@example.com / demo123456</p>
                <p>📧 demo2@example.com / demo123456</p>
                <p>📧 demo3@example.com / demo123456</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button variant="link" asChild>
              <Link href="/login">通常のログインに戻る</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
