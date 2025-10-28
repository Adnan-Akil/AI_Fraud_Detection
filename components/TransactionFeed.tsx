
import React, { useRef, useEffect } from 'react';
import { ProcessedTransaction } from '../types';
import TransactionItem from './TransactionItem';

interface TransactionFeedProps {
  transactions: ProcessedTransaction[];
  onSelectTransaction: (transaction: ProcessedTransaction) => void;
  selectedTransactionId?: string;
  isSimulating: boolean;
}

export const TransactionFeed: React.FC<TransactionFeedProps> = ({ transactions, onSelectTransaction, selectedTransactionId, isSimulating }) => {
  const feedRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [transactions]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col h-full">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        Live Transaction Feed
        {isSimulating && <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse-fast"></span>}
      </h2>
      <div className="overflow-y-auto flex-grow pr-2 hide-scrollbar">
        <ul ref={feedRef}>
          {transactions.length === 0 && (
            <li className="text-center text-gray-400 py-10">
              {isSimulating ? 'Waiting for first transaction...' : 'Start simulation to see transactions.'}
            </li>
          )}
          {transactions.map((tx) => (
            <TransactionItem
              key={tx.transactionId}
              transaction={tx}
              onSelect={onSelectTransaction}
              isSelected={tx.transactionId === selectedTransactionId}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
