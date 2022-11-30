// Resolves grade to Bulma color
export function resolveTag(grade: string) {
	if (grade.includes('V2')) {
		return 'is-primary';
	}
	if (grade.includes('V3')) {
		return 'is-info';
	}
	if (grade.includes('V5')) {
		return 'is-danger';
	}
	// defaults to V0
}

export function debug(msg: string) {
	if (process.env.NODE_ENV === 'production') {
		return;
	}
	console.debug(msg);
}
