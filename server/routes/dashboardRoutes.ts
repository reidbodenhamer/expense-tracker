import express, { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { getDashboardData } from "../controllers/dashboardController";

const router: Router = express.Router();

router.get("/", protect, getDashboardData);

export default router;
