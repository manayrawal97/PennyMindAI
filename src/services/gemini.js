/**
 * Service to call Gemini API client-side and analyze transaction details.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Sends a list of normalized transactions to Gemini for full financial analysis.
 * @param {Array} transactions - List of transactions {date, description, amount, category}.
 * @param {string} apiKey - Gemini API Key.
 * @returns {Promise<Object>} - The analyzed JSON report.
 */
export const analyzeTransactionsWithGemini = async (transactions, apiKey) => {
  if (!apiKey) {
    throw new Error('API Key is required to call Google Gemini API.');
  }

  // Format transactions to minimize tokens, sending only date, description, amount, and original category
  const minimalTx = transactions.map(t => ({
    date: t.date,
    description: t.description,
    amount: t.amount,
  }));

  const systemInstructions = `You are a world-class financial advisor, forensic accountant, and personal finance analyst specializing in Indian personal finance.
Analyze the provided transaction list. All transactions and values are in Indian Rupees (INR, ₹).
Return JSON only.
Categorize every transaction.
Identify subscriptions.
Detect duplicate payments (same amount, same description, close date).
Identify unnecessary or excessive expenses.
Detect spending patterns (dining out on Swiggy/Zomato, shopping habits, weekend spend vs weekday spend).
Generate financial insights.
Provide actionable savings recommendations with priority, estimated savings in INR (₹), and action steps.
Generate a financial health score from 0-100 based on savings rate, subscription density, and budget discipline.
Return CLEAN JSON structure matching the EXACT type schema defined below. Do not wrap in markdown tags like \`\`\`json. Return raw JSON text.`;

  const jsonSchema = `{
  "healthScore": 85,
  "summary": "Short paragraph summarizing spending behavior in Indian Rupees, main leakages, and savings opportunities. E.g., 'You spent ₹8,200 on food delivery this month.'",
  "categories": [
    {
      "name": "Category Name (e.g. Housing, Dining & Drinks, Groceries, Subscriptions & SaaS, Shopping, Transportation, Utilities, Entertainment, Fitness, Others)",
      "amount": 15000.00,
      "percentage": 15.0,
      "color": "Hex color code matching the category mood (e.g. #6366f1, #ec4899, #8b5cf6, #10b981, #3b82f6, #f59e0b, #14b8a6, #ef4444, #a855f7)",
      "count": 3
    }
  ],
  "subscriptions": [
    {
      "name": "Netflix Subscription",
      "amount": 649.00,
      "frequency": "Monthly",
      "type": "Entertainment",
      "description": "Short explanation of service and cost reduction tip in INR."
    }
  ],
  "recommendations": [
    {
      "category": "Subscriptions",
      "priority": "High | Medium | Low",
      "title": "Cancel Netflix",
      "amount": 649.00,
      "action": "Description of suggested action in INR."
    }
  ],
  "spendingPatterns": [
    {
      "pattern": "Weekend dining spike",
      "detail": "Detailed explanation of the trend in INR."
    }
  ],
  "duplicatePayments": [
    {
      "description": "Double Swiggy Charge",
      "date": "2026-06-02",
      "amount": 450.00
    }
  ],
  "unusualSpending": [
    {
      "date": "2026-06-26",
      "description": "Amazon Purchase",
      "amount": 12500.00,
      "explanation": "Why this is flagged (e.g. 300% higher than average transaction)."
    }
  ],
  "cashFlow": {
    "income": 150000.00,
    "expenses": 65000.00,
    "netSavings": 85000.00
  }
}`;

  const promptText = `
Here is the transaction list:
${JSON.stringify(minimalTx, null, 2)}

Provide the analysis using this JSON schema layout:
${jsonSchema}
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemInstructions}\n\n${promptText}`
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || `HTTP ${response.status} Error`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!candidateText) {
      throw new Error('Gemini API returned an empty response.');
    }

    // Try parsing the text. Sometimes models append markdown block indicators anyway.
    let cleanedText = candidateText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const analysisResult = JSON.parse(cleanedText);
    
    // Validate output structure to avoid React app crashes
    return normalizeAnalysisResult(analysisResult, transactions);
  } catch (error) {
    console.error('Gemini Analysis error:', error);
    throw error;
  }
};

/**
 * Normalizes the API output and fills in missing/broken parts with safe default values.
 */
function normalizeAnalysisResult(result, rawTransactions) {
  const norm = { ...result };
  
  norm.healthScore = typeof norm.healthScore === 'number' ? Math.max(0, Math.min(100, norm.healthScore)) : 70;
  norm.summary = norm.summary || 'Analysis complete. Take a look at the key charts and category breakdown below.';
  norm.categories = Array.isArray(norm.categories) ? norm.categories : [];
  norm.subscriptions = Array.isArray(norm.subscriptions) ? norm.subscriptions : [];
  norm.recommendations = Array.isArray(norm.recommendations) ? norm.recommendations : [];
  norm.spendingPatterns = Array.isArray(norm.spendingPatterns) ? norm.spendingPatterns : [];
  norm.duplicatePayments = Array.isArray(norm.duplicatePayments) ? norm.duplicatePayments : [];
  norm.unusualSpending = Array.isArray(norm.unusualSpending) ? norm.unusualSpending : [];

  // Compute fallback cashFlow if not provided
  if (!norm.cashFlow || typeof norm.cashFlow.income !== 'number') {
    let income = 0;
    let expenses = 0;
    rawTransactions.forEach(t => {
      if (t.amount > 0) {
        income += t.amount;
      } else {
        expenses += Math.abs(t.amount);
      }
    });
    norm.cashFlow = {
      income,
      expenses,
      netSavings: income - expenses
    };
  }

  return norm;
}
