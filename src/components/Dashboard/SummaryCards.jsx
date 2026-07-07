import { FiTrendingUp, FiTrendingDown, FiHeart, FiPieChart, FiRepeat } from 'react-icons/fi';
import { FaIndianRupeeSign } from 'react-icons/fa6';

export default function SummaryCards({ cashFlow, healthScore, categories, subscriptions }) {
  
  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(val);
  };

  // Determine highest expense category
  const highestCategory = categories && categories.length > 0
    ? [...categories].sort((a, b) => b.amount - a.amount)[0]
    : { name: 'None', amount: 0 };

  // Calculate monthly subscriptions sum
  const subscriptionCost = subscriptions && subscriptions.length > 0
    ? subscriptions.reduce((sum, sub) => sum + sub.amount, 0)
    : 0;

  // Determine health score grade and text
  let healthGrade = 'C';
  let healthColor = 'text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30';
  let healthProgressColor = 'bg-amber-500';

  if (healthScore >= 90) {
    healthGrade = 'A+';
    healthColor = 'text-emerald-500 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900/30';
    healthProgressColor = 'bg-emerald-500';
  } else if (healthScore >= 80) {
    healthGrade = 'A';
    healthColor = 'text-teal-500 border-teal-200 bg-teal-50 dark:bg-teal-950/20 dark:border-teal-900/30';
    healthProgressColor = 'bg-teal-500';
  } else if (healthScore >= 70) {
    healthGrade = 'B';
    healthColor = 'text-indigo-500 border-indigo-200 bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-900/30';
    healthProgressColor = 'bg-indigo-500';
  } else if (healthScore >= 50) {
    healthGrade = 'D';
    healthColor = 'text-orange-500 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900/30';
    healthProgressColor = 'bg-orange-500';
  } else {
    healthGrade = 'F';
    healthColor = 'text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30';
    healthProgressColor = 'bg-red-500';
  }

  // Calculate savings percentage
  const savingsRate = cashFlow.income > 0 
    ? Math.max(0, Math.round((cashFlow.netSavings / cashFlow.income) * 100))
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Total Income */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Income</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <FiTrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-extrabold font-mono text-gray-900 dark:text-white">
            {formatCurrency(cashFlow.income)}
          </span>
          <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
            Accumulated monthly deposits
          </div>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Expenses</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <FiTrendingDown className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-extrabold font-mono text-gray-900 dark:text-white">
            {formatCurrency(cashFlow.expenses)}
          </span>
          <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
            Outflow and active withdrawals
          </div>
        </div>
      </div>

      {/* Savings & Savings Rate */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Net Savings</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            <FaIndianRupeeSign className="h-4.5 w-4.5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold font-mono text-gray-900 dark:text-white">
              {formatCurrency(cashFlow.netSavings)}
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-lg border border-emerald-100/50 dark:border-emerald-900/30">
              {savingsRate}% rate
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
            Cash retained inside statement
          </div>
        </div>
      </div>

      {/* Highest Expense Category */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Highest Category</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400">
            <FiPieChart className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-lg font-bold text-gray-900 dark:text-white truncate block">
            {highestCategory.name}
          </span>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 font-medium">
            <span>Spent: <strong className="font-mono text-gray-700 dark:text-gray-300">{formatCurrency(highestCategory.amount)}</strong></span>
            <span className="rounded bg-purple-50 dark:bg-purple-950/30 px-1 text-purple-700 dark:text-purple-400 font-bold">{Math.round(highestCategory.percentage)}% of limit</span>
          </div>
        </div>
      </div>

      {/* Subscription Load */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Subscription Burden</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400">
            <FiRepeat className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-extrabold font-mono text-gray-900 dark:text-white">
            {formatCurrency(subscriptionCost)}
          </span>
          <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
            Active cost across {subscriptions?.length || 0} sub-contracts
          </div>
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Financial Health</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
            <FiHeart className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3.5 flex items-center gap-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border text-base font-extrabold shadow-xs ${healthColor}`}>
            {healthGrade}
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
              <span>Score</span>
              <span className="font-mono">{healthScore}/100</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${healthProgressColor}`}
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
