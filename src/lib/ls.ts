import { browser } from '$app/environment';

export function loadLS<T>(key: string, defaultData: T): T {
	try {
		if (!browser) return defaultData;
		const storedString = localStorage.getItem(key);
		if (!storedString) {
			throw new Error('no stored data');
		}

		const parsedValue: unknown = JSON.parse(storedString);

		if (Array.isArray(defaultData)) {
			if (!Array.isArray(parsedValue)) {
				throw new Error('parsed value is not an array');
			}
			return parsedValue as T;
		}

		if (typeof defaultData !== 'object' || defaultData === null) {
			if (parsedValue === undefined) {
				throw new Error('parsed value is undefined');
			}
			return parsedValue as T;
		}

		const parsedObj = parsedValue as Record<string, unknown>;
		const dataToLoad: Partial<T> = {};
		for (const k in defaultData) {
			if (parsedObj[k] !== undefined) {
				dataToLoad[k as keyof T] = parsedObj[k] as T[keyof T];
			}
		}
		return { ...(defaultData as object), ...(dataToLoad as object) } as T;
	} catch (e) {
		console.error(`Error loading data for "${key}":`, e);
		return defaultData;
	}
}

export function saveLS(key: string, data: unknown) {
	localStorage.setItem(key, JSON.stringify(data));
}
