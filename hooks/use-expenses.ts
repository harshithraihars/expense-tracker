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
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Expense, Budget } from '@/lib/types'

const getCurrentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentMonth = getCurrentMonth()

  // Listen to expenses for current month
  useEffect(() => {
    const startOfMonth = `${currentMonth}-01`
    const endOfMonth = `${currentMonth}-31`

    const expensesQuery = query(
      collection(db, 'expenses'),
      where('date', '>=', startOfMonth),
      where('date', '<=', endOfMonth),
      orderBy('date', 'desc'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      expensesQuery,
      (snapshot) => {
        const expenseData: Expense[] = []
        snapshot.forEach((doc) => {
          expenseData.push({ id: doc.id, ...doc.data() } as Expense)
        })
        setExpenses(expenseData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching expenses:', err)
        setError('Failed to load expenses')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [currentMonth])

  // Listen to budget for current month
  useEffect(() => {
    const budgetQuery = query(
      collection(db, 'budgets'),
      where('month', '==', currentMonth)
    )

    const unsubscribe = onSnapshot(
      budgetQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          setBudget({ id: doc.id, ...doc.data() } as Budget)
        } else {
          setBudget(null)
        }
      },
      (err) => {
        console.error('Error fetching budget:', err)
      }
    )

    return () => unsubscribe()
  }, [currentMonth])

  const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'expenses'), {
        ...expense,
        createdAt: Date.now(),
      })
    } catch (err) {
      console.error('Error adding expense:', err)
      throw new Error('Failed to add expense')
    }
  }, [])

  const deleteExpense = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', id))
    } catch (err) {
      console.error('Error deleting expense:', err)
      throw new Error('Failed to delete expense')
    }
  }, [])

  const setBudgetValues = useCallback(async (monthlyTotal: number, foodBudget: number, groceriesBudget: number) => {
    try {
      if (budget) {
        await updateDoc(doc(db, 'budgets', budget.id), {
          monthlyTotal,
          foodBudget,
          groceriesBudget,
        })
      } else {
        await addDoc(collection(db, 'budgets'), {
          monthlyTotal,
          foodBudget,
          groceriesBudget,
          month: currentMonth,
          createdAt: Date.now(),
        })
      }
    } catch (err) {
      console.error('Error setting budget:', err)
      throw new Error('Failed to set budget')
    }
  }, [budget, currentMonth])

  // Calculate totals
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const foodSpent = expenses.filter(e => e.category === 'food').reduce((sum, exp) => sum + exp.amount, 0)
  const groceriesSpent = expenses.filter(e => e.category === 'groceries').reduce((sum, exp) => sum + exp.amount, 0)
  const travelSpent = expenses.filter(e => e.category === 'travel').reduce((sum, exp) => sum + exp.amount, 0)
  const rentSpent = expenses.filter(e => e.category === 'rent').reduce((sum, exp) => sum + exp.amount, 0)
  const otherSpent = expenses.filter(e => e.category === 'other').reduce((sum, exp) => sum + exp.amount, 0)

  const remainingBudget = budget ? budget.monthlyTotal - totalSpent : 0
  const remainingFoodBudget = budget ? budget.foodBudget - foodSpent : 0
  const remainingGroceriesBudget = budget ? budget.groceriesBudget - groceriesSpent : 0

  return {
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
  }
}
