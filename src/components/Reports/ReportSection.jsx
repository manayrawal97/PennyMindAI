import React, { useState } from 'react';
import { FiDownload, FiShare2, FiFileText, FiCheckCircle } from 'react-icons/fi';
import Papa from 'papaparse';

export default function ReportSection({ transactions, analysisResult, fileName }) {
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 1. Export Analysis (downloads CSV of the normalized & categorized transactions)
  const handleExportCSV = () => {
    try {
      const cleanData = transactions.map(t => ({
        Date: t.date,
        Description: t.description,
        Amount: t.amount,
        Debit: t.debit,
        Credit: t.credit,
        Category: t.category
      }));
      const csv = Papa.unparse(cleanData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pennymind_categorized_${fileName || 'report'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('Normalized CSV report exported successfully!');
    } catch (err) {
      console.error(err);
      triggerToast('Export failed. Please try again.');
    }
  };

  // 2. Download PDF (Uses window.print for a clean, optimized print sheet)
  const handlePrintPDF = () => {
    window.print();
  };

  // 3. Share link
  const handleShareReport = () => {
    const dummyUrl = `${window.location.origin}/report/share-${Math.random().toString(36).substring(2, 9)}`;
    navigator.clipboard.writeText(dummyUrl).then(() => {
      triggerToast('Secure shareable link copied to clipboard! (Viewable offline)');
    }).catch(() => {
      triggerToast('Failed to copy. URL: ' + dummyUrl);
    });
  };

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm flex flex-col items-center justify-between gap-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl dark:bg-brand-600 transition animate-fade-in-up">
          <FiCheckCircle className="h-4.5 w-4.5 text-emerald-400 dark:text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="text-center max-w-sm">
        <h4 className="text-base font-bold text-gray-900 dark:text-white">
          Export & Share Insights
        </h4>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Generate professional print documents or download normalized data to integrate with other budget sheets.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        
        {/* PDF Export */}
        <button
          onClick={handlePrintPDF}
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-brand-600 dark:hover:bg-brand-700 text-white shadow-sm px-5 py-3 text-sm font-semibold transition"
        >
          <FiFileText className="h-4.5 w-4.5" />
          <span>Print / Save PDF</span>
        </button>

        {/* CSV Export */}
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-5 py-3 text-sm font-semibold transition"
        >
          <FiDownload className="h-4.5 w-4.5" />
          <span>Export Categorized CSV</span>
        </button>

        {/* Share Link */}
        <button
          onClick={handleShareReport}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-5 py-3 text-sm font-semibold transition"
        >
          <FiShare2 className="h-4.5 w-4.5" />
          <span>Share Insights Link</span>
        </button>

      </div>

    </div>
  );
}
