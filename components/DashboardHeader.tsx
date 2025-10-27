
import React from 'react';
import { PlayIcon, StopIcon } from './icons';

interface DashboardHeaderProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  stats: {
    total: number;
    fraud: number;
  };
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isSimulating, onToggleSimulation, stats }) => {
  return (
    <header className="bg-gray-800 p-4 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-center">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold text-teal-500">Bank Fraud Detector</h1>
        <p className="text-sm text-gray-400">Real-time transaction analysis powered by AI</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <span className="text-gray-400 text-xs uppercase">Processed</span>
          <p className="text-xl font-semibold">{stats.total}</p>
        </div>
        <div className="text-center">
          <span className="text-red-500 text-xs uppercase">Fraud Detected</span>
          <p className="text-xl font-semibold text-red-500">{stats.fraud}</p>
        </div>
        <button
          onClick={onToggleSimulation}
          className={`p-3 rounded-full transition-colors duration-300 ${isSimulating ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'}`}
        >
          {isSimulating ? <StopIcon className="w-6 h-6 text-white" /> : <PlayIcon className="w-6 h-6 text-white" />}
        </button>
      </div>
    </header>
  );
};
