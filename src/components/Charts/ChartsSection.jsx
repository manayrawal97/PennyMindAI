import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, LineChart, Line
} from 'recharts';
import { useResolvedTheme } from '../../hooks/useResolvedTheme';

export default function ChartsSection({ categories, transactions, subscriptions }) {
  const isDark = useResolvedTheme() === 'dark';
  const gridColor = isDark ? '#1f2937' : '#f3f4f6';
  const textColor = isDark ? '#9ca3af' : '#4b5563';
  
  // 1. Prepare Category Data for Pie & Bar Charts
  const categoryChartData = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return categories
      .filter(cat => cat.amount > 0 && cat.name !== 'Income')
      .map(cat => ({
        name: cat.name,
        value: parseFloat(cat.amount.toFixed(2)),
        color: cat.color || '#3b82f6'
      }))
      .sort((a, b) => b.value - a.value);
  }, [categories]);

  // 2. Prepare Cash Flow Data (Income vs Expense cumulative over transaction date)
  const cashFlowChartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    
    // Group transactions by date
    const dateMap = {};
    transactions.forEach(tx => {
      const date = tx.date;
      if (!dateMap[date]) {
        dateMap[date] = { income: 0, expense: 0 };
      }
      if (tx.amount > 0) {
        dateMap[date].income += tx.amount;
      } else {
        dateMap[date].expense += Math.abs(tx.amount);
      }
    });

    // Sort dates
    const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b));

    let cumulativeIncome = 0;
    let cumulativeExpense = 0;

    return sortedDates.map(date => {
      cumulativeIncome += dateMap[date].income;
      cumulativeExpense += dateMap[date].expense;
      return {
        date: date.substring(5), // Show MM-DD for cleaner fit
        Income: parseFloat(cumulativeIncome.toFixed(2)),
        Expenses: parseFloat(cumulativeExpense.toFixed(2))
      };
    });
  }, [transactions]);

  // 3. Prepare Subscriptions Data for Donut Chart
  const subscriptionChartData = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) return [];
    const colors = ['#ec4899', '#f43f5e', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6'];
    return subscriptions.map((sub, idx) => ({
      name: sub.name,
      value: sub.amount,
      color: colors[idx % colors.length]
    }));
  }, [subscriptions]);

  const formatYAxis = (tick) => {
    if (tick >= 100000) {
      return `₹${(tick / 100000).toFixed(1)}L`;
    }
    if (tick >= 1000) {
      return `₹${(tick / 1000).toFixed(0)}k`;
    }
    return `₹${tick}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* 1. Expense Breakdown (Pie Chart) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm flex flex-col justify-between">
        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Expense Categories
        </h4>
        <div className="h-72 w-full">
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${new Intl.NumberFormat('en-IN').format(value)}`, 'Amount Spent']} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No expenditures to represent.
            </div>
          )}
        </div>
      </div>

      {/* 2. Cumulative Cash Flow (Area Chart) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Cumulative Cash Flow
        </h4>
        <div className="h-72 w-full">
          {cashFlowChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="date" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} tickFormatter={formatYAxis} />
                <Tooltip formatter={(value) => [`₹${new Intl.NumberFormat('en-IN').format(value)}`]} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Insufficient transaction dates to display chart.
            </div>
          )}
        </div>
      </div>

      {/* 3. Category Comparison (Bar Chart) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Category Comparison
        </h4>
        <div className="h-72 w-full">
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" stroke={textColor} fontSize={10} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} tickFormatter={formatYAxis} />
                <Tooltip formatter={(value) => [`₹${new Intl.NumberFormat('en-IN').format(value)}`, 'Spent']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No expenditures to compare.
            </div>
          )}
        </div>
      </div>

      {/* 4. Subscriptions Load (Donut Chart) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm flex flex-col justify-between">
        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Active Subscription Allocations
        </h4>
        <div className="h-72 w-full">
          {subscriptionChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {subscriptionChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${new Intl.NumberFormat('en-IN').format(value)}`, 'Monthly Cost']} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No active recurring subscriptions detected.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
