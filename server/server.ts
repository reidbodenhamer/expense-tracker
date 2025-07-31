import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import incomeRoutes from "./routes/incomeRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import { connectDB } from "./config/db";

dotenv.config(); // load environment variables

const app: Express = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // parse JSON bodies

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);

// serve static uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const PORT: number = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
