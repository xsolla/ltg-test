import api from '@/api';
import type { F9 } from '@augustjourney/f9';
export default defineNuxtPlugin((nuxtApp) => {
	return {
		provide: {
			api: api(nuxtApp.$f9 as F9),
		},
	};
});
