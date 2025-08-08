import { Request, Response } from "express";
import Income, { IncomeDocument } from "../models/Income";
import Expense, { ExpenseDocument } from "../models/Expense";
import { isValidObjectId, Types } from "mongoose";

export interface DashboardTotals {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  last30DaysExpenses: { total: number; transactions: ExpenseDocument[] };
  last60DaysIncome: { total: number; transactions: IncomeDocument[] };
  recentTransactions: Array<{
    _id: string;
    userId: Types.ObjectId;
    icon?: string | null;
    source?: string;
    category?: string;
    amount: number;
    date: Date;
    type: "income" | "expense";
  }>;
}

const sumAmounts = <TransactionType extends { amount: number }>(
  transactions: TransactionType[]
): number =>
  transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

async function getTotalIncome(userObjectId: Types.ObjectId): Promise<number> {
  const result = await Income.aggregate([
    { $match: { userId: userObjectId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return result[0]?.total || 0;
}

async function getTotalExpense(userObjectId: Types.ObjectId): Promise<number> {
  const result = await Expense.aggregate([
    { $match: { userId: userObjectId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return result[0]?.total || 0;
}

async function getIncomeTransactions(
  userObjectId: Types.ObjectId,
  days: number
): Promise<IncomeDocument[]> {
  return Income.find({
    userId: userObjectId,
    date: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
  }).sort({ date: -1 });
}

async function getExpenseTransactions(
  userObjectId: Types.ObjectId,
  days: number
): Promise<ExpenseDocument[]> {
  return Expense.find({
    userId: userObjectId,
    date: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
  }).sort({ date: -1 });
}

async function getRecentTransactions(userObjectId: Types.ObjectId) {
  const [recentIncomes, recentExpenses] = await Promise.all([
    Income.find({ userId: userObjectId })
      .sort({ date: -1 })
      .limit(10),
    Expense.find({ userId: userObjectId })
      .sort({ date: -1 })
      .limit(10),
  ]);

  return [
    ...recentIncomes.map((transaction) => ({
      ...transaction.toObject(),
      type: "income" as const,
      _id: String(transaction._id),
    })),
    ...recentExpenses.map((transaction) => ({
      ...transaction.toObject(),
      type: "expense" as const,
      _id: String(transaction._id),
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
}

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const userObjectId = new Types.ObjectId(String(userId));

    const [totalIncome, totalExpenses] = await Promise.all([
      getTotalIncome(userObjectId),
      getTotalExpense(userObjectId),
    ]);

    const [last60DaysIncomeTransactions, last30DaysExpenseTransactions] =
      await Promise.all([
        getIncomeTransactions(userObjectId, 60),
        getExpenseTransactions(userObjectId, 30),
      ]);

    const incomeLast60Days = sumAmounts(last60DaysIncomeTransactions);
    const expensesLast30Days = sumAmounts(last30DaysExpenseTransactions);

    const recentTransactions = await getRecentTransactions(userObjectId);

    const response: DashboardTotals = {
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions,
    };

    return res.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ message: "Error fetching dashboard data", error: errorMessage });
  }
};
