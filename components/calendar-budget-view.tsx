'use client'

import { useMemo } from 'react'
import Link from 'next/link' // Added for navigation
import { useExpenses } from '@/hooks/use-expenses'
import { useCalendarBudget } from '@/hooks/use-calendar-budget'
import { SetWeeklyBudgetDialog } from '@/components/set-weekly-budget-dialog'
import { AddExpenseDialog } from '@/components/add-expense-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, Calendar, ArrowLeft } from 'lucide-react' // Added ArrowLeft

export function CalendarBudgetView() {
  const {
    expenses,
    budget: monthlyBudget,
    loading: expensesLoading,
    error: expensesError,
    addExpense,
    currentMonth,
  } = useExpenses()

  const {
    weeklyBudget,
    loading: budgetLoading,
    error: budgetError,
    setWeeklyBudgetValues,
    getDayRemaining,
    getDayBudget,
    getDaySpent,
  } = useCalendarBudget(expenses)

  const loading = expensesLoading || budgetLoading
  const error = expensesError || budgetError

  const calendarData = useMemo(() => {
    const [year, month] = currentMonth.split('-').map(Number)
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return {
      year,
      month,
      daysInMonth,
      startingDayOfWeek,
    }
  }, [currentMonth])

  const formatMonthYear = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = []
    for (let i = 0; i < calendarData.startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= calendarData.daysInMonth; day++) {
      days.push(day)
    }
    return days
  }, [calendarData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-black dark:text-white" />
          <p className="text-sm text-neutral-500">Loading calendar...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert variant="destructive" className="max-w-md border-neutral-200 dark:border-neutral-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'An error occurred while loading the calendar.'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-2 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        {/* Back Button Navigation */}
        <div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-neutral-900 dark:text-neutral-50">
              <Calendar className="h-6 w-6 stroke-[2.5]" />
              Budget Calendar
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Track daily food & grocery spending
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-initial">
              <SetWeeklyBudgetDialog
                budget={weeklyBudget}
                onSetBudget={setWeeklyBudgetValues}
              />
            </div>
            <div className="flex-1 sm:flex-initial">
              <AddExpenseDialog onAddExpense={addExpense} />
            </div>
          </div>
        </div>
      </div>

      {/* Overview Metric Strips */}
      {weeklyBudget && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border border-neutral-200 dark:border-neutral-800 rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
          <div className="p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Weekday Budget
            </p>
            <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-50">
              ${weeklyBudget.weekdayBudget.toFixed(2)}
            </p>
            <p className="text-xs text-neutral-400 mt-1">Monday through Friday</p>
          </div>
          <div className="p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Weekend Budget
            </p>
            <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-50">
              ${weeklyBudget.weekendBudget.toFixed(2)}
            </p>
            <p className="text-xs text-neutral-400 mt-1">Saturday and Sunday</p>
          </div>
        </div>
      )}

      {/* Main Calendar Section */}
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-none bg-white dark:bg-neutral-950">
        <CardHeader className="border-b border-neutral-100 dark:border-neutral-900 px-4 py-5 sm:p-6">
          <CardTitle className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            {formatMonthYear(currentMonth)}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 pt-4 sm:pt-6">
          {!weeklyBudget ? (
            <Alert className="border-neutral-200 dark:border-neutral-800 mx-2">
              <AlertCircle className="h-4 w-4 text-neutral-900 dark:text-neutral-50" />
              <AlertDescription className="text-neutral-600 dark:text-neutral-400">
                Please set your daily budgets first to start tracking expenses.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <div key={idx} className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 py-1">
                    <span className="hidden sm:inline">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][idx]}</span>
                    <span className="sm:hidden">{day}</span>
                  </div>
                ))}
              </div>

              {/* Universal 7-Column Grid Layout */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square rounded bg-neutral-50/40 dark:bg-neutral-900/20 border border-neutral-100/70 dark:border-neutral-900/50"
                      />
                    )
                  }

                  const remaining = getDayRemaining(day)
                  const budget = getDayBudget(day)
                  const spent = getDaySpent(day)
                  const isOverBudget = remaining < 0

                  return (
                    <div
                      key={day}
                      className="aspect-square rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-1 sm:p-2 flex flex-col justify-between transition-colors hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer"
                    >
                      {/* Day Number */}
                      <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-50 text-left">
                        {day}
                      </span>
                      
                      {/* Budget Calculations Status */}
                      <div className="mt-auto text-left leading-tight">
                        {budget > 0 ? (
                          <>
                            <div
                              className="text-[10px] sm:text-sm font-bold tracking-tight break-all"
                              style={{ color: isOverBudget ? 'var(--red, #dc2626)' : 'var(--green, #16a34a)' }}
                            >
                              {isOverBudget ? '-' : '+'}${Math.abs(remaining).toFixed(0)}
                            </div>
                            <div className="hidden sm:block text-[10px] text-neutral-400 font-medium mt-0.5">
                              Spent: ${spent.toFixed(0)}
                            </div>
                            <div className="sm:hidden text-[9px] text-neutral-400 font-normal scale-90 origin-left">
                              ${spent.toFixed(0)}
                            </div>
                          </>
                        ) : (
                          <div className="text-[9px] sm:text-[10px] text-neutral-400">
                            —
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Legend Summary */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900 px-2">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-500" />
                    <span className="text-xs text-neutral-500">Budget Remaining</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-500" />
                    <span className="text-xs text-neutral-500">Over Budget</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}