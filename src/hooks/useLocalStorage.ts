import { useCallback, useSyncExternalStore } from "react";

export const useLocalStorage = <Value = string | null>(
  key: string,
  transform?: (storedValue: string | null) => Value,
): readonly [Value, (newValue: Value) => void] => {
  const subscribe = (callback: () => void) => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === key) callback();
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  };

  const getSnapshot = () => {
    const value = localStorage.getItem(key);
    return (transform ? transform(value) : value) as Value;
  };

  const getServerSnapshot = () => {
    return (transform ? transform(null) : null) as Value;
  };

  const setValue = useCallback(
    (newValue: Value) => {
      window.localStorage.setItem(key, JSON.stringify(newValue));
      window.dispatchEvent(new StorageEvent("storage", { key }));
    },
    [key],
  );

  return [useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot), setValue] as const;
};
