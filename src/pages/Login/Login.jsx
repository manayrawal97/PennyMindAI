import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiShield, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // For demonstration, simply succeed login and navigate to dashboard
    onLoginSuccess();
    navigate('/dashboard');
  };

  const triggerDemoLogin = () => {
    onLoginSuccess();
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/20 py-12 transition-colors duration-300">
      
      <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden p-6 md:p-12">
        
        {/* Left Side: Login Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-950/30 dark:text-sky-400 border border-sky-100/50 dark:border-sky-900/30">
              <FiShield className="h-3.5 w-3.5" />
              SaaS Demo Sandbox
            </span>
            
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Welcome to PennyMind
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Analyze your bank statement and discover spending leaks.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</label>
              <div className="relative mt-1">
                <FiMail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  defaultValue="demo@pennymind.ai"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Password</label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-sky-500 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative mt-1">
                <FiLock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  defaultValue="password"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Checkbox Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">Remember me</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-600 text-white dark:text-slate-950 font-bold py-3 text-sm transition shadow-sm"
              >
                <span>Sign in with Email</span>
                <FiArrowRight className="h-4 w-4" />
              </button>

              {/* Demo Sign In Button */}
              <button
                type="button"
                onClick={triggerDemoLogin}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-sky-500 hover:bg-sky-50/10 text-sky-600 dark:text-sky-400 font-bold py-3 text-sm transition"
              >
                <span>⚡ Instant Demo Login</span>
              </button>

            </div>
          </form>
          
          <div className="text-center pt-2">
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:underline">
              &larr; Back to Marketing Home
            </Link>
          </div>
        </div>

        {/* Right Side: Animated Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-tr from-sky-600 to-indigo-700 rounded-2xl p-8 text-white h-[470px] relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          
          {/* Glowing Circles / Abstract SVG Illustration */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute h-80 w-80 rounded-full border border-white/10 flex items-center justify-center"
          >
            <div className="h-60 w-60 rounded-full border border-white/20 flex items-center justify-center">
              <div className="h-40 w-40 rounded-full border border-white/30" />
            </div>
          </motion.div>

          {/* Floating UI Elements mockups using Framer Motion */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 max-w-xs shadow-lg"
          >
            <span className="text-[10px] text-sky-200 font-bold uppercase tracking-wider block">Auditor Mode</span>
            <span className="text-xl font-bold mt-1 block">Expense Leak Found</span>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">+₹8.5k</div>
              <div>
                <span className="text-xs font-bold block">Subscriptions Cap</span>
                <span className="text-[10px] text-white/60 block">Action completed successfully</span>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 text-center relative z-10">
            <h4 className="text-lg font-bold">Client-Side statement processing</h4>
            <p className="text-xs text-sky-200 mt-2 max-w-[240px]">
              No server database uploads. Your personal banking data never leaves your device.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
