import Link from 'next/link'

import { login } from '@/app/actions/auth'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          アカウントにログイン
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          アカウントをお持ちでない方は{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            新規登録
          </Link>
        </p>
      </div>

      <LoginForm action={login} />
    </>
  )
}