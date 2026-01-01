import { useRef, useEffect, useState } from 'react';

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
