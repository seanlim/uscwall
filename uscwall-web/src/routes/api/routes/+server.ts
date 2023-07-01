import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { google, sheets_v4 } from 'googleapis';

const GRADES: string[] = ['⬜️ (V0-V1)', '🟩 (V2-V3)', '🟦 (V4-V5)', '🟥 (≥V5)'];

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

const imgur_regex = new RegExp('https://i.imgur.com/([^/]+).webp');
function buildRoute(data: string[]): App.Route {
	const idMatch = imgur_regex.exec(data[0]);
	return {
		id: idMatch ? idMatch[1] : 'null-id',
		image_url: data[0],
		grade: data[1],
		route_type: data[2],
		route_name: data[3],
		setter_name: data[4],
		setter_handle: data[5],
		date_time: new Date(data[6]),
		setter_id: data[7],
		ascents: parseInt(data[8])
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
		range: 'vetted worksheet!A2:I'
	});
	const routes = res.data.values
		?.map(buildRoute)
		.sort((a, b) => GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade));
	const types = routes
		?.map((r) => r.route_type)
		// unique
		.filter((value, index, arr) => arr.indexOf(value) === index);
	return json({
		routes: IDQuery != null && IDQuery != '' ? routes?.filter((r) => r.id === IDQuery) : routes,
		grades: GRADES,
		sectors: types
	});
};
