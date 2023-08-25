import { browser } from '$app/environment';
import { debug } from '../helpers';
import { writable } from 'svelte/store';

export type Routes = {
	routes?: App.Route[];
	sectors?: string[];
	grades: string[];
};
const ROUTES_LOCALSTORAGE_KEY = 'routes';
const defaultRoutes: Routes = { routes: [], sectors: [], grades: [] };
function getRoutesFromLocalStorage(): Routes {
	if (browser) {
		return JSON.parse(
			localStorage.getItem(ROUTES_LOCALSTORAGE_KEY) ?? JSON.stringify(defaultRoutes)
		);
	}
	// Correct localstore corruption
	if (defaultRoutes.routes == null) {
		defaultRoutes.routes = [];
	}
	if (defaultRoutes.sectors == null) {
		defaultRoutes.sectors = [];
	}
	return defaultRoutes;
}
function createRoutesStore() {
	const routes = getRoutesFromLocalStorage();
	const { subscribe, set, update } = writable<Routes>(routes);
	return {
		subscribe,
		set: (value: Routes) => {
			if (browser) {
				localStorage.setItem(ROUTES_LOCALSTORAGE_KEY, JSON.stringify(value));
			}
			debug(`setting routes ${JSON.stringify(value, null, 2)}`);
			set(routes);
		},
		update: (value: Routes) =>
			update(() => {
				if (browser) {
					localStorage.setItem(ROUTES_LOCALSTORAGE_KEY, JSON.stringify(value));
				}
				debug(`updating routes ${JSON.stringify(value, null, 2)}`);
				return value;
			})
	};
}

export const routes = createRoutesStore();
