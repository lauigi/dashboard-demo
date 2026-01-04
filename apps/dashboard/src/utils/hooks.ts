import { useEffect, useRef, useState } from 'react';

export const useShouldShowError = (
  condition1: boolean,
  condition2: boolean,
) => {
  const hasShowedRef = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (condition1 && condition2 && !hasShowedRef.current) {
      hasShowedRef.current = true;
      setShouldRender(true);
    }

    if (!condition2 && hasShowedRef.current) {
      setShouldRender(false);
      hasShowedRef.current = false;
    }
  }, [condition1, condition2]);

  return shouldRender;
};

export function useDarkMode() {
  const [isDark, setIsDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    // 现代浏览器使用 addEventListener
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isDark;
}
