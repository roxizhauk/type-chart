import { useSyncExternalStore } from "react";

export const useLocalStorage = (key: string) => {
  const setValue = (newValue: string) => {
    window.localStorage.setItem(key, newValue);
    window.dispatchEvent(new StorageEvent("storage", { key }));
  };

  const subscribe = (callback: () => void) => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) callback();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  };

  const getSnapshot = () => localStorage.getItem(key) || "";

  return [useSyncExternalStore(subscribe, getSnapshot), setValue] as const;
};
