import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowRight, FiMenu, FiX, FiCheck, FiChevronDown, FiChevronUp,
  FiZap, FiCpu, FiPieChart, FiRepeat, FiFileText, FiShield, FiTrendingUp, 
  FiActivity, FiLayers, FiLinkedin, FiMail, FiSun, FiMoon, FiMonitor,
  FiAward, FiBriefcase, FiDatabase
} from 'react-icons/fi';

// Hook to animate counters when visible
function AnimatedCounter({ value, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value.toString().replace(/,/g, ''));
    if (isNaN(end)) return;
    
    const totalMiliseconds = duration * 1000;
    const incrementTime = 50;
    const totalSteps = totalMiliseconds / incrementTime;
    const stepValue = end / totalSteps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  const formatted = count.toLocaleString('en-US');
  return <span>{formatted}{suffix}</span>;
}

export default function Landing({ theme, setTheme }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Monitor scroll for sticky navbar blur effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const faqData = [
    {
      q: "How does PennyMind AI analyze statements?",
      a: "PennyMind AI parses your exported bank CSV file entirely in your browser. The transaction descriptions and amounts are then analyzed securely using Google Gemini API to extract subcategories, detect recurring subscriptions, and flag unusual behaviors."
    },
    {
      q: "Is my personal financial data safe?",
      a: "Absolutely. PennyMind AI works 100% on the client side. We do not maintain any backend database or servers, meaning your financial statements never leave your device. The upload is kept inside sandbox browser memory and synced to LocalStorage locally."
    },
    {
      q: "Which banks are supported?",
      a: "We support standard CSV statement formats from Chase, Bank of America, Wells Fargo, Revolut, HSBC, and most global banking institutions. If headers differ, our parser automatically detects Date, Description, and Amount fields."
    },
    {
      q: "Do I need a Gemini API Key to use the app?",
      a: "No! By default, the application runs in a simulated Demo Mode. If you want real AI analytics on your actual statement files, you can insert your personal Gemini API key under the dashboard settings tab."
    }
  ];

  // Theme Toggler Component
  const themeToggler = (
    <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200/50 dark:border-slate-800/50">
      <button
        onClick={() => setTheme('light')}
        title="Light Mode"
        className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-850 text-sky-500 shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
      >
        <FiSun className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        title="Dark Mode"
        className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-800 text-sky-400 shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
      >
        <FiMoon className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        title="System Default"
        className={`p-1.5 rounded-lg transition-all ${theme === 'system' ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
      >
        <FiMonitor className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-sans transition-colors duration-300">
      
      {/* 1. Sticky Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white shadow-md shadow-sky-500/20">
              <FiTrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              PennyMind<span className="bg-gradient-to-r from-sky-500 to-teal-400 bg-clip-text text-transparent">AI</span>
            </span>
          </div>

          {/* Desktop Nav Links (Specified Order with Toggler) */}
          <nav className="hidden lg:flex items-center space-x-6">
            <a href="#about" className="text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-sky-500 dark:hover:text-sky-400 transition">About</a>
            <a href="#features" className="text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-sky-500 dark:hover:text-sky-400 transition">Features</a>
            <a href="#team" className="text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-sky-500 dark:hover:text-sky-400 transition">Team</a>
            <a href="#industries" className="text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-sky-500 dark:hover:text-sky-400 transition">Industries</a>
            <a href="#contact" className="text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-sky-500 dark:hover:text-sky-400 transition">Contact</a>
            
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            {themeToggler}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

            <Link 
              to="/login"
              className="text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-sky-500 dark:hover:text-sky-400 transition"
            >
              Live Demo
            </Link>
            <Link 
              to="/login"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white shadow-md shadow-sky-500/10 px-5 py-2.5 text-sm font-bold transition"
            >
              <span>Sign In</span>
              <FiArrowRight />
            </Link>
          </nav>

          {/* Hamburger Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            {themeToggler}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-6 space-y-4"
            >
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-300 hover:text-sky-500">About</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-300 hover:text-sky-500">Features</a>
              <a href="#team" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-300 hover:text-sky-500">Team</a>
              <a href="#industries" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-300 hover:text-sky-500">Industries</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-300 hover:text-sky-500">Contact</a>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Live Demo
                </Link>
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 text-white text-sm font-semibold"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <FiZap className="h-3.5 w-3.5 animate-pulse" /> Client-Side Privacy First
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-tight">
              Understand Your <br /> Spending with{' '}
              <span className="bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Transform confusing raw bank statements into an interactive, gorgeous dashboard showing savings options, subscription audits, and spending leakages. No upload to remote servers required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-600 text-white dark:text-slate-950 px-8 py-4 font-bold shadow-md shadow-sky-500/10 transition"
              >
                <span>Analyze Your Expenses</span>
                <FiArrowRight />
              </Link>
              <Link 
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 px-8 py-4 font-semibold transition"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="w-full max-w-md bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-sky-500/20 text-sky-500 flex items-center justify-center font-bold">
                    <FiTrendingUp />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Current Health</span>
                    <span className="text-[10px] text-slate-400 block">Statement cycle audited</span>
                  </div>
                </div>
                <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 text-xs font-extrabold text-emerald-500 border border-emerald-500/20">
                  84% Rating
                </span>
              </div>

              <div className="py-6 flex items-end justify-between h-36 gap-2">
                <div className="h-12 w-full rounded-md bg-sky-500/25 dark:bg-sky-500/10 hover:bg-sky-500/40 transition duration-300" />
                <div className="h-20 w-full rounded-md bg-sky-500/40 dark:bg-sky-500/20 hover:bg-sky-500/50 transition duration-300" />
                <div className="h-28 w-full rounded-md bg-sky-500/60 dark:bg-sky-500/30 hover:bg-sky-500/70 transition duration-300" />
                <div className="h-16 w-full rounded-md bg-sky-500/35 dark:bg-sky-500/15 hover:bg-sky-500/40 transition duration-300" />
                <div className="h-24 w-full rounded-md bg-teal-500/50 dark:bg-teal-500/25 hover:bg-teal-500/60 transition duration-300" />
              </div>

              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-slate-900 text-white dark:bg-slate-950 rounded-2xl p-4 shadow-xl border border-slate-800"
              >
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">Unusual Spending</span>
                <span className="text-sm font-extrabold font-mono block mt-1">AWS Cloud: +₹7,100</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">3.2x higher than typical</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl p-4 shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-500">
                  <FiCheck />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Subscription Audit</span>
                  <span className="text-xs font-bold block">6 Contracts Flagged</span>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Trusted Statistics */}
      <section id="about" className="py-12 bg-white dark:bg-slate-900/50 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-500 font-mono">
                <AnimatedCounter value="1250000" suffix="+" />
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Transactions Audited</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-mono">
                <AnimatedCounter value="45000" suffix="+" />
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Reports Generated</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-500 font-mono">
                <AnimatedCounter value="99.4" suffix="%" />
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">AI Accuracy Rating</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                <AnimatedCounter value="320" suffix=" /mo" />
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Average User Savings</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-sky-500 uppercase tracking-widest block">Intelligent Suite</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Engineered for Complete Financial Transparency
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Ditch complicated spreadsheets. PennyMind AI brings together direct browser analytics and context-aware insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-sky-400/50 dark:hover:border-sky-500/30 transition duration-300">
              <div className="h-10 w-10 rounded-lg bg-sky-50 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center">
                <FiCpu className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">AI Expense Categorization</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Gemini reviews descriptions to classify bills into precise categories, skipping standard rigid keyword matching.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-sky-400/50 dark:hover:border-sky-500/30 transition duration-300">
              <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-950/20 text-teal-500 flex items-center justify-center">
                <FiTrendingUp className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Financial Health Rating</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Generate a dynamic personal financial health rating from 0-100 calculated from savings ratios and sub costs.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-sky-400/50 dark:hover:border-sky-500/30 transition duration-300">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center">
                <FiRepeat className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Subscription Auto-Detection</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Find hidden SaaS and digital media subscription contracts that drain cash flow monthly.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-sky-400/50 dark:hover:border-sky-500/30 transition duration-300">
              <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center">
                <FiLayers className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Duplicate Charge Warnings</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Flags overlapping double bills with matching amounts and merchants close in proximity.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-sky-400/50 dark:hover:border-sky-500/30 transition duration-300">
              <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950/20 text-purple-500 flex items-center justify-center">
                <FiPieChart className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Responsive Visual Charts</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Explore cash flow trajectories, daily balances, and category breakouts using responsive visual containers.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-sky-400/50 dark:hover:border-sky-500/30 transition duration-300">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center">
                <FiFileText className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Exportable PDF & CSV Statements</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Print optimized full reports to share, or download your normalized categorized transaction list as a CSV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-sky-500 uppercase tracking-widest block">Audit Workflow</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              From Statement to Savings in Four Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-sky-500 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-sky-500/20">1</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Upload Statement</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Export and drop your institution's bank statement CSV locally. Only parsed in-memory.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-teal-500/20">2</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">AI Analysis</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Gemini classifies your transactions, filters out deposits, and scans billing patterns.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">3</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Financial Dashboard</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Analyze clean, responsive interactive charts and breakdowns of spending categories.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">4</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Savings Recommendations</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Mark suggestions implemented, reclaiming cash flow with direct, actionable checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Dashboard Preview Section */}
      <section id="preview" className="py-24 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-sky-500 uppercase tracking-widest block">Product Interface</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Clean. Modern. Fast.
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Take control of your banking statements using our intuitive UI.
            </p>
          </div>

          <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
            <div className="h-12 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900 px-4 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider">pennymind.ai/dashboard</span>
              <div className="w-8" />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                  <span className="text-[10px] font-bold text-slate-400 block">RECURRING INFLOW</span>
                  <span className="text-xl font-bold font-mono block mt-1 text-emerald-500">+₹1,87,500.00</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                  <span className="text-[10px] font-bold text-slate-400 block">TOTAL DEBITS</span>
                  <span className="text-xl font-bold font-mono block mt-1 text-slate-900 dark:text-white">-₹1,02,246.00</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                  <span className="text-[10px] font-bold text-slate-400 block">NET SAVINGS</span>
                  <span className="text-xl font-bold font-mono block mt-1 text-sky-500">+₹85,254.00</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/30 overflow-hidden">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold tracking-wider text-slate-400">
                  STATEMENT CHRONOLOGY PREVIEW
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-850 text-xs px-4">
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold">Swiggy Restaurant</span>
                    <span className="font-mono text-slate-400">-₹950.00</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold">Netflix Subscription</span>
                    <span className="font-mono text-pink-500">-₹649.00</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold">Reliance Smart</span>
                    <span className="font-mono text-slate-400">-₹9,800.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Meet Our Team Section (New Request) */}
      <section id="team" className="py-24 bg-white dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-sky-500 uppercase tracking-widest block">Executive Officers</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Leading the revolution of client-side financial analytics and AI data tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Zahir Khan */}
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 p-6 shadow-sm hover:shadow-lg transition-all duration-355 flex flex-col justify-between items-center text-center space-y-4"
            >
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-2xl shadow-md">
                  ZK
                </div>
                <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" title="Active CEO" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Zahir Khan</h4>
                <span className="text-xs text-sky-500 font-semibold uppercase tracking-wider block mt-1">Founder & CEO</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                Visionary entrepreneur with a decade of fintech and AI scaling leadership, driving PennyMind's strategy and product vision.
              </p>
              <div className="flex gap-4 pt-2 text-slate-400 dark:text-slate-600">
                <a href="#linkedin" className="hover:text-sky-500 transition"><FiLinkedin className="h-5 w-5" /></a>
                <a href="mailto:zahir@pennymind.ai" className="hover:text-sky-500 transition"><FiMail className="h-5 w-5" /></a>
              </div>
            </motion.div>

            {/* Card 2: Kunal Bhardwaj */}
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 p-6 shadow-sm hover:shadow-lg transition-all duration-355 flex flex-col justify-between items-center text-center space-y-4"
            >
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-teal-400 to-sky-600 flex items-center justify-center font-bold text-slate-900 text-2xl shadow-md">
                  KB
                </div>
                <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" title="Active CTO" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Kunal Bhardwaj</h4>
                <span className="text-xs text-teal-500 font-semibold uppercase tracking-wider block mt-1">Co-Founder & CTO</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                Expert system architect and AI integration engineer, pioneering in-browser privacy-preserving computation pipelines.
              </p>
              <div className="flex gap-4 pt-2 text-slate-400 dark:text-slate-600">
                <a href="#linkedin" className="hover:text-teal-500 transition"><FiLinkedin className="h-5 w-5" /></a>
                <a href="mailto:kunal@pennymind.ai" className="hover:text-teal-500 transition"><FiMail className="h-5 w-5" /></a>
              </div>
            </motion.div>

            {/* Card 3: Prathmesh Jain */}
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 p-6 shadow-sm hover:shadow-lg transition-all duration-355 flex flex-col justify-between items-center text-center space-y-4 md:col-span-2 lg:col-span-1 md:max-w-md md:mx-auto lg:max-w-none"
            >
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-2xl shadow-md">
                  PJ
                </div>
                <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" title="Active COO" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Prathmesh Jain</h4>
                <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wider block mt-1">Head of Operations</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                Multi-disciplinary specialist optimizing client workflows, bank integrations, and operational compliance.
              </p>
              <div className="flex gap-4 pt-2 text-slate-400 dark:text-slate-600">
                <a href="#linkedin" className="hover:text-indigo-500 transition"><FiLinkedin className="h-5 w-5" /></a>
                <a href="mailto:prathmesh@pennymind.ai" className="hover:text-indigo-500 transition"><FiMail className="h-5 w-5" /></a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries Section (New Anchor) */}
      <section id="industries" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-sky-500 uppercase tracking-widest block">Tailored Solutions</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Supported Industries
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              PennyMind AI fits the operational and safety demands of modern professions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-sky-100 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center font-bold">
                  <FiBriefcase />
                </div>
                <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">CPAs & Accounting</h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Bulk parse banking CSV statements client-side. Zero server database storage guarantees compliance with data privacy regulations.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-teal-100 dark:bg-teal-950/20 text-teal-500 flex items-center justify-center font-bold">
                  <FiLayers />
                </div>
                <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">SaaS & Tech Startups</h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Audit cloud infrastructure, server capacities, and third-party SaaS tooling. Identify double-billing overlaps instantly.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center font-bold">
                  <FiDatabase />
                </div>
                <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Freelancers & Solopreneurs</h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Easily separate personal expenditures from business investments in a few clicks. Export optimized reports for quarterly filing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-sky-500 uppercase tracking-widest block">Feedback</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              What Finance Professionals Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center font-bold text-sky-600">SH</div>
                <div>
                  <span className="text-sm font-bold block text-slate-900 dark:text-white">Sarah Jenkins</span>
                  <span className="text-[10px] text-slate-400 block">Freelance UX Designer</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                "PennyMind AI audited my statements and exposed 3 SaaS subscriptions I thought I canceled last year. The browser privacy gives me peace of mind."
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-600">MR</div>
                <div>
                  <span className="text-sm font-bold block text-slate-900 dark:text-white">Marcus Ross</span>
                  <span className="text-[10px] text-slate-400 block">Consulting CPA</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                "We use the CSV normalization to quickly categorize client tax records. The Gemini-driven descriptions categorization accuracy is mindblowing."
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">AL</div>
                <div>
                  <span className="text-sm font-bold block text-slate-900 dark:text-white">Aria Lin</span>
                  <span className="text-[10px] text-slate-400 block">Personal Capital Coach</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                "The health grade score and savings checklist make financial tracking interactive. It's like having a financial advisor in my browser tab."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-sky-500 uppercase tracking-widest block">Answering Queries</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-55 dark:hover:bg-slate-800/30 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <FiChevronUp className="h-4.5 w-4.5 text-slate-400" /> : <FiChevronDown className="h-4.5 w-4.5 text-slate-400" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-5 pt-0 text-xs leading-relaxed text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-805">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section (New Request) */}
      <section id="contact" className="py-24 bg-white dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-sky-500 uppercase tracking-widest block">Get In Touch</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Contact Us
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Have questions about client-side statement normalization or custom AI budget queries? Write to us.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-850 shadow-sm">
            {contactSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto text-lg">
                  <FiCheck />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Message Dispatched</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Thank you for writing. Our operational team will reply back to your inbox in 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500 transition text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500 transition text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe query..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs focus:outline-none focus:border-sky-500 transition text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold text-xs hover:from-sky-600 hover:to-teal-600 transition"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. Call To Action Section */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Audit Your Bank Statements in Real-Time
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Drag your banking statement, connect Google Gemini, and optimize your monthly budget. All entirely client-side.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="w-full sm:w-auto rounded-xl bg-white text-slate-950 hover:bg-slate-100 px-8 py-4 font-bold shadow-md transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto rounded-xl border border-slate-750 hover:bg-slate-850 px-8 py-4 font-semibold text-white transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Footer Section */}
      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/60 py-12 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-500 to-teal-400 text-white shadow-sm">
                <FiTrendingUp className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                PennyMind<span className="text-sky-500">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
              Open-source, browser-sandboxed expense categorization using advanced Google Gemini models.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Product</h5>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><a href="#team" className="hover:underline">Team</a></li>
              <li><a href="#industries" className="hover:underline">Industries</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Legal</h5>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="#privacy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Developer</h5>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a></li>
              <li><span className="text-slate-400">&copy; {new Date().getFullYear()} PennyMind</span></li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}
