export type UserBalance = {
  userId: string
  userName: string
  totalPaid: number
  shouldPay: number
  balance: number // プラスなら受け取る、マイナスなら支払う
}

export type Settlement = {
  fromUserId: string
  fromUserName: string
  toUserId: string
  toUserName: string
  amount: number
}

export function calculateSettlements(
  expenses: Array<{
    paidBy: string
    amount: number
  }>,
  members: Array<{
    userId: string
    user: {
      name: string | null
      email: string
    }
  }>,
): {
  balances: UserBalance[]
  settlements: Settlement[]
} {
  // 各ユーザーの支払い総額を計算
  const userPayments = new Map<string, number>()

  members.forEach((member) => {
    userPayments.set(member.userId, 0)
  })

  expenses.forEach((expense) => {
    const current = userPayments.get(expense.paidBy) || 0

    userPayments.set(expense.paidBy, current + expense.amount)
  })

  // 総支出額と一人当たりの支払い額を計算
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const perPersonAmount = totalExpenses / members.length

  // 各ユーザーのバランスを計算
  const balances: UserBalance[] = members.map((member) => {
    const totalPaid = userPayments.get(member.userId) || 0
    const balance = totalPaid - perPersonAmount

    return {
      userId: member.userId,
      userName: member.user.name || member.user.email,
      totalPaid,
      shouldPay: perPersonAmount,
      balance,
    }
  })

  // 精算方法を計算（最小の取引数で精算）
  const settlements: Settlement[] = []
  const creditors = balances.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance)
  const debtors = balances.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance)

  let creditorIndex = 0
  let debtorIndex = 0

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex]
    const debtor = debtors[debtorIndex]

    const amount = Math.min(creditor.balance, -debtor.balance)

    if (amount > 0.01) {
      // 1円以上の場合のみ精算
      settlements.push({
        fromUserId: debtor.userId,
        fromUserName: debtor.userName,
        toUserId: creditor.userId,
        toUserName: creditor.userName,
        amount: Math.round(amount), // 円単位に丸める
      })
    }

    creditor.balance -= amount
    debtor.balance += amount

    if (creditor.balance < 0.01) creditorIndex++

    if (debtor.balance > -0.01) debtorIndex++
  }

  return { balances, settlements }
}
