export const silentlyPopCurrentUrlQueryParameter = (queryParameterName: string): string | null => {
	const url = new URL(window.location.href);

	const queryParameterValue = url.searchParams.get(queryParameterName);
	url.searchParams.delete(queryParameterName);

	window.history.replaceState('', '', url);

	return queryParameterValue;
};
