import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface HeaderProps {
  title: string
  backHref?: string
  backLabel?: string
  showLogout?: boolean
}

export function Header({ title, backHref, backLabel, showLogout = false }: HeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {backHref && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={backHref}>← {backLabel || 'ダッシュボード'}</Link>
            </Button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        
        {showLogout && (
          <form action="/auth/logout" method="post">
            <Button variant="outline" type="submit" size="sm">
              ログアウト
            </Button>
          </form>
        )}
      </div>
    </header>
  )
}