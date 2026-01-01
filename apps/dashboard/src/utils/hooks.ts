import { useRef, useEffect, useState } from 'react';

export const useShouldShowError = (
  condition1: boolean,
  condition2: boolean,
) => {
  const hasEnteredRef = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (condition1 && condition2 && !hasEnteredRef.current) {
      hasEnteredRef.current = true;
      setShouldRender(true);
    }

    if (!condition2 && hasEnteredRef.current) {
      setShouldRender(false);
      hasEnteredRef.current = false;
    }
  }, [condition1, condition2]);

  return shouldRender;
};
