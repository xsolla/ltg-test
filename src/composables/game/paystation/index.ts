import type { OpenPaystationOptions } from '~/composables/game/paystation/types';
import { useNuxtApp } from 'nuxt/app';

const usePaystation = () => {
	const { $events } = useNuxtApp();

	const openPaystation = (options: OpenPaystationOptions) => {
		const { token, isSandbox } = options;

		const paystationOptions = {
			access_token: token,
			sandbox: Boolean(isSandbox),
			lightbox: {
				spinner: 'round',
			},
			iframeOnly: true,
		};

		$events.emit('paystation:opened', true);

		window.XPayStationWidget.init(paystationOptions);
		window.XPayStationWidget.open();
	};

	return {
		openPaystation,
	};
};

export default usePaystation;
