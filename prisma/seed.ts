import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

// Supabaseクライアントの作成（管理者権限）
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // サービスロールキーが必要
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

async function main() {
  console.log('🌱 シードデータの作成を開始します...')

  // テストユーザーの作成
  const testUsers = [
    {
      email: 'demo1@example.com',
      password: 'demo123456',
      name: '田中太郎',
    },
    {
      email: 'demo2@example.com',
      password: 'demo123456',
      name: '佐藤花子',
    },
    {
      email: 'demo3@example.com',
      password: 'demo123456',
      name: '鈴木一郎',
    },
  ]

  const createdUsers = []

  for (const user of testUsers) {
    // Supabase Authでユーザーを作成
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { name: user.name },
    })

    if (authError) {
      console.error(`❌ ${user.email} の作成に失敗:`, authError.message)
      continue
    }

    console.log(`✅ ユーザー作成: ${user.email}`)

    // Prismaでユーザー情報を作成（トリガーが動作しない場合の保険）
    const dbUser = await prisma.user.upsert({
      where: { id: authData.user.id },
      update: { name: user.name },
      create: {
        id: authData.user.id,
        email: user.email,
        name: user.name,
      },
    })

    createdUsers.push(dbUser)
  }

  if (createdUsers.length < 2) {
    console.error('❌ 十分なユーザーを作成できませんでした')

    return
  }

  // テストグループの作成
  const group1 = await prisma.group.create({
    data: {
      name: 'デモグループ：シェアハウス',
      createdBy: createdUsers[0].id,
      members: {
        create: [
          { userId: createdUsers[0].id },
          { userId: createdUsers[1].id },
          ...(createdUsers[2] ? [{ userId: createdUsers[2].id }] : []),
        ],
      },
    },
  })

  console.log(`✅ グループ作成: ${group1.name}`)

  // テスト支出データの作成
  const expenses = [
    {
      groupId: group1.id,
      paidBy: createdUsers[0].id,
      amount: 15000,
      description: 'スーパーで食材まとめ買い',
    },
    {
      groupId: group1.id,
      paidBy: createdUsers[1].id,
      amount: 8500,
      description: '電気代',
    },
    {
      groupId: group1.id,
      paidBy: createdUsers[0].id,
      amount: 3200,
      description: '日用品（洗剤、トイレットペーパー）',
    },
    {
      groupId: group1.id,
      paidBy: createdUsers[1].id,
      amount: 12000,
      description: 'インターネット代',
    },
    {
      groupId: group1.id,
      paidBy: createdUsers[0].id,
      amount: 5600,
      description: '共用部の掃除用品',
    },
    ...(createdUsers[2]
      ? [
          {
            groupId: group1.id,
            paidBy: createdUsers[2].id,
            amount: 7800,
            description: 'ガス代',
          },
          {
            groupId: group1.id,
            paidBy: createdUsers[2].id,
            amount: 4500,
            description: '共用のサブスク（Netflix）',
          },
        ]
      : []),
  ]

  for (const expense of expenses) {
    await prisma.expense.create({ data: expense })
  }

  console.log(`✅ 支出データ作成: ${expenses.length}件`)

  // 2つ目のグループ（2人のみ）
  if (createdUsers.length >= 2) {
    const group2 = await prisma.group.create({
      data: {
        name: 'デモグループ：カップル',
        createdBy: createdUsers[1].id,
        members: {
          create: [{ userId: createdUsers[0].id }, { userId: createdUsers[1].id }],
        },
      },
    })

    console.log(`✅ グループ作成: ${group2.name}`)

    // カップル用の支出データ
    const coupleExpenses = [
      {
        groupId: group2.id,
        paidBy: createdUsers[0].id,
        amount: 25000,
        description: 'デート：ディナー',
      },
      {
        groupId: group2.id,
        paidBy: createdUsers[1].id,
        amount: 18000,
        description: '旅行：ホテル代',
      },
    ]

    for (const expense of coupleExpenses) {
      await prisma.expense.create({ data: expense })
    }

    console.log(`✅ 支出データ作成: ${coupleExpenses.length}件`)
  }

  console.log('\n📝 テストユーザー情報:')
  console.log('---------------------')
  testUsers.forEach((user) => {
    console.log(`Email: ${user.email}`)
    console.log(`Password: ${user.password}`)
    console.log(`Name: ${user.name}`)
    console.log('---------------------')
  })
}

main()
  .catch((e) => {
    console.error('エラーが発生しました:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
