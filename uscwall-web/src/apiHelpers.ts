import { env } from '$env/dynamic/private';
import { google, type sheets_v4 } from 'googleapis';

export async function createGoogleSheetsClient(): Promise<sheets_v4.Sheets> {
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

export async function insertIntoSheet(range: string, values: any[][]) {
	const client = await createGoogleSheetsClient();
	await client.spreadsheets.values.append({
		spreadsheetId: process.env.SPREADSHEET_ID,
		range: range,
		valueInputOption: 'USER_ENTERED',
		requestBody: {
			values
		}
	});
}
