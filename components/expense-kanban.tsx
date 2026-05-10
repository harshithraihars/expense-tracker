'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash2, Plane, UtensilsCrossed, ShoppingCart, Home, Package } from 'lucide-react'
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES, getCategoryBorderColor } from '@/lib/types'

interface ExpenseKanbanProps {
  expenses: Expense[]
  onDeleteExpense: (id: string) => Promise<void>
  travelSpent: number
  foodSpent: number
  groceriesSpent: number
  rentSpent: number
  otherSpent: number
}

const categoryIcons: Record<ExpenseCategory, React.ReactNode> = {
  travel: <Plane className="h-4 w-4" />,
  food: <UtensilsCrossed className="h-4 w-4" />,
  groceries: <ShoppingCart className="h-4 w-4" />,
  rent: <Home className="h-4 w-4" />,
  other: <Package className="h-4 w-4" />,
}

const categoryStyles: Record<ExpenseCategory, string> = {
  travel: 'border-t-4 border-t-chart-1',
  food: 'border-t-4 border-t-chart-2',
  groceries: 'border-t-4 border-t-chart-3',
  rent: 'border-t-4 border-t-chart-4',
  other: 'border-t-4 border-t-chart-5',
}

export function ExpenseKanban({
  expenses,
  onDeleteExpense,
  travelSpent,
  foodSpent,
  groceriesSpent,
  rentSpent,
  otherSpent,
}: ExpenseKanbanProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const categoryTotals: Record<ExpenseCategory, number> = {
    travel: travelSpent,
    food: foodSpent,
    groceries: groceriesSpent,
    rent: rentSpent,
    other: otherSpent,
  }

  const getExpensesByCategory = (category: ExpenseCategory) => {
    return expenses.filter((exp) => exp.category === category)
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
      {EXPENSE_CATEGORIES.map((cat) => {
        const categoryExpenses = getExpensesByCategory(cat.value)
        const total = categoryTotals[cat.value]

        return (
          <Card key={cat.value} className={`${categoryStyles[cat.value]} flex flex-col`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {categoryIcons[cat.value]}
                  <span>{cat.label}</span>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {formatCurrency(total)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2">
              <ScrollArea className="h-[280px] pr-2">
                <div className="space-y-2">
                  {categoryExpenses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No expenses
                    </div>
                  ) : (
                    categoryExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="group bg-secondary/50 rounded-lg p-3 hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm">
                              {formatCurrency(expense.amount)}
                            </p>
                            {expense.description && (
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {expense.description}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(expense.date)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={() => onDeleteExpense(expense.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
