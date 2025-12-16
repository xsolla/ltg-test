export const useSetCurrency = async () => {
	const currency = useState('currency');
	const now = Date.now();
	let localCurrency = localStorage.getItem('currency');

	if (localCurrency) {
		localCurrency = JSON.parse(localCurrency);
		// @ts-ignore
		if (now - localCurrency.timestamp < 1000 * 60 * 5) {
			// @ts-ignore
			currency.value = localCurrency.currency;
			return currency;
		}
		localStorage.removeItem('currency');
	}

	const { $api } = useNuxtApp();
	currency.value = await $api.getCurrency();

	localStorage.setItem(
		'currency',
		JSON.stringify({
			currency: currency.value,
			timestamp: Date.now(),
		})
	);

	return currency;
};
