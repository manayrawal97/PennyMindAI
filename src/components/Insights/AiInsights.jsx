import React from 'react';
import { FiTrendingDown, FiAlertTriangle, FiRepeat, FiBriefcase, FiZap, FiCopy } from 'react-icons/fi';

export default function AiInsights({ analysisResult }) {
  const {
    summary = 'Analysis complete.',
    spendingPatterns = [],
    unusualSpending = [],
    duplicatePayments = [],
    subscriptions = []
  } = analysisResult || {};

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(val);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Executive Summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🤖 AI Financial Summary
        </h4>
        <p className="mt-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {summary}
        </p>
      </div>

      {/* Grid of Anomalies and Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Spending Patterns */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <FiZap className="text-amber-500" /> Spending Patterns & Habits
          </h4>
          {spendingPatterns.length > 0 ? (
            <div className="space-y-4">
              {spendingPatterns.map((pat, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex h-2 w-2 rounded-full bg-brand-500 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">{pat.pattern}</h5>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{pat.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No core spending patterns flagged by AI.</p>
          )}
        </div>

        {/* Unusual Transactions */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <FiAlertTriangle className="text-red-500" /> Unusual Transactions (Anomalies)
          </h4>
          {unusualSpending.length > 0 ? (
            <div className="space-y-4">
              {unusualSpending.map((un, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 last:border-none last:pb-0">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 block">{un.date}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{un.description}</span>
                    <span className="text-xs text-amber-600 dark:text-amber-400 block mt-0.5">{un.explanation}</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-gray-900 dark:text-white">
                    {formatCurrency(un.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No anomalous spending detected in this billing cycle.</p>
          )}
        </div>

        {/* Duplicate Charge Detector */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <FiCopy className="text-blue-500" /> Duplicate Payment Alerts
          </h4>
          {duplicatePayments.length > 0 ? (
            <div className="space-y-4">
              {duplicatePayments.map((dup, idx) => (
                <div key={idx} className="rounded-xl border border-red-100 bg-red-50/30 p-3.5 dark:border-red-950/20 dark:bg-red-950/10 flex items-start justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-red-900 dark:text-red-300">Potential Duplicate Charge</h5>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                      Detected transaction of <span className="font-bold">{formatCurrency(dup.amount)}</span> for <span className="font-semibold">"{dup.description}"</span> on {dup.date}.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No duplicate payments detected. All charge iterations look distinct.</p>
          )}
        </div>

        {/* Subscriptions List Detail */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <FiRepeat className="text-pink-500" /> Subscription Contracts Audit
          </h4>
          {subscriptions.length > 0 ? (
            <div className="space-y-3.5">
              {subscriptions.map((sub, idx) => (
                <div key={idx} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3 last:border-none last:pb-0">
                  <div className="max-w-[70%]">
                    <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      {sub.name}
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400">
                        {sub.frequency}
                      </span>
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 block leading-relaxed">{sub.description}</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-pink-600 dark:text-pink-400">
                    {formatCurrency(sub.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No recurring billing patterns detected.</p>
          )}
        </div>

      </div>

    </div>
  );
}
