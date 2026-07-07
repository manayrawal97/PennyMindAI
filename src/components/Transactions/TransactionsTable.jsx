import React, { useState, useMemo } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiFilter, FiTrendingDown, FiTrendingUp } from 'react-icons/fi';

export default function TransactionsTable({ transactions, onTransactionClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract all unique categories for the filter
  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return ['All', ...Array.from(cats)].filter(Boolean);
  }, [transactions]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to descending
    }
    setCurrentPage(1);
  };

  // Filter and search logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchTerm, selectedCategory]);

  // Sorted list
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions];
    sorted.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'date') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredTransactions, sortField, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedTransactions.slice(start, start + itemsPerPage);
  }, [sortedTransactions, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(val);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transition duration-300">
      
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 p-5 border-b border-gray-200 dark:border-gray-800">
        
        {/* Search */}
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative flex-shrink-0 flex items-center gap-2">
          <FiFilter className="text-gray-400 h-4.5 w-4.5" />
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/40 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none">
              <th onClick={() => handleSort('date')} className="cursor-pointer py-4 px-6 hover:text-gray-900 dark:hover:text-white transition">
                Date {sortField === 'date' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('description')} className="cursor-pointer py-4 px-6 hover:text-gray-900 dark:hover:text-white transition">
                Description {sortField === 'description' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('category')} className="cursor-pointer py-4 px-6 hover:text-gray-900 dark:hover:text-white transition">
                Category {sortField === 'category' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th className="py-4 px-6 text-right">Debit</th>
              <th className="py-4 px-6 text-right">Credit</th>
              <th onClick={() => handleSort('amount')} className="cursor-pointer py-4 px-6 text-right hover:text-gray-900 dark:hover:text-white transition">
                Amount {sortField === 'amount' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => onTransactionClick(tx)}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 cursor-pointer transition"
                >
                  <td className="py-4 px-6 whitespace-nowrap font-medium font-mono text-xs">{tx.date}</td>
                  <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white max-w-xs truncate">{tx.description}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-gray-500 font-mono text-xs">
                    {tx.debit > 0 ? formatCurrency(tx.debit) : '—'}
                  </td>
                  <td className="py-4 px-6 text-right text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                    {tx.credit > 0 ? formatCurrency(tx.credit) : '—'}
                  </td>
                  <td className={`py-4 px-6 text-right font-bold font-mono text-xs ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-500 dark:text-gray-400 font-medium">
                  No transactions match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-gray-200 dark:border-gray-800">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Showing <span className="font-semibold">{Math.min(sortedTransactions.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
          <span className="font-semibold">{Math.min(sortedTransactions.length, currentPage * itemsPerPage)}</span> of{' '}
          <span className="font-semibold">{sortedTransactions.length}</span> transactions
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition text-gray-600 dark:text-gray-300"
          >
            <FiChevronLeft className="h-4.5 w-4.5" />
          </button>
          
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition text-gray-600 dark:text-gray-300"
          >
            <FiChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
