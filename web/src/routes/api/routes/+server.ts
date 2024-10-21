import { json, type RequestHandler } from '@sveltejs/kit';
import { buildRoute, getGradesSheetRows, getRoutesSheetRows } from '@/apiHelpers';
import _ from 'lodash';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	setHeaders({
		'Cache-Control': 'public, max-age=180'
	});
	const routeIDQuery = url.searchParams.get('id');

	const routesRows = await getRoutesSheetRows();
	let routes = routesRows ? routesRows.map(buildRoute) : [];

	if (routeIDQuery != null && routeIDQuery != '') {
		routes = routes?.filter((r) => r.id === routeIDQuery);
	}

	const types = _.uniq(routes?.map((r) => r.route_type));
	const grades = await getGradesSheetRows();

	return json({
		routes,
		grades: _.flatten(grades),
		sectors: Array.from(types?.values() ?? [])
	});
};
