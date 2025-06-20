import Link from 'next/link'

import { GoogleLoginButton } from './google-login-button'

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href="/" className="block text-center mb-6 text-sm text-gray-600 hover:text-gray-900">
          ← トップページに戻る
        </Link>
        <h2 className="mt-10 text-center text-2xl leading-9 font-bold tracking-tight text-gray-900">
          ログイン
        </h2>
      </div>

      <div className="mt-10 space-y-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <GoogleLoginButton />

        <p className="text-center text-sm text-gray-500">
          初めてご利用の方もGoogleアカウントでログインできます
        </p>

        <div className="border-t border-gray-200 pt-4 text-center">
          <Link href="/login/test" className="text-sm text-blue-600 hover:text-blue-500">
            テストユーザーでログイン →
          </Link>
        </div>
      </div>
    </div>
  )
}
