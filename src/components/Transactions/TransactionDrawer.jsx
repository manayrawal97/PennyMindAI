import { FiX, FiCheckCircle, FiInfo, FiTag, FiCalendar } from 'react-icons/fi';
import { FaIndianRupeeSign } from 'react-icons/fa6';

const CATEGORIES = [
  'Housing',
  'Dining & Drinks',
  'Groceries',
  'Subscriptions & SaaS',
  'Shopping',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Fitness',
  'Income',
  'Others'
];

export default function TransactionDrawer({ transaction, onClose, onUpdateCategory, analysisResult }) {
  if (!transaction) return null;

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(val);
  };

  // Find if this transaction fits in flagged categories (like unusual spending or duplicates)
  const isUnusual = analysisResult?.unusualSpending?.find(
    item => item.description.toLowerCase() === transaction.description.toLowerCase() || 
            (item.date === transaction.date && Math.abs(item.amount) === Math.abs(transaction.amount))
  );

  const isSubscription = analysisResult?.subscriptions?.find(
    sub => transaction.description.toLowerCase().includes(sub.name.toLowerCase()) || 
           sub.name.toLowerCase().includes(transaction.description.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Drawer Body */}
      <div className="relative h-full w-full max-w-md bg-white p-6 shadow-2xl dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 transition duration-300 flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiInfo className="text-brand-500" /> Transaction Details
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Amount Badge */}
          <div className="my-6 text-center">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Transaction Amount</span>
            <div className={`mt-1 text-3xl font-extrabold font-mono ${transaction.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
              {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
            </div>
          </div>

          {/* Core Info Fields */}
          <div className="space-y-4">
            
            {/* Description */}
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/40 p-3.5 border border-gray-200/30 dark:border-gray-700/25">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Description</label>
              <span className="mt-1 block font-semibold text-sm text-gray-900 dark:text-white">{transaction.description}</span>
            </div>

            {/* Date */}
            <div className="flex gap-4">
              <div className="flex-1 rounded-xl bg-gray-50 dark:bg-gray-800/40 p-3.5 border border-gray-200/30 dark:border-gray-700/25">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block flex items-center gap-1">
                  <FiCalendar /> Date
                </label>
                <span className="mt-1 block font-medium text-xs font-mono text-gray-900 dark:text-white">{transaction.date}</span>
              </div>
              <div className="flex-1 rounded-xl bg-gray-50 dark:bg-gray-800/40 p-3.5 border border-gray-200/30 dark:border-gray-700/25">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block flex items-center gap-1">
                  <FaIndianRupeeSign className="h-3.5 w-3.5" /> Type
                </label>
                <span className={`mt-1 block font-semibold text-xs uppercase ${transaction.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {transaction.amount > 0 ? 'Income' : 'Expense'}
                </span>
              </div>
            </div>

            {/* AI Insights Segment */}
            <div className="rounded-xl border border-dashed border-brand-200/80 bg-brand-50/20 dark:border-brand-900/40 dark:bg-brand-950/10 p-4">
              <label className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                🤖 AI Explanation & Context
              </label>

              {isUnusual ? (
                <div className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  ⚠️ <span className="font-bold">Flagged Expense:</span> {isUnusual.explanation}
                </div>
              ) : isSubscription ? (
                <div className="text-xs text-pink-700 dark:text-pink-400 font-medium leading-relaxed">
                  🔄 <span className="font-bold">Subscription Detected:</span> Recurring {isSubscription.frequency} payment of {formatCurrency(isSubscription.amount)}. {isSubscription.description}
                </div>
              ) : (
                <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  This transaction is categorized under <span className="font-semibold text-gray-950 dark:text-white">{transaction.category}</span>. 
                  {transaction.amount < 0 
                    ? ' It counts towards your discretionary spending limits.' 
                    : ' It counts towards your monthly recurring deposits.'
                  }
                </div>
              )}
            </div>

            {/* Category Editor */}
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/40 p-4 border border-gray-200/30 dark:border-gray-700/25">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block flex items-center gap-1 mb-2">
                <FiTag /> Change Category (Category Editor)
              </label>
              <select
                value={transaction.category}
                onChange={(e) => onUpdateCategory(transaction.id, e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Action Button at bottom */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-brand-600 dark:hover:bg-brand-700 text-white font-semibold py-3 text-sm transition"
          >
            <FiCheckCircle />
            <span>Apply & Close</span>
          </button>
        </div>

      </div>
    </div>
  );
}
