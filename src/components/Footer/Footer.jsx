import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200/50 bg-gray-50/50 py-8 dark:border-gray-800/50 dark:bg-gray-950/20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} PennyMind AI. Built with client-side privacy. No server logging, no databases.
        </p>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Bank statement uploads are processed entirely in-browser. All analytical algorithms run locally via the Gemini API.
        </p>
      </div>
    </footer>
  );
}
