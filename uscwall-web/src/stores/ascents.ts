import { browser } from '$app/environment';
import { debug } from '../helpers';
import { writable } from 'svelte/store';

const SESSION_LOCALSTORAGE_KEY = 'ascents';

type AscentsData = {
	ascents: App.Ascent[];
};

const defaultAscentsData: AscentsData = {
	ascents: []
};

function getSessionFromLocalStorage(): AscentsData {
	if (browser) {
		return JSON.parse(
			localStorage.getItem(SESSION_LOCALSTORAGE_KEY) ?? JSON.stringify(defaultAscentsData)
		) as AscentsData;
	}
	return defaultAscentsData;
}
function createAscentsStore() {
	const session = getSessionFromLocalStorage();
	const { subscribe, set, update } = writable<AscentsData>(session);
	return {
		subscribe,
		set: (value: AscentsData) => {
			if (browser) {
				localStorage.setItem(SESSION_LOCALSTORAGE_KEY, JSON.stringify(value));
			}
			debug(`setting session ${JSON.stringify(value, null, 2)}`);
			set(value);
		},
		update: (key: keyof AscentsData, value: any) =>
			update((x) => {
				const n: AscentsData = {
					...x,
					[key]: value
				};
				if (browser) {
					localStorage.setItem(SESSION_LOCALSTORAGE_KEY, JSON.stringify(n));
				}
				debug(`updating ${JSON.stringify(n, null, 2)}`);
				return n;
			}),
		reset: () =>
			update(() => {
				if (browser) {
					localStorage.setItem(SESSION_LOCALSTORAGE_KEY, JSON.stringify(defaultAscentsData));
				}
				return defaultAscentsData;
			})
	};
}
export const ascents = createAscentsStore();
