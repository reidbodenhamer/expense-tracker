import mongoose, { Document } from "mongoose";

export interface IncomeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  icon?: string;
  source: string; // Ex: "Salary", "Gift", etc.
  amount: number;
  date: Date;
}

const IncomeSchema = new mongoose.Schema<IncomeDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: { type: String },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", IncomeSchema);
export default Income;
