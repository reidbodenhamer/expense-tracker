export interface Income {
  _id: string;
  userId: string;
  source?: string;
  amount: number;
  date: Date;
  icon?: string | null;
}

export interface Expense {
  _id: string;
  userId: string;
  category?: string;
  amount: number;
  date: Date;
  icon?: string | null;
}

export interface RecentTransaction {
  _id: string;
  userId: string;
  icon?: string | null;
  source?: string;
  category?: string;
  amount: number;
  date: Date;
  type: "income" | "expense";
}
