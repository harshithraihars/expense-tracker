'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plane, UtensilsCrossed, ShoppingCart, Home, Package, TrendingUp } from 'lucide-react'
import { ExpenseCategory } from '@/lib/types'

interface ExpenseSummaryProps {
  totalSpent: number
  travelSpent: number
  foodSpent: number
  groceriesSpent: number
  rentSpent: number
  otherSpent: number
}

export function ExpenseSummary({
  totalSpent,
  travelSpent,
  foodSpent,
  groceriesSpent,
  rentSpent,
  otherSpent,
}: ExpenseSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getPercentage = (amount: number) => {
    if (totalSpent === 0) return 0
    return ((amount / totalSpent) * 100).toFixed(1)
  }

  const categories = [
    { name: 'Travel', amount: travelSpent, icon: <Plane className="h-4 w-4" />, color: 'bg-chart-1' },
    { name: 'Food', amount: foodSpent, icon: <UtensilsCrossed className="h-4 w-4" />, color: 'bg-chart-2' },
    { name: 'Groceries', amount: groceriesSpent, icon: <ShoppingCart className="h-4 w-4" />, color: 'bg-chart-3' },
    { name: 'Rent', amount: rentSpent, icon: <Home className="h-4 w-4" />, color: 'bg-chart-4' },
    { name: 'Other', amount: otherSpent, icon: <Package className="h-4 w-4" />, color: 'bg-chart-5' },
  ]

  // Sort categories by amount (highest first)
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Spending Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total */}
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="font-medium">Total Spent</span>
            <span className="text-xl font-bold">{formatCurrency(totalSpent)}</span>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            {sortedCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${cat.color}`}>
                  <span className="text-primary-foreground">{cat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <span className="text-sm font-mono">{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-secondary rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${cat.color}`}
                        style={{ width: `${getPercentage(cat.amount)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {getPercentage(cat.amount)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
