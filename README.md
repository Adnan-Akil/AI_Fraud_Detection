## AI Fraud Detection Simulator

An interactive simulator that demonstrates how an AI (GROQ) powered backend can analyze transactions and flag potential fraud. This repository contains a TypeScript React frontend (Vite) and a small Express backend that calls GROQ's API (using Mixtral-8x7b) to assess transactions.

---

## Live demo / Hosting

Frontend (planned): [YOUR_FRONTEND_URL_HERE]

Replace the placeholder above with the URL where you host the built frontend (Netlify, Vercel, GitHub Pages, or your own domain).

---

## Key features

- Simulated transaction feed with realistic user profiles and merchants (see `services/dataGenerator.ts`).
- Backend AI analysis using GROQ (Mixtral-8x7b model) to return a structured fraud assessment.
- Frontend UI components to view transactions and detailed AI explanations.

---

## Architecture

- Frontend: Vite + React + TypeScript (root folder)
- Backend: Express server in `backend/server.js` that exposes a single analysis endpoint and calls the Gemini API.
- Services: reusable helpers in `services/` (transaction generator, Gemini client wrapper)

Diagram (conceptual):

Frontend (React) <--fetch-- backend (Express) <--calls-- GROQ API

---

## Quick start (development)

Prerequisites:

- Node.js 18+ (or current LTS)
- npm (or yarn)

1. Clone the repo and install frontend dependencies

```powershell
# from project root
npm install
```

2. Start the frontend dev server (Vite)

```powershell
npm run dev
```

The frontend dev server will start (usually on http://localhost:5173). Open that URL in the browser.

3. Start the backend server

```powershell
cd backend
npm install
# create a .env file next (see below)
npm start
```

The backend listens on port 3001 by default (http://localhost:3001).

4. Environment variables

Create a `backend/.env` file with your GROQ API key:

```
GROQ_API_KEY=your_groq_api_key_here
```

You can get a free GROQ API key at https://console.groq.com. The server will throw an error if `GROQ_API_KEY` is missing when it initializes the client.

---

## Build & preview (production)

Build the frontend:

```powershell
npm run build
```

Preview the built frontend locally:

```powershell
npm run preview
```

Deploy the produced `dist/` folder to your chosen static host. Then update the "Live demo" URL at the top of this README.

---

## Backend API

Single endpoint used by the frontend:

- POST /analyze-transaction
  - Body: JSON transaction object (see `types.ts` for the `Transaction` shape)
  - Response: JSON in shape { isFraud: boolean, reason: string, fraudScore: number }

Example (cURL / PowerShell):

```powershell
# Example payload stored in transaction.json
# POST to backend
curl -Method POST -Uri http://localhost:3001/analyze-transaction -ContentType 'application/json' -Body (Get-Content transaction.json -Raw)
```

If the backend cannot reach the Gemini API or encounters an error, it returns a fallback object and logs the error to the server console.

---

## Services and utilities

- `services/dataGenerator.ts` — Generates randomized transactions using sample user profiles. Use `generateTransaction()` to get a single transaction object (the generator includes both normal and simulated fraudulent transactions).
- `services/geminiService.ts` — Frontend helper that POSTs a transaction to the backend analysis endpoint and validates the response shape.

Quick example (Node / script) showing the generator usage (run with ts-node or import into your frontend code):

```typescript
import { generateTransaction } from "./services/dataGenerator";

const t = generateTransaction();
console.log(JSON.stringify(t, null, 2));
```

Run with ts-node (one-off):

```powershell
npx ts-node services/dataGenerator.ts
```

If you prefer not to use `ts-node`, import the generator into the frontend code and call it directly in the browser environment (the generator is pure TS/JS compatible code).

---

## How the AI analysis works (high level)

- The backend composes a prompt describing fraud indicators and calls GROQ API with the Mixtral-8x7b model.
- The model returns structured JSON with `isFraud`, `reason`, and `fraudScore` (0–100).
- GROQ's Mixtral model provides detailed reasoning in natural language to explain its fraud assessment.
- The frontend displays the analysis and the human-readable reason to help triage transactions.

---

## Troubleshooting

- Backend throws "GROQ_API_KEY is not defined": create `backend/.env` with `GROQ_API_KEY` and restart the server.
- Frontend reports network errors when fetching analysis: ensure backend is running at `http://localhost:3001` and CORS is enabled (the backend already uses CORS).

---

## Next steps / ideas

- Add auth and user session context so the AI can use historical spending patterns.
- Record analysis outcomes to a database for dashboarding and metrics.
- Add unit/integration tests for backend endpoints and AI response validation.
- Add an E2E demo that automatically generates and analyzes a stream of transactions.

---

## Contributing

Contributions are welcome. Open an issue or submit a PR describing changes. Keep changes focused and include tests for new behavior where possible.

---

## Author / Contact

Maintainer: Adnan-Akil

For questions, update the README placeholder with the hosting URL and any additional docs you want surfaced.
