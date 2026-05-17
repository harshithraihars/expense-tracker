'use client'

import Link from 'next/link'
import { useExpenses } from '@/hooks/use-expenses'
import { AddExpenseDialog } from '@/components/add-expense-dialog'
import { SetBudgetDialog } from '@/components/set-budget-dialog'
import { BudgetOverview } from '@/components/budget-overview'
import { ExpenseKanban } from '@/components/expense-kanban'
import { ExpenseSummary } from '@/components/expense-summary'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Receipt, Calendar } from 'lucide-react'

export function ExpenseTracker() {
  const {
    expenses,
    budget,
    loading,
    error,
    addExpense,
    deleteExpense,
    setBudgetValues,
    totalSpent,
    foodSpent,
    groceriesSpent,
    travelSpent,
    rentSpent,
    otherSpent,
    remainingBudget,
    remainingFoodBudget,
    remainingGroceriesBudget,
    currentMonth,
  } = useExpenses()

  const formatMonthYear = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">{error}</p>
          <p className="text-sm text-muted-foreground">
            Please check your Firebase configuration.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            Expense Tracker
          </h1>
          <p className="text-muted-foreground flex items-center gap-1 mt-1">
            <Calendar className="h-4 w-4" />
            {formatMonthYear(currentMonth)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/calendar">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Budget Calendar
            </Button>
          </Link>
          <SetBudgetDialog budget={budget} onSetBudget={setBudgetValues} />
          <AddExpenseDialog onAddExpense={addExpense} />
        </div>
      </div>

      {/* Budget Overview */}
      <BudgetOverview
        budget={budget}
        totalSpent={totalSpent}
        foodSpent={foodSpent}
        groceriesSpent={groceriesSpent}
        remainingBudget={remainingBudget}
        remainingFoodBudget={remainingFoodBudget}
        remainingGroceriesBudget={remainingGroceriesBudget}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Kanban Board - Takes 3/4 of the width on large screens */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Expenses by Category</h2>
            <p className="text-sm text-muted-foreground">
              {expenses.length} expense{expenses.length !== 1 ? 's' : ''} this month
            </p>
          </div>
          <ExpenseKanban
            expenses={expenses}
            onDeleteExpense={deleteExpense}
            travelSpent={travelSpent}
            foodSpent={foodSpent}
            groceriesSpent={groceriesSpent}
            rentSpent={rentSpent}
            otherSpent={otherSpent}
          />
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <ExpenseSummary
            totalSpent={totalSpent}
            travelSpent={travelSpent}
            foodSpent={foodSpent}
            groceriesSpent={groceriesSpent}
            rentSpent={rentSpent}
            otherSpent={otherSpent}
          />
        </div>
      </div>
    </div>
  )
}
