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
