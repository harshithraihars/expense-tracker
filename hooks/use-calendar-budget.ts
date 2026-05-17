'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { WeeklyBudget, Expense } from '@/lib/types'

const getCurrentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function useCalendarBudget(expenses: Expense[]) {
  const [weeklyBudget, setWeeklyBudget] = useState<WeeklyBudget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentMonth = getCurrentMonth()

  // Listen to weekly budget for current month
  useEffect(() => {
    const budgetQuery = query(
      collection(db, 'weeklyBudgets'),
      where('month', '==', currentMonth)
    )

    const unsubscribe = onSnapshot(
      budgetQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          setWeeklyBudget({ id: doc.id, ...doc.data() } as WeeklyBudget)
        } else {
          setWeeklyBudget(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching weekly budget:', err)
        setError('Failed to load budget')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [currentMonth])

  const setWeeklyBudgetValues = useCallback(
    async (weekdayBudget: number, weekendBudget: number) => {
      try {
        if (weeklyBudget) {
          await updateDoc(doc(db, 'weeklyBudgets', weeklyBudget.id), {
            weekdayBudget,
            weekendBudget,
          })
        } else {
          await addDoc(collection(db, 'weeklyBudgets'), {
            weekdayBudget,
            weekendBudget,
            month: currentMonth,
            createdAt: Date.now(),
          })
        }
      } catch (err) {
        console.error('Error setting weekly budget:', err)
        throw new Error('Failed to set budget')
      }
    },
    [weeklyBudget, currentMonth]
  )

  // Calculate daily spending for food and groceries only
  const getDayExpenses = useCallback(
    (day: number) => {
      const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`
      return expenses.filter(
        (exp) =>
          exp.date === dateStr &&
          (exp.category === 'food' || exp.category === 'groceries')
      )
    },
    [expenses, currentMonth]
  )

  const getDaySpent = useCallback(
    (day: number) => {
      return getDayExpenses(day).reduce((sum, exp) => sum + exp.amount, 0)
    },
    [getDayExpenses]
  )

  const getDayBudget = useCallback(
    (day: number) => {
      if (!weeklyBudget) return 0

      const date = new Date(
        parseInt(currentMonth.split('-')[0]),
        parseInt(currentMonth.split('-')[1]) - 1,
        day
      )
      const dayOfWeek = date.getDay()

      // 0 = Sunday, 6 = Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      return isWeekend ? weeklyBudget.weekendBudget : weeklyBudget.weekdayBudget
    },
    [weeklyBudget, currentMonth]
  )

  const getDayRemaining = useCallback(
    (day: number) => {
      const budget = getDayBudget(day)
      const spent = getDaySpent(day)
      return budget - spent
    },
    [getDayBudget, getDaySpent]
  )

  return {
    weeklyBudget,
    loading,
    error,
    setWeeklyBudgetValues,
    getDayExpenses,
    getDaySpent,
    getDayBudget,
    getDayRemaining,
    currentMonth,
  }
}
