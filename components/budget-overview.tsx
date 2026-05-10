'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Wallet, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react'
import { Budget } from '@/lib/types'

interface BudgetOverviewProps {
  budget: Budget | null
  totalSpent: number
  foodSpent: number
  groceriesSpent: number
  remainingBudget: number
  remainingFoodBudget: number
  remainingGroceriesBudget: number
}

export function BudgetOverview({
  budget,
  totalSpent,
  foodSpent,
  groceriesSpent,
  remainingBudget,
  remainingFoodBudget,
  remainingGroceriesBudget,
}: BudgetOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getProgressColor = (spent: number, budget: number) => {
    if (budget === 0) return 'bg-muted'
    const percentage = (spent / budget) * 100
    if (percentage >= 100) return 'bg-destructive'
    if (percentage >= 80) return 'bg-warning'
    return 'bg-primary'
  }

  const getPercentage = (spent: number, budget: number) => {
    if (budget === 0) return 0
    return Math.min((spent / budget) * 100, 100)
  }

  if (!budget) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No budget set for this month.
            <br />
            Click &quot;Set Budget&quot; to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Budget Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Total Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{formatCurrency(totalSpent)}</span>
              <span className="text-sm text-muted-foreground">
                of {formatCurrency(budget.monthlyTotal)}
              </span>
            </div>
            <Progress 
              value={getPercentage(totalSpent, budget.monthlyTotal)} 
              className="h-2"
            />
            <div className="flex items-center gap-1 text-sm">
              {remainingBudget >= 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">{formatCurrency(remainingBudget)} remaining</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-destructive" />
                  <span className="text-destructive">{formatCurrency(Math.abs(remainingBudget))} over budget</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Food Budget Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Food Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{formatCurrency(foodSpent)}</span>
              <span className="text-sm text-muted-foreground">
                of {formatCurrency(budget.foodBudget)}
              </span>
            </div>
            <Progress 
              value={getPercentage(foodSpent, budget.foodBudget)} 
              className="h-2"
            />
            <div className="flex items-center gap-1 text-sm">
              {remainingFoodBudget >= 0 ? (
                <span className="text-muted-foreground">{formatCurrency(remainingFoodBudget)} remaining</span>
              ) : (
                <span className="text-destructive">{formatCurrency(Math.abs(remainingFoodBudget))} over</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Groceries Budget Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Groceries Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{formatCurrency(groceriesSpent)}</span>
              <span className="text-sm text-muted-foreground">
                of {formatCurrency(budget.groceriesBudget)}
              </span>
            </div>
            <Progress 
              value={getPercentage(groceriesSpent, budget.groceriesBudget)} 
              className="h-2"
            />
            <div className="flex items-center gap-1 text-sm">
              {remainingGroceriesBudget >= 0 ? (
                <span className="text-muted-foreground">{formatCurrency(remainingGroceriesBudget)} remaining</span>
              ) : (
                <span className="text-destructive">{formatCurrency(Math.abs(remainingGroceriesBudget))} over</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
