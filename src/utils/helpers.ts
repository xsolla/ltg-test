export const getGeoIp = (): Promise<string> => {
	return fetch(`/api/geo`, {method: 'GET'})
		.then(response => response.json())
		.then(result => {
			return result.region || 'US';
		})
		.catch(error => {
			console.log('error', error);
			return 'US';
		});
};
