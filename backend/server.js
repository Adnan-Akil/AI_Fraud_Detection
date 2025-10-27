import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing of JSON request bodies

// Initialize Gemini AI
if (!process.env.API_KEY) {
  throw new Error("API_KEY is not defined in the .env file.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fraudDetectionSchema = {
  type: Type.OBJECT,
  properties: {
    isFraud: {
      type: Type.BOOLEAN,
      description: 'Is the transaction likely fraudulent?',
    },
    reason: {
      type: Type.STRING,
      description: 'A detailed explanation for the fraud assessment. If not fraud, state that it appears normal and why. If it is fraud, explain the indicators.',
    },
    fraudScore: {
      type: Type.NUMBER,
      description: 'A score from 0 (not fraud) to 100 (definitely fraud).',
    },
  },
  required: ['isFraud', 'reason', 'fraudScore'],
};

// API endpoint for analyzing transactions
app.post('/analyze-transaction', async (req, res) => {
  const transaction = req.body;

  if (!transaction) {
    return res.status(400).json({ error: 'Transaction data is required.' });
  }

  try {
    const transactionString = JSON.stringify(transaction, null, 2);

    const systemInstruction = `
      You are a highly advanced AI fraud detection engine for a bank.
      Your task is to analyze bank transactions and determine if they are fraudulent.
      
      Consider these fraud indicators:
      1.  **High Amount:** Is the transaction amount significantly higher than the user's typical spending range?
      2.  **Unusual Location:** Is the transaction occurring in a country different from the user's home country?
      3.  **Rapid Transactions:** (Context not provided in single transaction, but be aware of this pattern).
      4.  **Merchant Type:** Is the merchant unusual for this user? (Context not provided).

      Analyze the following transaction and return your assessment in the specified JSON format.
      Provide a concise, clear reason for your decision.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this transaction: ${transactionString}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: fraudDetectionSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    res.json(result);

  } catch (error) {
    console.error("Error analyzing transaction with Gemini API:", error);
    // Send a generic error response, but also a fallback analysis object
    res.status(500).json({
      isFraud: true,
      reason: "An error occurred during AI analysis on the server. Flagging as potential fraud for manual review.",
      fraudScore: 80,
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
  console.log('To start: create a .env file with your API_KEY, run "npm install", then "npm start".');
});
