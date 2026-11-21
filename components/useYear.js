'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// The page is prerendered, so reading the date during render would freeze the build year
// and cause a hydration mismatch once the calendar year changes.
export default function useYear() {
  return useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => null);
}
