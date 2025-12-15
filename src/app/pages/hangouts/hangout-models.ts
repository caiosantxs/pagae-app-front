export interface HangOut{
  id: number,
  title: string,
  description: string,
  creatorId: number,
  expenses: Expense[]
}

export interface Expense{
  id: number,
  description: string,
  totalAmount: number,
  hangout: HangOut,
  payments: Payment[]
}

export interface ExpenseShare{
  id: number,
  expenseId: number,
  user: User,
  amountOwed: number,
  isPaid: boolean
}

export interface Payment{
  id: number,
  amount: number,
  user: User
}

export interface User{
  id: number,
  name: string,
  login: string,
  email: string,
  role: string
}
