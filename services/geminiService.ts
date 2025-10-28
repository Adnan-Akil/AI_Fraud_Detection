import { Transaction, FraudAnalysisResult } from '../types';

// The backend server URL
const API_URL = 'http://localhost:3001/analyze-transaction-groq';

export const analyzeTransaction = async (transaction: Transaction): Promise<FraudAnalysisResult> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      // Try to parse the error message from the backend if available
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.reason || `Network response was not ok (status: ${response.status})`;
      throw new Error(errorMessage);
    }
    
    const result: FraudAnalysisResult = await response.json();
    
    // Basic validation of the response from our backend
    if (typeof result.isFraud === 'boolean' && typeof result.reason === 'string' && typeof result.fraudScore === 'number') {
      return result;
    } else {
        throw new Error("Invalid response format from the backend server");
    }

  } catch (error) {
    console.error("Error calling backend service:", error);
    let reason = "Could not connect to the analysis server. Is it running? Flagging as potential fraud for manual review.";
    if (error instanceof Error) {
        // If we got a specific error message from the backend, use it
        if(error.message.includes("Network response was not ok") || error.message.includes("Invalid response format")) {
            reason = error.message;
        }
    }
    
    return {
      isFraud: true,
      reason: reason,
      fraudScore: 80,
    };
  }
};
