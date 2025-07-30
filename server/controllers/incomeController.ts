import express, { Request, Response } from "express";
import User from "../models/User";
import Income, { IncomeDocument } from "../models/Income";
import xlsx from "xlsx";

interface AddIncomeRequestBody {
  icon?: string;
  source: string;
  amount: number;
  date: string;
}

export const addIncome = async (
  req: Request<{}, {}, AddIncomeRequestBody>,
  res: Response
) => {
  const userId = req.user?._id;

  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error adding income", error: errorMessage });
  }
};

export const getAllIncome = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  try {
    // sorted by most recent
    const income: IncomeDocument[] = await Income.find({ userId }).sort({
      date: -1,
    });
    res.status(200).json(income);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error fetching income", error: errorMessage });
  }
};

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error deleting income", error: errorMessage });
  }
};

interface IncomeExcelRow {
  Source: string;
  Amount: number;
  Date: Date;
}

export const downloadIncomeExcel = async (req: Request, res: Response) => {
    const userId = req.user?._id;

    try {
        const income: IncomeDocument[] = await Income.find({ userId }).sort({ date: -1 });

        const data: IncomeExcelRow[] = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Income");
        xlsx.writeFile(workbook, "income_details.xlsx");
        res.download("income_details.xlsx");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res
            .status(500)
            .json({ message: "Error downloading income report", error: errorMessage });
    }
};
