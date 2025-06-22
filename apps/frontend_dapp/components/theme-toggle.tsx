'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render the UI after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Set the theme based on system preference on initial load
    if (theme === 'system' && typeof window !== 'undefined') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
    }
  }, [theme, setTheme]);

  if (!mounted) {
    return (
      <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-full border border-indigo-300 dark:border-gray-600 w-[68px] h-10">
        {/* Skeleton loader while mounting */}
      </div>
    );
  }

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-full border border-indigo-300 dark:border-gray-600">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('light')}
        className={`rounded-full h-8 w-8 p-0 ${
          theme === 'light' 
            ? 'bg-white shadow text-yellow-500' 
            : 'text-gray-500 hover:text-foreground hover:bg-transparent'
        }`}
        aria-label="Light theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('system')}
        className={`rounded-full h-8 w-8 p-0 mx-1 ${
          theme === 'system'
            ? 'bg-white/80 dark:bg-gray-800 shadow text-blue-500 dark:text-blue-400'
            : 'text-gray-500 hover:text-foreground hover:bg-transparent'
        }`}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('dark')}
        className={`rounded-full h-8 w-8 p-0 ${
          theme === 'dark' 
            ? 'bg-gray-800 text-white shadow' 
            : 'text-gray-500 hover:text-foreground hover:bg-transparent'
        }`}
        aria-label="Dark theme"
      >
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  );
}
