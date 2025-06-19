'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

interface InviteLinkProps {
  inviteCode: string
}

export function InviteLink({ inviteCode }: InviteLinkProps) {
  const [copied, setCopied] = useState(false)
  const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/join/${inviteCode}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('コピーに失敗しました:', error)
    }
  }

  return (
    <div className="mb-6 rounded-lg bg-blue-50 p-4">
      <p className="text-sm font-medium text-blue-900 mb-2">招待リンク</p>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={inviteUrl}
          className="flex-1 rounded border bg-white px-3 py-1 text-sm"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={copyToClipboard}
        >
          {copied ? 'コピー済み' : 'コピー'}
        </Button>
      </div>
      <p className="mt-2 text-xs text-gray-600">
        このリンクを共有して新しいメンバーを招待できます
      </p>
    </div>
  )
}