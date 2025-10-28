import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing of JSON request bodies

// Initialize GROQ client
if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined in the .env file.");
}

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

// API endpoint for analyzing transactions
app.post("/analyze-transaction-groq", async (req, res) => {
  const transaction = req.body;

  if (!transaction) {
    return res.status(400).json({ error: "Transaction data is required." });
  }

  try {
    const transactionString = JSON.stringify(transaction, null, 2);

    const prompt = `You are a highly advanced AI fraud detection engine for a bank.
Your task is to analyze bank transactions and determine if they are fraudulent.

Consider these fraud indicators:
1. High Amount: Is the transaction amount significantly higher than the user's typical spending range?
2. Unusual Location: Is the transaction occurring in a country different from the user's home country?
3. Rapid Transactions: (Context not provided in single transaction, but be aware of this pattern)
4. Merchant Type: Is the merchant unusual for this user? (Context not provided)

Analyze this transaction: ${transactionString}

Respond with ONLY a valid JSON object containing exactly these fields:
{
  "isFraud": boolean,        // true if fraudulent, false if legitimate
  "reason": string,         // detailed explanation for the assessment
  "fraudScore": number      // 0-100 score, higher means more likely fraud
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // Using Llama 3 model
      temperature: 0.3, // Lower temperature for more consistent output
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    // Validate the response has all required fields
    if (
      typeof result.isFraud !== "boolean" ||
      typeof result.reason !== "string" ||
      typeof result.fraudScore !== "number"
    ) {
      throw new Error("Invalid response format from GROQ API");
    }

    res.json(result);
  } catch (error) {
    console.error("Error analyzing transaction with GROQ API:", error);
    // Send a generic error response, but also a fallback analysis object
    res.status(500).json({
      isFraud: true,
      reason:
        "An error occurred during AI analysis on the server. Flagging as potential fraud for manual review.",
      fraudScore: 80,
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
  console.log(
    'To start: create a .env file with GROQ_API_KEY=your_key_here, run "npm install", then "npm start".'
  );
});
