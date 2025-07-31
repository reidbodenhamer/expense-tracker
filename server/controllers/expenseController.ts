import express, { Request, Response } from "express";
import User from "../models/User";
import Expense, { ExpenseDocument } from "../models/Expense";
import xlsx from "xlsx";

interface AddExpenseRequestBody {
  icon?: string;
  category: string;
  amount: number;
  date: string;
}

export const addExpense = async (
  req: Request<{}, {}, AddExpenseRequestBody>,
  res: Response
) => {
  const userId = req.user?._id;

  try {
    const { icon, category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error adding expense", error: errorMessage });
  }
};

export const getAllExpenses = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  try {
    // sorted by most recent
    const expenses: ExpenseDocument[] = await Expense.find({ userId }).sort({
      date: -1,
    });
    res.status(200).json(expenses);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error fetching expenses", error: errorMessage });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error deleting expense", error: errorMessage });
  }
};

interface ExpenseExcelRow {
  category: string;
  amount: number;
  date: Date;
}

export const downloadExpenseExcel = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  try {
    const expenses: ExpenseDocument[] = await Expense.find({ userId }).sort({
      date: -1,
    });

    const data: ExpenseExcelRow[] = expenses.map((item) => ({
      category: item.category,
      amount: item.amount,
      date: item.date,
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Expenses");
    xlsx.writeFile(workbook, "expense_details.xlsx");
    res.download("expense_details.xlsx");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      message: "Error downloading expense report",
      error: errorMessage,
    });
  }
};
