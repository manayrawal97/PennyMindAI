import React, { useState } from 'react';
import { FiSun, FiMoon, FiMonitor, FiLogOut, FiTrendingUp, FiSettings, FiMenu, FiX, FiInfo } from 'react-icons/fi';

export default function Navbar({ theme, setTheme, isLoggedIn, onLogout, stage, setStage, apiKey, setApiKey }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/80 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div 
          className="flex cursor-pointer items-center space-x-2.5" 
          onClick={() => {
            if (isLoggedIn) setStage('landing');
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-500 text-white shadow-md shadow-brand-500/20">
            <FiTrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              PennyMind<span className="bg-gradient-to-r from-brand-500 to-emerald-400 bg-clip-text text-transparent">AI</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isLoggedIn && (
            <>
              <button 
                onClick={() => setStage('landing')}
                className={`text-sm font-medium transition-colors ${stage === 'landing' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}`}
              >
                Dashboard Home
              </button>
              {stage === 'dashboard' && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30">
                  Analysis Active
                </span>
              )}
            </>
          )}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Gemini Key Input */}
          {isLoggedIn && (
            <div className="relative">
              <button 
                onClick={() => setShowKeyModal(true)}
                className="flex items-center space-x-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <FiSettings className="h-3.5 w-3.5" />
                <span>{apiKey ? 'Gemini Active' : 'Configure Gemini'}</span>
              </button>
            </div>
          )}

          {/* Theme Toggle Selector */}
          <div className="flex items-center rounded-xl bg-gray-100 dark:bg-gray-800 p-0.5 border border-gray-200/20">
            <button
              onClick={() => setTheme('light')}
              title="Light Mode"
              className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white dark:bg-gray-700 text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
            >
              <FiSun className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark Mode"
              className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-white dark:bg-gray-700 text-brand-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
            >
              <FiMoon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTheme('system')}
              title="System Default"
              className={`p-1.5 rounded-lg transition-all ${theme === 'system' ? 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
            >
              <FiMonitor className="h-4 w-4" />
            </button>
          </div>

          {/* Log Out */}
          {isLoggedIn && (
            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 px-3.5 py-2 text-sm font-medium transition"
              title="Log Out"
            >
              <FiLogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-2 md:hidden">
          <div className="flex items-center rounded-xl bg-gray-100 dark:bg-gray-800 p-0.5 border border-gray-200/20">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400"
            >
              {theme === 'dark' ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            </button>
          </div>

          <button
            onClick={toggleMenu}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {menuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-3 transition-colors duration-300">
          {isLoggedIn && (
            <>
              <button 
                onClick={() => { setStage('landing'); setMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Dashboard Home
              </button>
              <button 
                onClick={() => { setShowKeyModal(true); setMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Gemini Settings ({apiKey ? 'Key Configured' : 'No Key'})
              </button>
              <button
                onClick={() => { onLogout(); setMenuOpen(false); }}
                className="flex w-full items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Log out</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiSettings className="text-brand-500" /> Configure Google Gemini API
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              PennyMind AI executes client-side analysis using Gemini 2.5 Flash. Provide your own key to analyze customized transactions, or toggle Demo Mode.
            </p>
            <div className="mt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Gemini API Key</label>
              <input
                type="password"
                value={apiKey || ''}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
              />
              <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400">
                <FiInfo className="flex-shrink-0" />
                <span>Key is saved in LocalStorage and never sent to our servers.</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowKeyModal(false)}
                className="rounded-xl border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
