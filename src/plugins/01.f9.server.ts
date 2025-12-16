import { getF9PluginInstance } from '~/utils/f9.template';

export default defineNuxtPlugin(() => {
	const f9 = getF9PluginInstance();

	return {
		provide: {
			f9,
		},
	};
});
