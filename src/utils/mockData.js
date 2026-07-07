export const MOCK_CSV_TEXT = `Date,Description,Debit,Credit,Amount
2026-06-01,Salary / Direct Deposit,0,150000,150000
2026-06-02,Swiggy Restaurant,950,0,-950
2026-06-03,Uber Ride,750,0,-750
2026-06-03,Netflix Subscription,649,0,-649
2026-06-04,Amazon Web Services,7100,0,-7100
2026-06-05,Reliance Smart,9800,0,-9800
2026-06-06,Landlord Rent Payment,45000,0,-45000
2026-06-10,Starbucks Coffee,450,0,-450
2026-06-12,Gym Membership,2500,0,-2500
2026-06-15,Dividends Deposit,0,7500,7500
2026-06-18,Swiggy Restaurant,1800,0,-1800
2026-06-20,Uber Ride,600,0,-600
2026-06-21,Spotify Premium,119,0,-119
2026-06-22,ChatGPT Plus Subscription,1999,0,-1999
2026-06-23,Adobe Creative Cloud,4630,0,-4630
2026-06-24,Indian Oil Petrol Pump,3500,0,-3500
2026-06-25,Transfer from Savings,0,30000,30000
2026-06-26,Amazon.in Purchase,12000,0,-12000
2026-06-28,Swiggy Restaurant,2500,0,-2500
2026-06-29,Steam Games,2499,0,-2499
2026-06-30,BESCOM Electricity Bill,5400,0,-5400`;

export const MOCK_ANALYSIS_RESULT = {
  healthScore: 78,
  summary: "Your financial profile shows solid stability due to high recurring income, yielding a net savings rate of 45%. However, non-essential spending is elevated: subscriptions consume ₹16,997/month, and frequent dining via Swiggy totals ₹5,250 across multiple micro-transactions. Restructuring SaaS tooling and curbing weekend food delivery could reclaim up to ₹8,500 monthly.",
  categories: [
    { name: "Housing", amount: 45000.00, percentage: 44.0, color: "#6366f1", count: 1 },
    { name: "Subscriptions & SaaS", amount: 14497.00, percentage: 14.2, color: "#ec4899", count: 5 },
    { name: "Shopping", amount: 12000.00, percentage: 11.7, color: "#8b5cf6", count: 1 },
    { name: "Groceries", amount: 9800.00, percentage: 9.6, color: "#10b981", count: 1 },
    { name: "Utilities", amount: 5400.00, percentage: 5.3, color: "#3b82f6", count: 1 },
    { name: "Dining & Drinks", amount: 5700.00, percentage: 5.6, color: "#f59e0b", count: 4 },
    { name: "Transportation", amount: 4850.00, percentage: 4.7, color: "#14b8a6", count: 3 },
    { name: "Fitness", amount: 2500.00, percentage: 2.4, color: "#ef4444", count: 1 },
    { name: "Entertainment", amount: 2499.00, percentage: 2.5, color: "#a855f7", count: 1 }
  ],
  subscriptions: [
    { name: "Netflix Subscription", amount: 649.00, frequency: "Monthly", type: "Entertainment", description: "Standard premium streaming package. Swap to mobile-only version or share plan." },
    { name: "Spotify Premium", amount: 119.00, frequency: "Monthly", type: "Entertainment", description: "Audio streaming. Consider family plan tier or ad-based tier." },
    { name: "ChatGPT Plus Subscription", amount: 1999.00, frequency: "Monthly", type: "Productivity", description: "AI tool. Audit if developer API is cheaper or free tier suffices." },
    { name: "Adobe Creative Cloud", amount: 4630.00, frequency: "Monthly", type: "Productivity", description: "Design suite. If inactive, negotiate a cheaper retention plan or pause." },
    { name: "Amazon Web Services", amount: 7100.00, frequency: "Monthly", type: "Infrastructure", description: "Development server. Stop idle EC2 instances or switch to free tiers." },
    { name: "Gym Membership", amount: 2500.00, frequency: "Monthly", type: "Fitness", description: "Local gym contract. Verify usage frequency is at least twice a week." }
  ],
  recommendations: [
    { category: "Subscriptions", priority: "High", title: "Consolidate Entertainment SaaS", amount: 768.00, action: "Cancel Spotify Premium or Netflix for a month, switching to rotation style." },
    { category: "Utilities", priority: "Medium", title: "Optimize Power Usage", amount: 1500.00, action: "Set AC to 24°C and optimize geyser timings. Reduces monthly power costs by ~15%." },
    { category: "Dining", priority: "Medium", title: "Meal Prep & Delivery Cap", amount: 3500.00, action: "Cap Swiggy orders to twice per month. Learn 3 simple 15-minute home recipes." },
    { category: "SaaS Tools", priority: "Low", title: "Negotiate Adobe Rate", amount: 1200.00, action: "Attempt cancellation screen to trigger promotional discount of 20-30%." }
  ],
  spendingPatterns: [
    { pattern: "Micro-Transaction Leakage", detail: "Frequent dining orders under ₹1,500 are accumulating rapidly, draining cash without notice." },
    { pattern: "Under-Optimized SaaS Stack", detail: "Subscriptions represent 14.2% of total expenditure. High relative to standard benchmarks." },
    { pattern: "Strong Income-to-Rent Ratio", detail: "Income (₹1,50,000) easily covers Rent (₹45,000), leaving ample room for discretionary savings." }
  ],
  duplicatePayments: [],
  unusualSpending: [
    { date: "2026-06-26", description: "Amazon.in Purchase", amount: 12000.00, explanation: "Anomalously high shopping purchase. 3.2x higher than typical transaction size for this cycle." }
  ],
  cashFlow: {
    income: 187500.00,
    expenses: 102246.00,
    netSavings: 85254.00
  }
};
