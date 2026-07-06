import { useState, useEffect } from 'react';

/**
 * Hook that returns the resolved theme ('light' or 'dark') and listens to all theme updates
 * (local state toggles, system preference changes, storage changes).
 */
export function useResolvedTheme() {
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    try {
      const savedTheme = window.localStorage.getItem('pennymind_theme');
      const theme = savedTheme ? JSON.parse(savedTheme) : 'system';
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme;
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      try {
        const savedTheme = window.localStorage.getItem('pennymind_theme');
        const theme = savedTheme ? JSON.parse(savedTheme) : 'system';
        if (theme === 'system') {
          setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
        } else {
          setResolvedTheme(theme);
        }
      } catch {
        setResolvedTheme('light');
      }
    };

    // 1. Listen to storage changes (e.g. cross-tab settings updates)
    window.addEventListener('storage', updateTheme);

    // 2. Listen to system preference alterations
    const systemListener = () => {
      try {
        const savedTheme = window.localStorage.getItem('pennymind_theme');
        const theme = savedTheme ? JSON.parse(savedTheme) : 'system';
        if (theme === 'system') {
          setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
        }
      } catch {}
    };
    mediaQuery.addEventListener('change', systemListener);

    // 3. Observe root element class mutations (instant updates in the same tab)
    const observer = new MutationObserver(() => {
      const isDark = window.document.documentElement.classList.contains('dark');
      setResolvedTheme(isDark ? 'dark' : 'light');
    });
    observer.observe(window.document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Run once on setup
    updateTheme();

    return () => {
      window.removeEventListener('storage', updateTheme);
      mediaQuery.removeEventListener('change', systemListener);
      observer.disconnect();
    };
  }, []);

  return resolvedTheme;
}
