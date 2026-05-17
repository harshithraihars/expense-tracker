import { CalendarBudgetView } from '@/components/calendar-budget-view'

export const metadata = {
  title: 'Budget Calendar - Expense Tracker',
  description: 'Track your daily food and grocery expenses with a budget calendar',
}

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <CalendarBudgetView />
      </div>
    </main>
  )
}
