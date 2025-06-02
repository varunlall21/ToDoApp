"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';


export function ThemeToggle() {
  // Initialize state from localStorage or system preference, default to 'light'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (storedTheme) {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default for SSR or environments without window
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set initial theme on mount if not already set by useState initializer
      // This handles the case where useState runs before window is available for localStorage/matchMedia
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const currentTheme = storedTheme || systemPreference;
      if (theme !== currentTheme) {
        setTheme(currentTheme);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light'); // Explicitly remove light
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light'); // Explicitly add light
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Avoid rendering the button until the theme is properly determined client-side
  // to prevent hydration mismatch if server renders one icon and client prefers another.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-10 w-10" />; // Placeholder to prevent layout shift
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem] transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />}
      {theme === 'dark' && <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
