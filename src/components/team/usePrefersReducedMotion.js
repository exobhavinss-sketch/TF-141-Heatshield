import { useEffect, useState } from 'react';

/** Tracks the user's `prefers-reduced-motion` setting live. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    // Legacy Safari API
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  return reduced;
}
