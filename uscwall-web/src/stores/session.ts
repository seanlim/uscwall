import { browser } from '$app/environment';
import { debug } from '../helpers';
import { writable } from 'svelte/store';

const SESSION_LOCALSTORAGE_KEY = 'session';

type SessionData = {
	showWelcome: boolean;
};

const defaultSessionData: SessionData = {
	showWelcome: true
};

function getSessionFromLocalStorage(): SessionData {
	if (browser) {
		return JSON.parse(
			localStorage.getItem(SESSION_LOCALSTORAGE_KEY) ?? JSON.stringify(defaultSessionData)
		) as SessionData;
	}
	return defaultSessionData;
}
function createSessionStore() {
	const session = getSessionFromLocalStorage();
	const { subscribe, set, update } = writable<SessionData>(session);
	return {
		subscribe,
		set: (value: SessionData) => {
			if (browser) {
				localStorage.setItem(SESSION_LOCALSTORAGE_KEY, JSON.stringify(value));
			}
			debug(`setting session ${JSON.stringify(value, null, 2)}`);
			set(value);
		},
		update: (key: keyof SessionData, value: any) =>
			update((x) => {
				const n: SessionData = {
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
					localStorage.setItem(SESSION_LOCALSTORAGE_KEY, JSON.stringify(defaultSessionData));
				}
				return defaultSessionData;
			})
	};
}
export const session = createSessionStore();
