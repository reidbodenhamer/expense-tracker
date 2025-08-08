import React from 'react'
import { ExpenseTransactionsProps } from "../../types"
import { LuArrowRight } from "react-icons/lu"
import TransactionInfoCard from "../Cards/TransactionInfoCard"
import moment from "moment";
import { DATE_FORMATS } from "../../constants";

const ExpenseTransactions: React.FC<ExpenseTransactionsProps> = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>

        <button className="card-button" onClick={onSeeMore}>
            See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5).map((transaction) => (
          <TransactionInfoCard
            key={transaction._id}
            title={transaction.category || "Uncategorized Expense"}
            icon={transaction.icon ?? undefined}
            date={moment(transaction.date).format(DATE_FORMATS.DISPLAY)}
            amount={transaction.amount}
            type="expense"
            hideDeleteButton
          />
        ))}
        </div>
    </div>
  );
};

export default ExpenseTransactions