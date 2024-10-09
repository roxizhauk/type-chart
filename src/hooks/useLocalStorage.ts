import { useCallback, useSyncExternalStore } from "react";

export const useLocalStorage = <Value = string | null>(
  key: string,
  transform?: (storedValue: string | null) => Value,
): readonly [Value, (newValue: Value) => void, () => void] => {
  const subscribe = (callback: () => void) => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === key) callback();
    }
    addEventListener("storage", handleStorageChange);
    return () => removeEventListener("storage", handleStorageChange);
  };

  const getSnapshot = () => localStorage.getItem(key);
  const getServerSnapshot = () => null;
  const pureValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const parsedValue = pureValue ? JSON.parse(pureValue) : null;
  const value = (transform ? transform(parsedValue) : parsedValue) as Value;

  const setValue = useCallback((newValue: Value) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    dispatchEvent(new StorageEvent("storage", { key }));
  }, []);

  const deleteKey = useCallback(() => {
    localStorage.removeItem(key);
  }, []);

  return [value, setValue, deleteKey] as const;
};
