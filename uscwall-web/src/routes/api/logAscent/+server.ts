import { json } from '@sveltejs/kit';
import { createGoogleSheetsClient, insertIntoSheet } from '../../../apiHelpers';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const SHEET_ASCENTS = 'ascentsNEW';

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

export const GET: RequestHandler = async ({ url }) => {
	const routeID = url.searchParams.get('route_id');
	const username = url.searchParams.get('username');
	const rating = url.searchParams.get('rating');
	const noOfAttempts = url.searchParams.get('attempts');

	if (routeID == null) {
		return json({ ok: false });
	}

	// check if route exists
	const client = await createGoogleSheetsClient();
	const res = await client.spreadsheets.values.get({
		spreadsheetId: env.SPREADSHEET_ID,
		range: 'submissions!A2:J'
	});
	const routes = res.data.values?.map(buildRoute);
	if (routes == null) {
		return json({ ok: false });
	}
	const routesByID = routes.map((r) => r.id);
	const routeIndex = routesByID.indexOf(routeID);
	if (routeIndex === -1) {
		return json({ ok: false });
	}

	// increment ascent counter
	await client.spreadsheets.values.update({
		spreadsheetId: env.SPREADSHEET_ID,
		range: `submissions!J${routeIndex + 2}`,
		valueInputOption: 'USER_ENTERED',
		requestBody: {
			values: [[routes[routeIndex].ascents + 1]]
		}
	});

	// insert into ascent sheet
	await insertIntoSheet(SHEET_ASCENTS, [[routeID, username, noOfAttempts, rating, new Date()]]);
	return json({ ok: true });
};
