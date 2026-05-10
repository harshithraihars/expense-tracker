export type ExpenseCategory = 'travel' | 'food' | 'groceries' | 'rent' | 'other'

export interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  description: string
  date: string
  createdAt: number
}

export interface Budget {
  id: string
  monthlyTotal: number
  foodBudget: number
  groceriesBudget: number
  month: string // Format: "YYYY-MM"
  createdAt: number
}

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'food', label: 'Food', icon: '🍕' },
  { value: 'groceries', label: 'Groceries', icon: '🛒' },
  { value: 'rent', label: 'Rent', icon: '🏠' },
  { value: 'other', label: 'Other', icon: '📦' },
]

export const getCategoryColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    travel: 'bg-chart-1',
    food: 'bg-chart-2',
    groceries: 'bg-chart-3',
    rent: 'bg-chart-4',
    other: 'bg-chart-5',
  }
  return colors[category]
}

export const getCategoryBorderColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    travel: 'border-l-chart-1',
    food: 'border-l-chart-2',
    groceries: 'border-l-chart-3',
    rent: 'border-l-chart-4',
    other: 'border-l-chart-5',
  }
  return colors[category]
}
