import { env } from '$env/dynamic/private';
import { google } from 'googleapis';

const ASCENT_SHEET_NAME = 'user_ascents';
const ROUTES_SHEET_NAME = 'vetted worksheet';
const GRADES_SHEET_NAME = 'grades';

const Ascent = {
	Sent: 'SEND',
	Flashed: 'FLASH',
	Unsent: 'UNSENT'
};

export async function initializeSheetsClient() {
	const jwtClient = new google.auth.JWT(
		env.SHEETS_CLIENT_NAME,
		'',
		(env.SHEETS_CLIENT_KEY || '').replace(/\\n/gm, '\n'),
		['https://www.googleapis.com/auth/spreadsheets']
	);
	await jwtClient.authorize();
	const client = google.sheets({ version: 'v4', auth: jwtClient });
	return client;
}

async function getRows(sheetName: string, range: string) {
	const client = await initializeSheetsClient();
	const spreadsheetId = env.SPREADSHEET_ID || '';
	if (!spreadsheetId) {
		throw new Error('No spreadsheet ID set');
	}
	const rows = await client.spreadsheets.values.get({
		spreadsheetId: spreadsheetId,
		range: sheetName + '!' + range
	});
	return rows.data.values;
}

async function insertRows(values: unknown[][], sheetName: string) {
	const client = await initializeSheetsClient();
	const spreadsheetId = env.SPREADSHEET_ID || '';
	if (!spreadsheetId) {
		throw new Error('No spreadsheet ID set');
	}
	await client.spreadsheets.values.append({
		spreadsheetId: env.SPREADSHEET_ID,
		range: sheetName,
		valueInputOption: 'USER_ENTERED',
		requestBody: {
			values
		}
	});
}

async function updateRow(value: unknown[], sheetName: string, atIndex: number) {
	const client = await initializeSheetsClient();
	const spreadsheetId = env.SPREADSHEET_ID || '';
	if (!spreadsheetId) {
		throw new Error('No spreadsheet ID set');
	}
	await client.spreadsheets.values.update({
		spreadsheetId: env.SPREADSHEET_ID,
		range: sheetName + '!' + 'A' + (atIndex + 1).toString(),
		valueInputOption: 'USER_ENTERED',
		requestBody: {
			values: [value]
		}
	});
}

export async function getAscentsSheetRows() {
	return getRows(ASCENT_SHEET_NAME, 'A1:E');
}

export async function getRoutesSheetRows() {
	return getRows(ROUTES_SHEET_NAME, 'A1:J');
}

export async function getGradesSheetRows() {
	return getRows(GRADES_SHEET_NAME, 'A1:A');
}

export async function logNewAscent(ascent: Ascent) {
	await insertRows(
		[
			[
				ascent.route_id,
				ascent.username,
				ascent.is_flash ? Ascent.Flashed : Ascent.Sent,
				ascent.grade,
				ascent.date_created
			]
		],
		ASCENT_SHEET_NAME
	);
}

export async function updateAscent(atIndex: number, newAscent: Ascent) {
	await updateRow(
		[
			newAscent.route_id,
			newAscent.username,
			newAscent.is_flash ? Ascent.Flashed : Ascent.Sent,
			newAscent.grade,
			newAscent.date_created
		],
		ASCENT_SHEET_NAME,
		atIndex
	);
}

export async function unSendRoute(atIndex: number) {
	const client = await initializeSheetsClient();
	const spreadsheetId = env.SPREADSHEET_ID || '';
	if (!spreadsheetId) {
		throw new Error('No spreadsheet ID set');
	}
	await client.spreadsheets.values.update({
		spreadsheetId: env.SPREADSHEET_ID,
		range: ASCENT_SHEET_NAME + '!' + 'C' + (atIndex + 1).toString(),
		valueInputOption: 'USER_ENTERED',
		requestBody: {
			values: [[Ascent.Unsent]]
		}
	});
}

export function buildAscent(row: string[]): Ascent {
	return {
		route_id: row[0],
		username: row[1],
		is_flash: row[2] === 'FLASH',
		grade: row[3] as Grade,
		date_created: new Date(row[4])
	};
}

export function buildRoute(data: string[]): Route {
	return {
		id: data[0],
		image_url: data[1],
		grade: data[2] as Grade,
		route_type: data[3],
		route_name: data[4],
		setter_name: data[5],
		setter_handle: data[6],
		date_time: new Date(data[7]),
		setter_id: data[8],
		ascents: parseInt(data[9])
	};
}
