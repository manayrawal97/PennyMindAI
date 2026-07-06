export const MOCK_CSV_TEXT = `Date,Description,Debit,Credit,Amount
2026-06-01,Salary / Direct Deposit,0,5000,5000
2026-06-02,Swiggy Restaurant,15.50,0,-15.50
2026-06-03,Uber Ride,24.00,0,-24.00
2026-06-03,Netflix Subscription,14.99,0,-14.99
2026-06-04,Amazon Web Services,85.20,0,-85.20
2026-06-05,Whole Foods Market,120.50,0,-120.50
2026-06-06,Landlord Rent Payment,1500.00,0,-1500.00
2026-06-10,Starbucks Coffee,6.75,0,-6.75
2026-06-12,Gym Membership,45.00,0,-45.00
2026-06-15,Dividends Deposit,0,250,250
2026-06-18,Swiggy Restaurant,32.40,0,-32.40
2026-06-20,Uber Ride,18.50,0,-18.50
2026-06-21,Spotify Premium,9.99,0,-9.99
2026-06-22,ChatGPT Plus Subscription,20.00,0,-20.00
2026-06-23,Adobe Creative Cloud,54.99,0,-54.99
2026-06-24,Chevron Gas Station,45.00,0,-45.00
2026-06-25,Transfer from Savings,0,1000,1000
2026-06-26,Amazon.com Purchase,145.80,0,-145.80
2026-06-28,Swiggy Restaurant,42.10,0,-42.10
2026-06-29,Steam Games,29.99,0,-29.99
2026-06-30,Electric Utility Bill,112.40,0,-112.40`;

export const MOCK_ANALYSIS_RESULT = {
  healthScore: 78,
  summary: "Your financial profile shows solid stability due to high recurring income, yielding a net savings rate of 61%. However, non-essential spending is elevated: subscriptions consume $230.17/month, and frequent dining via Swiggy totals $89.80 across multiple micro-transactions. Restructuring SaaS tooling and curbing weekend food delivery could reclaim up to $185 monthly.",
  categories: [
    { name: "Housing", amount: 1500.00, percentage: 61.5, color: "#6366f1", count: 1 },
    { name: "Subscriptions & SaaS", amount: 230.17, percentage: 9.4, color: "#ec4899", count: 5 },
    { name: "Shopping", amount: 145.80, percentage: 6.0, color: "#8b5cf6", count: 1 },
    { name: "Groceries", amount: 120.50, percentage: 4.9, color: "#10b981", count: 1 },
    { name: "Utilities", amount: 112.40, percentage: 4.6, color: "#3b82f6", count: 1 },
    { name: "Dining & Drinks", amount: 96.75, percentage: 4.0, color: "#f59e0b", count: 4 },
    { name: "Transportation", amount: 87.50, percentage: 3.6, color: "#14b8a6", count: 3 },
    { name: "Fitness", amount: 45.00, percentage: 1.8, color: "#ef4444", count: 1 },
    { name: "Entertainment", amount: 29.99, percentage: 1.2, color: "#a855f7", count: 1 }
  ],
  subscriptions: [
    { name: "Netflix Subscription", amount: 14.99, frequency: "Monthly", type: "Entertainment", description: "Standard streaming package. Swap to ad-supported version or share plan." },
    { name: "Spotify Premium", amount: 9.99, frequency: "Monthly", type: "Entertainment", description: "Audio streaming. Consider family plan tier or ad-based tier." },
    { name: "ChatGPT Plus Subscription", amount: 20.00, frequency: "Monthly", type: "Productivity", description: "AI tool. Audit if developer API is cheaper or free tier suffices." },
    { name: "Adobe Creative Cloud", amount: 54.99, frequency: "Monthly", type: "Productivity", description: "Design suite. If inactive, negotiate a cheaper retention plan or pause." },
    { name: "Amazon Web Services", amount: 85.20, frequency: "Monthly", type: "Infrastructure", description: "Development server. Stop idle EC2 instances or switch to free tiers." },
    { name: "Gym Membership", amount: 45.00, frequency: "Monthly", type: "Fitness", description: "Local gym contract. Verify usage frequency is at least twice a week." }
  ],
  recommendations: [
    { category: "Subscriptions", priority: "High", title: "Consolidate Entertainment SaaS", amount: 24.98, action: "Cancel Spotify Premium or Netflix for a month, switching to rotation style." },
    { category: "Utilities", priority: "Medium", title: "Implement Smart Thermostat", amount: 25.00, action: "Optimize climate schedules. Reduces monthly heating/cooling costs by ~15%." },
    { category: "Dining", priority: "Medium", title: "Meal Prep & Delivery Cap", amount: 40.00, action: "Cap Swiggy orders to twice per month. Learn 3 simple 15-minute recipes." },
    { category: "SaaS Tools", priority: "Low", title: "Negotiate Adobe Rate", amount: 15.00, action: "Attempt cancellation screen to trigger promotional discount of 20-30%." }
  ],
  spendingPatterns: [
    { pattern: "Micro-Transaction Leakage", detail: "Frequent dining orders under $40 are accumulating rapidly, draining cash without notice." },
    { pattern: "Under-Optimized SaaS Stack", detail: "Subscriptions represent 9.4% of total expenditure. High relative to standard benchmarks." },
    { pattern: "Strong Income-to-Rent Ratio", detail: "Income ($6,250) easily covers Rent ($1,500), leaving ample room for discretionary savings." }
  ],
  duplicatePayments: [],
  unusualSpending: [
    { date: "2026-06-26", description: "Amazon.com Purchase", amount: 145.80, explanation: "Anomalously high shopping purchase. 3.2x higher than typical transaction size for this cycle." }
  ],
  cashFlow: {
    income: 6250.00,
    expenses: 2438.16,
    netSavings: 3811.84
  }
};
