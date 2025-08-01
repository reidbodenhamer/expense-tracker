import { Request, Response } from "express";
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

export const getAllIncomes = async (req: Request, res: Response) => {
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
  const userId = req.user?._id;

  try {
    const income = await Income.findOne({ _id: req.params.id, userId });
    if (!income) {
      return res.status(404).json({ message: "Income record not found" });
    }

    await income.deleteOne();
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error deleting income", error: errorMessage });
  }
};

interface IncomeExcelRow {
  source: string;
  amount: number;
  date: Date;
}

export const downloadIncomeExcel = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  try {
    const incomes: IncomeDocument[] = await Income.find({ userId }).sort({
      date: -1,
    });

    if (incomes.length === 0) {
      return res.status(404).json({ message: "No incomes found to export" });
    }

    const data: IncomeExcelRow[] = incomes.map((item) => ({
      source: item.source,
      amount: item.amount,
      date: item.date,
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Income");

    const excelBuffer = xlsx.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excelBuffer);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      message: "Error downloading income report",
      error: errorMessage,
    });
  }
};
