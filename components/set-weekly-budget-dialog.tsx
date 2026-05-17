'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Calendar } from 'lucide-react'
import { WeeklyBudget } from '@/lib/types'

interface SetWeeklyBudgetDialogProps {
  budget: WeeklyBudget | null
  onSetBudget: (weekdayBudget: number, weekendBudget: number) => Promise<void>
}

export function SetWeeklyBudgetDialog({
  budget,
  onSetBudget,
}: SetWeeklyBudgetDialogProps) {
  const [open, setOpen] = useState(false)
  const [weekdayBudget, setWeekdayBudget] = useState(
    budget?.weekdayBudget.toString() || ''
  )
  const [weekendBudget, setWeekendBudget] = useState(
    budget?.weekendBudget.toString() || ''
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!weekdayBudget || !weekendBudget) {
      setError('Please fill in all budget fields')
      return
    }

    const weekday = parseFloat(weekdayBudget)
    const weekend = parseFloat(weekendBudget)

    if (weekday < 0 || weekend < 0) {
      setError('Budget amounts cannot be negative')
      return
    }

    setLoading(true)
    try {
      await onSetBudget(weekday, weekend)
      setOpen(false)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to set budget'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Set Daily Budgets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Set Weekly Budget</DialogTitle>
          <DialogDescription>
            Set separate daily budgets for weekdays and weekends (Food &
            Groceries only)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Weekday Budget */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Weekday Budget</CardTitle>
                <CardDescription>
                  Monday to Friday daily limit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="weekday-budget" className="text-sm">
                    Daily Budget (Mon-Fri)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="weekday-budget"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter weekday budget"
                      value={weekdayBudget}
                      onChange={(e) => setWeekdayBudget(e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekend Budget */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Weekend Budget</CardTitle>
                <CardDescription>
                  Saturday and Sunday daily limit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="weekend-budget" className="text-sm">
                    Daily Budget (Sat-Sun)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="weekend-budget"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter weekend budget"
                      value={weekendBudget}
                      onChange={(e) => setWeekendBudget(e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                These budgets are for <strong>Food & Groceries only</strong>. Other
                expenses (rent, travel, etc.) are excluded.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Budgets'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
