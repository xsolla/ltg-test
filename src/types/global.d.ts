import type { Metaframe } from './metaframe';
import type { GDPR } from '~/types/gdpr';
import type { Paystation } from '~/types/paystation';
import type { Device } from '@nuxtjs/device/runtime/types';

declare global {
	interface Window {
		metaframe: Metaframe;
		GDPR: GDPR;
		XPayStationWidget: Paystation;
	}
}

declare module '#app' {
	interface NuxtApp {
		$device: Device;
	}
}
