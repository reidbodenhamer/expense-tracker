import express, { Router } from "express";
import { 
    addIncome, getAllIncomes, downloadIncomeExcel, deleteIncome
} from "../controllers/incomeController";
import { protect } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncomes);
router.get("/download-excel", protect, downloadIncomeExcel);
router.delete("/:id", protect, deleteIncome);

export default router;
