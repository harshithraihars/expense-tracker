'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Settings, Wallet, UtensilsCrossed, ShoppingCart } from 'lucide-react'
import { Budget } from '@/lib/types'

interface SetBudgetDialogProps {
  budget: Budget | null
  onSetBudget: (monthlyTotal: number, foodBudget: number, groceriesBudget: number) => Promise<void>
}

export function SetBudgetDialog({ budget, onSetBudget }: SetBudgetDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [monthlyTotal, setMonthlyTotal] = useState('')
  const [foodBudget, setFoodBudget] = useState('')
  const [groceriesBudget, setGroceriesBudget] = useState('')

  useEffect(() => {
    if (budget) {
      setMonthlyTotal(budget.monthlyTotal.toString())
      setFoodBudget(budget.foodBudget.toString())
      setGroceriesBudget(budget.groceriesBudget.toString())
    }
  }, [budget])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!monthlyTotal) return

    setLoading(true)
    try {
      await onSetBudget(
        parseFloat(monthlyTotal),
        parseFloat(foodBudget) || 0,
        parseFloat(groceriesBudget) || 0
      )
      setOpen(false)
    } catch (error) {
      console.error('Failed to set budget:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Set Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Monthly Budget</DialogTitle>
          <DialogDescription>
            Configure your spending limits for this month.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="monthlyTotal" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Total Monthly Budget ($)
              </Label>
              <Input
                id="monthlyTotal"
                type="number"
                step="0.01"
                min="0"
                placeholder="5000.00"
                value={monthlyTotal}
                onChange={(e) => setMonthlyTotal(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="foodBudget" className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                Food Budget ($)
              </Label>
              <Input
                id="foodBudget"
                type="number"
                step="0.01"
                min="0"
                placeholder="500.00"
                value={foodBudget}
                onChange={(e) => setFoodBudget(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="groceriesBudget" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Groceries Budget ($)
              </Label>
              <Input
                id="groceriesBudget"
                type="number"
                step="0.01"
                min="0"
                placeholder="400.00"
                value={groceriesBudget}
                onChange={(e) => setGroceriesBudget(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Budget'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
