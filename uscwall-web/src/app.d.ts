// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	type Route = {
		id: string;
		image_url: string;
		grade: string;
		route_type: string;
		route_name: string;
		setter_name: string;
		setter_handle: string;
		date_time: Date;
		setter_id: string;
		ascents: number;
		next: string | null;
		prev: string | null;
	};
	type Ascent = {
		route_id: string;
		username: string;
		attempts: string;
		rating: string;
		date_time: Date;
	};
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
