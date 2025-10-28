
import React from 'react';
import { ProcessedTransaction } from '../types';
import { ShieldCheckIcon, ShieldExclamationIcon } from './icons';

interface TransactionItemProps {
  transaction: ProcessedTransaction;
  onSelect: (transaction: ProcessedTransaction) => void;
  isSelected: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onSelect, isSelected }) => {
  const isFraud = transaction.analysis.isFraud;
  const cardColor = isFraud ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/5 border-transparent';
  const selectedColor = isSelected ? 'ring-2 ring-white' : 'hover:bg-gray-700/50';

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: transaction.currency,
  }).format(transaction.amount);

  return (
    <li
      onClick={() => onSelect(transaction)}
      className={`p-3 mb-2 rounded-lg border cursor-pointer transition-all duration-200 ${cardColor} ${selectedColor}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isFraud ? (
            <ShieldExclamationIcon className="w-8 h-8 text-red-500" />
          ) : (
            <ShieldCheckIcon className="w-8 h-8 text-green-500" />
          )}
          <div>
            <p className="font-semibold">{transaction.merchant}</p>
            <p className="text-xs text-gray-400">{transaction.user.name} - {transaction.country}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${isFraud ? 'text-red-400' : 'text-white'}`}>{formattedAmount}</p>
          <p className="text-xs text-gray-400">{new Date(transaction.timestamp).toLocaleTimeString()}</p>
        </div>
      </div>
    </li>
  );
};

export default TransactionItem;
