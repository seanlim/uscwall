// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

type Route = {
	id: string;
	image_url: string;
	grade: Grade;
	route_type: string;
	route_name: string;
	setter_name: string;
	setter_handle: string;
	date_time: Date;
	setter_id: string;
	ascents: number;
};
type Ascent = {
	route_id: string;
	username: string;
	is_flash: boolean;
	grade: Grade;
	date_created: Date;
};
enum Grade {
	V1 = '⬜️ V1 and Below',
	V2V3 = '🟩 V2-V3',
	V4V5 = '🟦 V4-V5',
	V6 = '🟥 V6 and beyond',
	WILD = '🟪 Ungraded'
}
