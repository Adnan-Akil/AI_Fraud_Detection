import React from 'react';
import { ProcessedTransaction } from '../types';

interface FraudDetailViewProps {
  transaction: ProcessedTransaction | null;
}

const DetailRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-700">
    <dt className="text-sm font-medium text-gray-400">{label}</dt>
    <dd className="text-sm text-white text-right">{value}</dd>
  </div>
);

export const FraudDetailView: React.FC<FraudDetailViewProps> = ({ transaction }) => {
  if (!transaction) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg flex items-center justify-center h-full">
        <p className="text-gray-400">Select a transaction to view details.</p>
      </div>
    );
  }

  const isFraud = transaction.analysis.isFraud;
  const scoreColor = transaction.analysis.fraudScore > 75 ? 'text-red-500' :
                     transaction.analysis.fraudScore > 40 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="bg-gray-800 p-6 rounded-lg h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4">Transaction Analysis</h2>
      <div className="flex-grow overflow-y-auto pr-2">
        <div className={`p-4 rounded-lg mb-4 border ${isFraud ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/20'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-xl font-semibold ${isFraud ? 'text-red-400' : 'text-green-400'}`}>
              {isFraud ? 'Fraud Alert' : 'Transaction Clear'}
            </h3>
            <div className="text-center">
              <p className="text-xs text-gray-400">Fraud Score</p>
              <p className={`text-3xl font-bold ${scoreColor}`}>{transaction.analysis.fraudScore}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium mb-1">AI-Powered Reason:</p>
            <p className="text-base text-gray-200 bg-gray-900/30 p-3 rounded-md shadow-inner">
              {transaction.analysis.reason}
            </p>
          </div>
        </div>
        
        <h3 className="font-semibold mb-2">Transaction Details</h3>
        <dl>
          <DetailRow label="Transaction ID" value={transaction.transactionId} />
          <DetailRow label="Timestamp" value={new Date(transaction.timestamp).toLocaleString()} />
          <DetailRow label="Amount" value={`${transaction.amount.toFixed(2)} ${transaction.currency}`} />
          <DetailRow label="Merchant" value={transaction.merchant} />
          <DetailRow label="Country" value={transaction.country} />
        </dl>
        
        <h3 className="font-semibold mt-4 mb-2">User Profile</h3>
        <dl>
          <DetailRow label="User ID" value={transaction.user.id} />
          <DetailRow label="User Name" value={transaction.user.name} />
          <DetailRow label="Home Country" value={transaction.user.homeCountry} />
          <DetailRow label="Typical Spend" value={`$${transaction.user.typicalSpending.min} - $${transaction.user.typicalSpending.max}`} />
        </dl>
      </div>
    </div>
  );
};