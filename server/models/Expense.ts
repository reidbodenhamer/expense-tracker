import mongoose, { Document, Schema } from "mongoose";

export interface ExpenseDocument extends Document {
  userId: mongoose.Types.ObjectId;
  icon?: string | null;
  category: string;
  amount: number;
  date: Date;
}

const expenseSchema: Schema = new Schema<ExpenseDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: { type: String },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Expense = mongoose.model<ExpenseDocument>("Expense", expenseSchema);

export default Expense;
