export function usePrettifyDate(date: string | Date) {
	date = new Date(date);
	const localOffset = date.getTimezoneOffset();
	const gmtTime = new Date(date.getTime() + localOffset * 60 * 1000);
	return new Date(gmtTime).toLocaleDateString('fr-CH', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	});
}
