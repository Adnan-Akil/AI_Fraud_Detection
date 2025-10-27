
export interface UserProfile {
  id: string;
  name: string;
  homeCountry: string;
  typicalSpending: { min: number; max: number };
}

export interface Transaction {
  transactionId: string;
  timestamp: string;
  amount: number;
  currency: string;
  merchant: string;
  country: string;
  user: UserProfile;
}

export interface FraudAnalysisResult {
  isFraud: boolean;
  reason: string;
  fraudScore: number;
}

export interface ProcessedTransaction extends Transaction {
  analysis: FraudAnalysisResult;
}
