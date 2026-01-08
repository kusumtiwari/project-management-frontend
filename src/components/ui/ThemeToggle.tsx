import React, { useEffect, useState } from 'react';

const THEME_KEY = 'theme';

const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = saved ? saved === 'dark' : prefersDark;
    setDark(initialDark);
    applyTheme(initialDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  };

  const applyTheme = (isDark: boolean) => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.toggle('dark', isDark);
    body.classList.toggle('dark', isDark);
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center justify-center h-8 w-8 rounded-md border bg-white text-gray-700 hover:bg-gray-50 dark:bg-neutral-900 dark:text-gray-100 dark:border-neutral-700"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {dark ? (
        // Moon icon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      ) : (
        // Sun icon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10-9h-2v3h2V4zm7.66 1.66l-1.41-1.41-1.8 1.79 1.42 1.42 1.79-1.8zM20 11v2h3v-2h-3zm-6 6h-2v3h2v-3zm4.24 2.76l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM4.24 19.76l-1.8 1.79 1.41 1.41 1.79-1.79-1.4-1.41zM12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
