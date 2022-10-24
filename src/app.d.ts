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
	};
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
