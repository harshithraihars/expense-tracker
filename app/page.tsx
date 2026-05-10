import { ExpenseTracker } from '@/components/expense-tracker'

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ExpenseTracker />
      </div>
    </main>
  )
}
