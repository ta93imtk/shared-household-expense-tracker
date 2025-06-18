import Link from 'next/link'

import { signup } from '@/app/actions/auth'
import { SignupForm } from './signup-form'

export default function SignupPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          アカウントを作成
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          すでにアカウントをお持ちの方は{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            ログイン
          </Link>
        </p>
      </div>

      <SignupForm action={signup} />
    </>
  )
}