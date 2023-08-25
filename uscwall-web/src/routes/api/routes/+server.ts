import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { google, sheets_v4 } from 'googleapis';

const GRADES: string[] = [
	'⬜️ Beginner (V0-V1)',
	'🟩 Easy (V2-V3)',
	'🟦 Intermediate (V4-V5)',
	'🟥 Hard (≥V5)'
];

async function createGoogleSheetsClient(): Promise<sheets_v4.Sheets> {
	const jwtClient = new google.auth.JWT(
		env.SHEETS_CLIENT_NAME,
		'',
		(env.SHEETS_CLIENT_KEY || '').replace(/\\n/gm, '\n'),
		['https://www.googleapis.com/auth/spreadsheets']
	);
	await jwtClient.authorize();
	const sheets = google.sheets({ version: 'v4', auth: jwtClient });

	return sheets;
}

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
	const IDQuery = url.searchParams.get('id');
	setHeaders({
		'cache-control': 'max-age=604800, stale-while-revalidate=60'
	});

	const client = await createGoogleSheetsClient();
	const res = await client.spreadsheets.values.get({
		spreadsheetId: env.SPREADSHEET_ID,
		range: 'vetted worksheet!A2:J'
	});
	const routes = res.data.values
		?.map(buildRoute)
		.sort((a, b) => GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade));
	const types = routes
		?.map((r) => r.route_type)
		// unique
		.filter((value, index, arr) => arr.indexOf(value) === index);
	return json({
		routes:
			(IDQuery != null && IDQuery != '' ? routes?.filter((r) => r.id === IDQuery) : routes) ?? [],
		grades: GRADES,
		sectors: types ?? []
	});
};
