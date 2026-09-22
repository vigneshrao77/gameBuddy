'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return <div className={styles.switchFallback} />;
  }

  // The CSS has 'checked' state styled as light mode (blue sky, yellow sun)
  // and 'unchecked' state styled as dark mode (dark background, moon)
  const isLight = theme === 'light';

  return (
    <label className={styles.switch}>
      <input 
        type="checkbox" 
        checked={isLight}
        onChange={() => setTheme(isLight ? 'dark' : 'light')}
        aria-label="Toggle theme"
      />
      <span className={styles.slider} />
    </label>
  );
};

export default ThemeToggle;
