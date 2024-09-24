import { writable } from 'svelte/store';
import { browser } from '$app/environment';

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
	return { ...defaultFilters };
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
				return n;
			}),
		reset: () =>
			update(() => {
				if (browser) {
					localStorage.setItem(FILTERS_LOCALSTORAGE_KEY, JSON.stringify(defaultFilters));
				}
				return { ...defaultFilters };
			})
	};
}
export const filters = createFiltersStore();
