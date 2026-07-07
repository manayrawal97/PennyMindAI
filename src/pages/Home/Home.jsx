import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiFileText, FiTrash2, FiActivity, FiSearch, FiCheck, FiCpu, FiPlus, FiAlertCircle, FiZap, FiLock } from 'react-icons/fi';
import UploadArea from '../../components/Upload/UploadArea';
import TransactionsTable from '../../components/Transactions/TransactionsTable';
import TransactionDrawer from '../../components/Transactions/TransactionDrawer';
import SummaryCards from '../../components/Dashboard/SummaryCards';
import ChartsSection from '../../components/Charts/ChartsSection';
import AiInsights from '../../components/Insights/AiInsights';
import SavingsSuggestions from '../../components/Savings/SavingsSuggestions';
import ReportSection from '../../components/Reports/ReportSection';
import { parseCSV } from '../../utils/parser';
import { analyzeTransactionsWithGemini } from '../../services/gemini';
import { MOCK_ANALYSIS_RESULT } from '../../utils/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const PROGRESS_STEPS = [
  'Parsing transactions & dates...',
  'Normalizing deposit structures...',
  'Running AI category clustering...',
  'Detecting active subscriptions...',
  'Analyzing spending leakages...',
  'Compiling recommendations...'
];

export default function Home({ apiKey }) {
  const [stage, setStage] = useState('landing'); // 'landing' | 'preview' | 'analyzing' | 'dashboard'
  const [transactions, setTransactions] = useState([]);
  const [originalTransactions, setOriginalTransactions] = useState([]); // backup to reset filters
  const [fileName, setFileName] = useState('');
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Loader state
  const [progressIndex, setProgressIndex] = useState(0);

  // Drawer state
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // LocalStorage for Recent Analyses
  const [recentAnalyses, setRecentAnalyses] = useLocalStorage('pennymind_recent_analyses', []);

  // Demo mode selector state
  const [useDemoMode, setUseDemoMode] = useState(true);

  // Simulate loader transition while fetching
  useEffect(() => {
    let timer;
    if (stage === 'analyzing') {
      if (progressIndex < PROGRESS_STEPS.length - 1) {
        timer = setTimeout(() => {
          setProgressIndex(prev => prev + 1);
        }, 1200);
      }
    } else {
      setProgressIndex(0);
    }
    return () => clearTimeout(timer);
  }, [stage, progressIndex]);

  // Handle successful CSV load
  const handleUploadSuccess = async (csvText, name) => {
    try {
      setErrorMsg(null);
      const parsed = await parseCSV(csvText);
      setTransactions(parsed);
      setOriginalTransactions(parsed);
      setFileName(name);
      setStage('preview');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to parse CSV. Please check the file formatting.');
    }
  };

  const handleUploadError = (errText) => {
    setErrorMsg(errText);
  };

  // Run full analysis
  const runAnalysis = async () => {
    setStage('analyzing');
    setErrorMsg(null);

    try {
      let finalResult = null;
      
      if (useDemoMode) {
        // Simulate a minor network delay for demo immersion
        await new Promise(resolve => setTimeout(resolve, 6000));
        finalResult = MOCK_ANALYSIS_RESULT;
      } else {
        if (!apiKey) {
          throw new Error('Gemini API Key is missing. Configure it in the top settings bar or use Demo Mode.');
        }
        
        // Parallel fetch Gemini API while steps advance
        const apiPromise = analyzeTransactionsWithGemini(transactions, apiKey);
        
        // Wait at least 5 seconds to show loader, or wait for API to resolve
        const [result] = await Promise.all([
          apiPromise,
          new Promise(resolve => setTimeout(resolve, 5000))
        ]);
        
        finalResult = result;
      }

      setAnalysisResult(finalResult);
      
      // Save to recent reports in LocalStorage
      const newAnalysis = {
        id: `analysis-${Date.now()}`,
        fileName,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        transactionsCount: transactions.length,
        transactions,
        analysisResult: finalResult
      };
      
      setRecentAnalyses(prev => [newAnalysis, ...prev.slice(0, 4)]);
      setStage('dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gemini API call failed. Verify your network or check your API key.');
      setStage('preview');
    }
  };

  // Load a previously saved analysis
  const handleLoadRecent = (saved) => {
    setTransactions(saved.transactions);
    setOriginalTransactions(saved.transactions);
    setFileName(saved.fileName);
    setAnalysisResult(saved.analysisResult);
    setStage('dashboard');
  };

  // Delete a saved analysis
  const handleDeleteRecent = (e, id) => {
    e.stopPropagation();
    setRecentAnalyses(prev => prev.filter(item => item.id !== id));
  };

  // Drawer updating category - changes category and adjusts metrics on dashboard
  const handleUpdateCategory = (txId, newCategory) => {
    // 1. Update Category in transactions state
    const updatedTx = transactions.map(t => {
      if (t.id === txId) {
        return { ...t, category: newCategory };
      }
      return t;
    });
    setTransactions(updatedTx);
    setOriginalTransactions(updatedTx);

    // 2. Adjust selected transaction inside drawer to match change
    if (selectedTransaction && selectedTransaction.id === txId) {
      setSelectedTransaction(prev => ({ ...prev, category: newCategory }));
    }

    // 3. Recalculate categories sums dynamically in analysisResult
    if (analysisResult) {
      // Re-sum categories
      const categoryTotals = {};
      let totalExpense = 0;

      updatedTx.forEach(t => {
        if (t.amount < 0) {
          const amt = Math.abs(t.amount);
          categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
          totalExpense += amt;
        }
      });

      const updatedCategoriesList = Object.keys(categoryTotals).map(catName => {
        const amt = categoryTotals[catName];
        // Match existing category color if possible, or use standard
        const existingCat = analysisResult.categories.find(c => c.name === catName);
        const count = updatedTx.filter(t => t.category === catName).length;
        
        return {
          name: catName,
          amount: parseFloat(amt.toFixed(2)),
          percentage: totalExpense > 0 ? parseFloat(((amt / totalExpense) * 100).toFixed(1)) : 0,
          color: existingCat?.color || '#a855f7',
          count
        };
      });

      // Update analysis result details
      setAnalysisResult(prev => ({
        ...prev,
        categories: updatedCategoriesList
      }));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)] transition-colors duration-300">
      
      {/* ERROR MESSAGE ALERT */}
      {errorMsg && (
        <div className="mb-6 flex items-start gap-2.5 rounded-2xl bg-red-50 dark:bg-red-950/15 border border-red-200/50 dark:border-red-900/30 p-4 text-sm text-red-600 dark:text-red-400">
          <FiAlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div className="flex-grow">
            <span className="font-bold">Analysis Error: </span>
            {errorMsg}
          </div>
          <button 
            onClick={() => setErrorMsg(null)}
            className="text-xs font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. LANDING PAGE STAGE */}
      {stage === 'landing' && (
        <div className="space-y-16 py-8">
          
          {/* Hero Section */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
              <FiZap className="h-3.5 w-3.5" /> Client-Side AI Analysis
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl leading-none">
              Analyze your bank statement with{' '}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              Transform plain CSV transactions into an interactive, gorgeous dashboard showing savings options, subscription audits, and spending leaks.
            </p>

            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <FiLock />
              <span>100% In-Browser Privacy. No backend storage.</span>
            </div>
          </div>

          {/* Upload Area */}
          <div className="relative glass-panel rounded-3xl p-4 sm:p-8 border border-gray-200/50 dark:border-gray-800/50 shadow-lg max-w-3xl mx-auto">
            <UploadArea 
              onUploadSuccess={handleUploadSuccess} 
              onUploadError={handleUploadError} 
            />
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950/20 text-brand-500 flex items-center justify-center font-bold">1</div>
              <h4 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">Upload Statement</h4>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Drag-and-drop CSV export from Chase, Wells Fargo, Revolut, or any global financial institution.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center font-bold">2</div>
              <h4 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">AI Cluster Categorizer</h4>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Gemini groups and explains every transaction, detecting overlapping duplicate bills automatically.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-50 flex items-center justify-center font-bold">3</div>
              <h4 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">Discover Savings leaks</h4>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Extract actionable steps to cut underutilized subscriptions and dining patterns. Save hundreds.
              </p>
            </div>
          </div>

          {/* Recent Analyses (stored in LocalStorage) */}
          {recentAnalyses.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FiActivity className="text-brand-500" /> Recent Report Vault
              </h3>
              
              <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                {recentAnalyses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadRecent(item)}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                        <FiFileText />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block">
                          {item.fileName}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                          Analyzed {item.date} • {item.transactionsCount} rows
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Health Indicator Badge */}
                      <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 px-2.5 py-1 text-xs font-bold font-mono">
                        {item.analysisResult?.healthScore || '??'}/100 Score
                      </span>
                      
                      <button
                        onClick={(e) => handleDeleteRecent(e, item.id)}
                        title="Delete Report"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition"
                      >
                        <FiTrash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 2. PREVIEW TRANSACTIONS STAGE */}
      {stage === 'preview' && (
        <div className="space-y-8 animate-fade-in-up">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
            <div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block">Step 2 of 3</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Verify Transactions Preview
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Source File: <strong className="font-semibold text-gray-700 dark:text-gray-300">{fileName}</strong> • Loaded {transactions.length} rows
              </p>
            </div>

            {/* Analysis Options Sidebar Panel */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-gray-200/50 dark:border-gray-700/20 w-full md:w-auto">
              
              {/* Demo Mode Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <input
                  type="checkbox"
                  checked={useDemoMode}
                  onChange={(e) => setUseDemoMode(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900"
                />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  ⚡ Demo Mode (No API key required)
                </span>
              </label>

              <button
                onClick={runAnalysis}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-md shadow-brand-500/10 px-5 py-3 text-sm font-semibold transition"
              >
                <FiCpu className="h-4.5 w-4.5" />
                <span>Run AI Spend Analysis</span>
              </button>
            </div>
          </div>

          {/* Transactions Preview Table */}
          <TransactionsTable 
            transactions={transactions} 
            onTransactionClick={(tx) => setSelectedTransaction(tx)} 
          />

          <div className="flex justify-start">
            <button
              onClick={() => setStage('landing')}
              className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:underline transition"
            >
              &larr; Upload a different file
            </button>
          </div>

        </div>
      )}

      {/* 3. AI ANALYZING PROGRESS STAGE */}
      {stage === 'analyzing' && (
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center space-y-8 py-16">
          
          <div className="relative flex h-24 w-24 items-center justify-center">
            {/* Spinning gradient ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-800" />
            <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
            <FiCpu className="h-8 w-8 text-brand-500 animate-pulse-slow" />
          </div>

          <div className="space-y-3 max-w-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              🤖 PennyMind AI is analyzing statements
            </h3>
            
            <p className="text-sm text-brand-600 dark:text-brand-400 font-bold transition-all duration-300">
              {PROGRESS_STEPS[progressIndex]}
            </p>

            <div className="h-1.5 w-64 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto overflow-hidden">
              <div 
                className="h-full bg-brand-500 rounded-full transition-all duration-1200"
                style={{ width: `${((progressIndex + 1) / PROGRESS_STEPS.length) * 100}%` }}
              />
            </div>

            <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
              We extract spending anomalies, identify duplicate merchant bills, and outline optimization checklists locally.
            </p>
          </div>

        </div>
      )}

      {/* 4. FINANCIAL DASHBOARD STAGE */}
      {stage === 'dashboard' && (
        <div className="space-y-12 animate-fade-in-up print:space-y-6 print:py-0">
          
          {/* Dashboard Header - hidden during print */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5 print:hidden">
            <div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block">Analysis Complete</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                PennyMind Financial Dashboard <FiZap className="text-amber-400 h-5 w-5" />
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Active Report: <strong className="font-semibold text-gray-700 dark:text-gray-300">{fileName}</strong> • Computed locally
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setStage('preview')}
                className="rounded-xl border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4.5 py-2.5 text-xs font-bold transition"
              >
                Back to Preview
              </button>
              
              <button
                onClick={() => setStage('landing')}
                className="rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-brand-600 dark:hover:bg-brand-700 text-white px-4.5 py-2.5 text-xs font-bold transition"
              >
                Upload New Statement
              </button>
            </div>
          </div>

          {/* PRINT-ONLY HEADER */}
          <div className="hidden print:block text-center border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold text-black">PennyMind AI Statement Audit Report</h1>
            <p className="text-xs text-gray-600 mt-1">Source File: {fileName} | Generated on {new Date().toLocaleDateString('en-IN')}</p>
          </div>

          {/* 1. Summary Cards Panel */}
          <SummaryCards 
            cashFlow={analysisResult?.cashFlow || { income: 0, expenses: 0, netSavings: 0 }}
            healthScore={analysisResult?.healthScore || 0}
            categories={analysisResult?.categories || []}
            subscriptions={analysisResult?.subscriptions || []}
          />

          {/* 2. Charts Section */}
          <div className="print:break-inside-avoid">
            <ChartsSection 
              categories={analysisResult?.categories || []}
              transactions={transactions}
              subscriptions={analysisResult?.subscriptions || []}
            />
          </div>

          {/* 3. AI Insights Panel */}
          <div className="print:break-inside-avoid">
            <AiInsights analysisResult={analysisResult} />
          </div>

          {/* 4. Savings Recommendations */}
          <div className="print:break-inside-avoid">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Actionable Savings Recommendations
            </h3>
            <SavingsSuggestions recommendations={analysisResult?.recommendations || []} />
          </div>

          {/* 5. Transactions List Header & Table */}
          <div className="space-y-4 print:break-inside-avoid">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Parsed & Categorized Statements
            </h3>
            <TransactionsTable 
              transactions={transactions} 
              onTransactionClick={(tx) => setSelectedTransaction(tx)} 
            />
          </div>

          {/* 6. Print and Export Footer Action */}
          <div className="print:hidden">
            <ReportSection 
              transactions={transactions}
              analysisResult={analysisResult}
              fileName={fileName}
            />
          </div>

        </div>
      )}

      {/* TRANSACTION DETAILS SIDE DRAWER */}
      {selectedTransaction && (
        <TransactionDrawer
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onUpdateCategory={handleUpdateCategory}
          analysisResult={analysisResult}
        />
      )}

    </div>
  );
}
