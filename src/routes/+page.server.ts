import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import {google, sheets_v4} from 'googleapis';

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

function buildRoute(data: string[]): {
  image_url: string;
  grade: string;
  route_type: string;
  route_name: string;
  setter_name: string;
  setter_handle: string;
  date_time:Date; 
  uuid: string; 
  ascents: number;
} {
  return {
    image_url: data[0],
  grade: data[1],
  route_type: data[2],
  route_name: data[3], 
  setter_name: data[4],
  setter_handle: data[5],
  date_time: new Date(data[6]),
  uuid: data[7],
  ascents: parseInt(data[8]), 
  };
}

export const load: PageServerLoad = async ({ params }) => {
  const client = await createGoogleSheetsClient();
  const res = await client.spreadsheets.values.get({
    spreadsheetId: env.SPREADSHEET_ID,
    range: 'vetted worksheet!A2:I'
  });
  return {
    routes: res.data.values?.map(buildRoute),
  }
  throw error(404, 'Not found');
}