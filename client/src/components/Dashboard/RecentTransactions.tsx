import React, { useEffect, useState } from "react";
import { ChartData, RecentTransaction, RecentTransactionsProps } from "../../types";
import { LuArrowRight } from "react-icons/lu";
import { IoMdDocument } from "react-icons/io";
import moment from "moment";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { DATE_FORMATS } from "../../constants";
import WaterfallChart from "./WaterfallChart";

const getTransactionTitle = (transaction: RecentTransaction): string => {
  if (transaction.type === "expense") {
    return transaction.category || "Uncategorized Expense";
  }
  return transaction.source || "Unknown Income Source";
};

const getTransactionValue = (transaction: RecentTransaction): number => {
    if (transaction.type === "expense") {
        return -transaction.amount;
    }
    return transaction.amount;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, onSeeMore }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        const result = prepareWaterfallGraphtData(transactions);
        setChartData(result);
    }, [transactions]);

    const prepareWaterfallGraphtData = (transactions: RecentTransaction[]): ChartData[] => {
        const chartData = transactions
            .filter(
                (transaction): transaction is RecentTransaction =>
                    transaction !== null && transaction !== undefined
            )
            .map((transaction) => ({
                label: getTransactionTitle(transaction),
                value: getTransactionValue(transaction),
                date: transaction.date ? new Date(transaction.date) : undefined
            }))
        return chartData;
    }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Recent Transactions</h5>

        <button className="card-button" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      {/* <div className="mt-6">
        {transactions?.slice(0, 5).map((transaction) => (
          <TransactionInfoCard
            key={transaction._id}
            title={getTransactionTitle(transaction)}
            icon={transaction.icon ?? undefined}
            date={moment(transaction.date).format(DATE_FORMATS.DISPLAY)}
            amount={transaction.amount}
            type={transaction.type}
            hideDeleteButton
          />
        ))}
      </div> */}

      <WaterfallChart data={chartData} />
    </div>
  );
};

export default RecentTransactions;
