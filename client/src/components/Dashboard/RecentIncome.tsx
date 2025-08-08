import React from "react";
import { RecentIncomeProps } from "../../types";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { DATE_FORMATS } from "../../constants";
import moment from "moment";

const RecentIncome: React.FC<RecentIncomeProps> = ({
  transactions,
  onSeeMore,
}) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income</h5>

        <button className="card-button" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5).map((transaction) => (
          <TransactionInfoCard
            key={transaction._id}
            title={transaction.source || "Uncategorized Income"}
            icon={transaction.icon ?? undefined}
            date={moment(transaction.date).format(DATE_FORMATS.DISPLAY)}
            amount={transaction.amount}
            type="income"
            hideDeleteButton
          />
        ))}
      </div>
    </div>
  );
};

export default RecentIncome;
