/**
 * Custom React hook for persisting state to localStorage with SSR safety and debouncing.
 * Designed for persisting form data across page reloads.
 */

'use client';

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';

/**
 * Hook return type - matches standard useState pattern
 */
type UseLocalStorageReturn<T> = [T, (value: T | ((prev: T) => T)) => void];

/**
 * Debounce delay in milliseconds for localStorage saves
 */
const DEBOUNCE_DELAY_MS = 2000;

/**
 * Parse JSON safely with error handling
 */
function parseJSON<T>(value: string | null, fallback: T): T {
  if (value === null) {
    return fallback;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    console.warn('useLocalStorage: Error parsing JSON from localStorage');
    return fallback;
  }
}

/**
 * SSR-safe localStorage setter with error handling
 */
function setStorageValue<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', { key }));
    return true;
  } catch (error) {
    console.warn(
      `useLocalStorage: Error writing key "${key}" to localStorage:`,
      error
    );
    return false;
  }
}

/**
 * Create a subscribe function for useSyncExternalStore
 */
function createSubscribe(key: string) {
  return (callback: () => void) => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key || e.key === null) {
        callback();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  };
}

/**
 * Custom hook for persisting state to localStorage with SSR safety and debouncing.
 *
 * Features:
 * - SSR-safe: Uses useSyncExternalStore for proper hydration
 * - Debounced saves: Writes to localStorage are debounced by 2 seconds to avoid performance issues
 * - Error handling: Gracefully handles JSON parse errors and localStorage access errors
 * - Type-safe: Full TypeScript support with generics
 * - Cross-tab sync: Updates when localStorage changes in other tabs
 *
 * @param key - The localStorage key to use
 * @param initialValue - The initial value if no stored value exists
 * @returns A tuple of [storedValue, setValue] similar to useState
 *
 * @example
 * ```tsx
 * const [formData, setFormData] = useLocalStorage('intake-form', defaultFormData);
 *
 * // Update like useState
 * setFormData({ ...formData, name: 'New Name' });
 *
 * // Or with a function
 * setFormData(prev => ({ ...prev, name: 'New Name' }));
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // Create stable references for useSyncExternalStore
  const subscribe = useCallback(
    (callback: () => void) => createSubscribe(key)(callback),
    [key]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') {
      return JSON.stringify(initialValue);
    }
    return window.localStorage.getItem(key) ?? JSON.stringify(initialValue);
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => {
    return JSON.stringify(initialValue);
  }, [initialValue]);

  // Use useSyncExternalStore for SSR-safe localStorage access
  const storedString = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Parse the stored value
  const storedValue = parseJSON<T>(storedString, initialValue);

  // Ref to track the latest value for debouncing
  const valueRef = useRef<T>(storedValue);

  // Ref for the debounce timeout
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep valueRef in sync with storedValue via effect
  useEffect(() => {
    valueRef.current = storedValue;
  }, [storedValue]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounced save to localStorage
  const debouncedSave = useCallback(
    (value: T) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for debounced save
      timeoutRef.current = setTimeout(() => {
        setStorageValue(key, value);
        timeoutRef.current = null;
      }, DEBOUNCE_DELAY_MS);
    },
    [key]
  );

  // setValue function that mimics useState's setter
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      // Handle function updater pattern
      const newValue =
        value instanceof Function ? value(valueRef.current) : value;

      // Update the ref immediately
      valueRef.current = newValue;

      // Debounce the localStorage write
      debouncedSave(newValue);
    },
    [debouncedSave]
  );

  return [storedValue, setValue];
}

/**
 * Simpler version using useState for cases where SSR isn't a concern
 * or when you want immediate state updates without waiting for storage events
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // Initialize state from localStorage (client-only)
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Ref to track the latest value for debouncing
  const valueRef = useRef<T>(storedValue);

  // Ref for the debounce timeout
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounced save to localStorage
  const debouncedSave = useCallback(
    (value: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setStorageValue(key, value);
        timeoutRef.current = null;
      }, DEBOUNCE_DELAY_MS);
    },
    [key]
  );

  // setValue function that mimics useState's setter
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      const newValue =
        value instanceof Function ? value(valueRef.current) : value;

      setStoredValue(newValue);
      valueRef.current = newValue;
      debouncedSave(newValue);
    },
    [debouncedSave]
  );

  return [storedValue, setValue];
}

/**
 * Utility to manually clear a localStorage key
 * Useful for "Start Over" functionality
 */
export function clearLocalStorageKey(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    // Dispatch storage event to notify subscribers
    window.dispatchEvent(new StorageEvent('storage', { key }));
    return true;
  } catch (error) {
    console.warn(
      `useLocalStorage: Error clearing key "${key}" from localStorage:`,
      error
    );
    return false;
  }
}

/**
 * Utility to check if a localStorage key exists
 */
export function hasLocalStorageKey(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

export default useLocalStorage;
