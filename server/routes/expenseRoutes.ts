import express, { Router } from "express";
import {
  addExpense,
  getAllExpenses,
  downloadExpenseExcel,
  deleteExpense,
} from "../controllers/expenseController";
import { protect } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpenses);
router.get("/download-excel", protect, downloadExpenseExcel);
router.delete("/:id", protect, deleteExpense);

export default router;
