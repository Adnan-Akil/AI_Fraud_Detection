
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ProcessedTransaction, Transaction } from './types';
import { generateTransaction } from './services/dataGenerator';
import { analyzeTransaction } from './services/geminiService';
import { DashboardHeader } from './components/DashboardHeader';
import { TransactionFeed } from './components/TransactionFeed';
import { FraudDetailView } from './components/FraudDetailView';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<ProcessedTransaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<ProcessedTransaction | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [stats, setStats] = useState({ total: 0, fraud: 0 });

  const intervalRef = useRef<number | null>(null);

  const processNewTransaction = useCallback(async () => {
    const newTransaction: Transaction = generateTransaction();
    const analysis = await analyzeTransaction(newTransaction);
    
    const processed: ProcessedTransaction = { ...newTransaction, analysis };

    setTransactions(prev => [processed, ...prev.slice(0, 49)]);
    setStats(prev => ({
      total: prev.total + 1,
      fraud: analysis.isFraud ? prev.fraud + 1 : prev.fraud,
    }));

    // If it's the first transaction, select it.
    if (!selectedTransaction) {
        setSelectedTransaction(processed);
    }

  }, [stats.total]);

  const startSimulation = useCallback(() => {
    if (intervalRef.current !== null) return;
    setIsSimulating(true);
    processNewTransaction(); // Process one immediately
    intervalRef.current = window.setInterval(processNewTransaction, 3000);
  }, [processNewTransaction]);

  const stopSimulation = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSimulating(false);
  }, []);

  const handleToggleSimulation = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };
  
  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSelectTransaction = (transaction: ProcessedTransaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      <DashboardHeader
        isSimulating={isSimulating}
        onToggleSimulation={handleToggleSimulation}
        stats={stats}
      />
      <main className="flex-grow p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
        <div className="h-full overflow-hidden">
            <TransactionFeed
              transactions={transactions}
              onSelectTransaction={handleSelectTransaction}
              selectedTransactionId={selectedTransaction?.transactionId}
              isSimulating={isSimulating}
            />
        </div>
        <div className="h-full overflow-hidden">
            <FraudDetailView transaction={selectedTransaction} />
        </div>
      </main>
    </div>
  );
};

export default App;
