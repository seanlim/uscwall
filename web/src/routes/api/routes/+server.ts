import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createGoogleSheetsClient } from '@/apiHelpers';
import _ from 'lodash';

const GRADES: string[] = [
	'⬜️ V1 and Below',
	'🟩 V2-V3',
	'🟦 V4-V5',
	'🟥 V6 and beyond',
	'🟪 Ungraded'
];

function buildRoute(data: string[]): App.Route {
	return {
		id: data[0],
		image_url: data[1],
		grade: data[2],
		route_type: data[3],
		route_name: data[4],
		setter_name: data[5],
		setter_handle: data[6],
		date_time: new Date(data[7]),
		setter_id: data[8],
		ascents: parseInt(data[9])
	};
}

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	setHeaders({
		'Cache-Control': 'public, max-age=180'
	});
	const routeIDQuery = url.searchParams.get('id');

	const client = await createGoogleSheetsClient();
	const sheetsRoutes = await client.spreadsheets.values.get({
		spreadsheetId: env.SPREADSHEET_ID,
		range: 'vetted worksheet!A2:J'
	});

	let routes = sheetsRoutes.data.values
		?.map(buildRoute)
		.sort((a, b) => GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade));
	if (routeIDQuery != null && routeIDQuery != '') {
		routes = routes?.filter((r) => r.id === routeIDQuery);
	}

	const types = _.uniq(routes?.map((r) => r.route_type));

	return json({
		routes,
		grades: GRADES,
		sectors: Array.from(types?.values() ?? [])
	});
};
