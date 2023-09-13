import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createGoogleSheetsClient } from '../../../apiHelpers';

function buildAscents(data: string[]): App.Ascent {
	return {
		route_id: data[0],
		username: data[1],
		attempts: data[2],
		rating: data[3],
		date_time: new Date(data[4])
	};
}
export const GET: RequestHandler = async ({ url }) => {
	const usernameQuery = url.searchParams.get('username');
	const routeIDQuery = url.searchParams.get('route_id');

	const client = await createGoogleSheetsClient();
	const res = await client.spreadsheets.values.get({
		spreadsheetId: env.SPREADSHEET_ID,
		range: 'ascentsNEW!A2:E'
	});
	const ascents = res.data.values?.map(buildAscents);
	if (ascents == null) {
		return json({
			results: []
		});
	}

	let results = ascents;
	if (usernameQuery != null) {
		results = results.filter((a) => a.username === usernameQuery);
	}
	if (routeIDQuery != null) {
		results = results.filter((a) => a.route_id === routeIDQuery);
	}
	return json({
		results
	});
};
