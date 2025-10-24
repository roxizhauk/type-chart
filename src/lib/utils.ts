import { browser } from '$app/environment';

export function loadLS<T>(key: string, defaultData: T): T {
	try {
		if (!browser) return defaultData;
		const storedString = localStorage.getItem(key);
		if (!storedString) return defaultData;

		const parsedData = JSON.parse(storedString) as unknown;
		if (typeof defaultData !== 'object' || defaultData === null) {
			if (parsedData !== undefined) return parsedData as T;
			return defaultData;
		}

		const storedData = parsedData as Record<string, unknown>;
		const dataToLoad: Partial<T> = {};
		for (const key in defaultData) {
			const storedValue = storedData[key];
			if (storedValue !== undefined) {
				dataToLoad[key as keyof T] = storedValue as T[keyof T];
			}
		}

		return { ...defaultData, ...dataToLoad };
	} catch {
		return defaultData;
	}
}

// export function loadLS2<T extends object>(key: string, defaultData: T): T {
// 	try {
// 		if (!browser) return defaultData;
// 		const storedString = localStorage.getItem(key);
// 		if (!storedString) return defaultData;

// 		const storedData = JSON.parse(storedString) as Record<string, unknown>;
// 		const dataToLoad: Partial<T> = {};
// 		for (const key in defaultData) {
// 			const storedValue = storedData[key];
// 			if (storedValue !== undefined) {
// 				dataToLoad[key as keyof T] = storedValue as T[keyof T];
// 			}
// 		}

// 		return { ...defaultData, ...dataToLoad };
// 	} catch {
// 		return defaultData;
// 	}
// }

export function saveLS(key: string, data: unknown) {
	localStorage.setItem(key, JSON.stringify(data));
}
