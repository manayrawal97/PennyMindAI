import React, { useState } from 'react';
import { FiCheck, FiPlusCircle, FiCheckCircle } from 'react-icons/fi';

export default function SavingsSuggestions({ recommendations }) {
  const [implementedList, setImplementedList] = useState([]);

  const toggleImplemented = (idx) => {
    if (implementedList.includes(idx)) {
      setImplementedList(implementedList.filter(i => i !== idx));
    } else {
      setImplementedList([...implementedList, idx]);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(val);
  };

  // Calculate potential and achieved savings
  const totalPotentialSavings = recommendations.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalAchievedSavings = recommendations.reduce((sum, item, idx) => {
    if (implementedList.includes(idx)) {
      return sum + (item.amount || 0);
    }
    return sum;
  }, 0);

  const getPriorityStyle = (priority) => {
    const text = String(priority).toLowerCase();
    if (text === 'high') {
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30';
    }
    if (text === 'medium') {
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30';
  };

  return (
    <div className="space-y-6">
      
      {/* Target Reclaim Meter */}
      <div className="rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 p-6 text-white shadow-md shadow-brand-500/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold">Optimized Savings Advisor</h4>
            <p className="text-xs text-brand-100 mt-1 max-w-md">
              Check off recommendations to mark them as implemented. Track your progress in cutting unnecessary cash outflows.
            </p>
          </div>
          
          <div className="flex gap-6 items-center">
            <div className="text-center">
              <span className="text-[10px] text-brand-200 font-bold uppercase tracking-wider block">Potential</span>
              <span className="text-xl font-extrabold font-mono">{formatCurrency(totalPotentialSavings)}</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] text-brand-200 font-bold uppercase tracking-wider block">Reclaimed</span>
              <span className="text-xl font-extrabold font-mono text-emerald-300 flex items-center gap-1">
                {formatCurrency(totalAchievedSavings)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.length > 0 ? (
          recommendations.map((item, idx) => {
            const isDone = implementedList.includes(idx);
            return (
              <div
                key={idx}
                className={`relative rounded-2xl border bg-white p-5 dark:bg-gray-900 shadow-sm transition-all duration-300 ${
                  isDone 
                    ? 'border-emerald-200 bg-emerald-50/10 dark:border-emerald-950/20 opacity-70 scale-[0.99]' 
                    : 'border-gray-200 hover:border-brand-400 dark:border-gray-800 dark:hover:border-brand-500'
                }`}
              >
                
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-extrabold uppercase ${getPriorityStyle(item.priority)}`}>
                    {item.priority} Priority
                  </span>
                  
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                {/* Recommendation Title */}
                <h5 className="mt-3 text-sm font-bold text-gray-900 dark:text-white leading-snug">
                  {item.title}
                </h5>

                {/* Proposed Action */}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.action}
                </p>

                {/* Bottom Row */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 block uppercase tracking-wider">Est. Savings</span>
                    <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(item.amount)}</span>
                  </div>

                  <button
                    onClick={() => toggleImplemented(idx)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/40'
                        : 'border border-gray-200 hover:border-brand-500 text-gray-600 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300 dark:hover:text-brand-400'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <FiCheck className="h-4 w-4" />
                        <span>Implemented</span>
                      </>
                    ) : (
                      <>
                        <FiPlusCircle className="h-4 w-4" />
                        <span>Mark Done</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-400 col-span-2">No recommendations available.</p>
        )}
      </div>

    </div>
  );
}
