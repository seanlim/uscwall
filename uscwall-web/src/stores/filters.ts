import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { debug } from '../helpers';

const FILTERS_LOCALSTORAGE_KEY = 'filters';
type Filters = {
	query: string;
	grade: string;
	sector: string;
};
const defaultFilters = {
	query: '',
	grade: '*',
	sector: '*'
};
function getFiltersFromLocalStorage(): Filters {
	if (browser) {
		return JSON.parse(
			localStorage.getItem(FILTERS_LOCALSTORAGE_KEY) ?? JSON.stringify(defaultFilters)
		);
	}
	return defaultFilters;
}
function createFiltersStore() {
	const filters = getFiltersFromLocalStorage();
	const { subscribe, set, update } = writable<Filters>(filters);
	return {
		subscribe,
		set: (value: Filters) => {
			if (browser) {
				localStorage.setItem(FILTERS_LOCALSTORAGE_KEY, JSON.stringify(value));
			}
			debug(`setting filters ${JSON.stringify(value, null, 2)}`);
			set(value);
		},
		update: (key: keyof Filters, value: string) =>
			update((x) => {
				const n = {
					...x,
					[key]: value
				};
				if (browser) {
					localStorage.setItem(FILTERS_LOCALSTORAGE_KEY, JSON.stringify(n));
				}
				debug(`updating ${JSON.stringify(n, null, 2)}`);
				return n;
			}),
		reset: () =>
			update(() => {
				if (browser) {
					localStorage.setItem(FILTERS_LOCALSTORAGE_KEY, JSON.stringify(defaultFilters));
				}
				return defaultFilters;
			})
	};
}
export const filters = createFiltersStore();
