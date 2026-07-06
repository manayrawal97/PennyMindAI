import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Landing from './pages/Landing/Landing';
import { useLocalStorage } from './hooks/useLocalStorage';

// Helper component to protect routes
function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [theme, setTheme] = useLocalStorage('pennymind_theme', 'system');
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('pennymind_login_status', false);
  const [apiKey, setApiKey] = useLocalStorage('pennymind_gemini_key', '');
  const [stage, setStage] = useState('landing'); // inside-dashboard stage

  // Theme Toggler & System Preference Watcher
  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (resolvedTheme) => {
      if (resolvedTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');

      const listener = (e) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setStage('landing');
  };

  return (
    <Router>
      <div className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-200 transition-colors duration-300">
        
        <Routes>
          {/* Landing Page (Marketing Portal) */}
          <Route path="/" element={<Landing theme={theme} setTheme={setTheme} />} />

          {/* Login Portal */}
          <Route 
            path="/login" 
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLoginSuccess={() => setIsLoggedIn(true)} />
              )
            } 
          />

          {/* Protected Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <div className="min-h-screen flex flex-col justify-between">
                  <Navbar 
                    theme={theme} 
                    setTheme={setTheme} 
                    isLoggedIn={isLoggedIn} 
                    onLogout={handleLogout} 
                    stage={stage}
                    setStage={setStage}
                    apiKey={apiKey}
                    setApiKey={setApiKey}
                  />
                  <main className="flex-grow">
                    <Home stage={stage} setStage={setStage} apiKey={apiKey} />
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Unknown routes redirect to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </div>
    </Router>
  );
}
