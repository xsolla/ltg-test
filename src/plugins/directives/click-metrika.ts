type Analytics = {
	elementClick: (...params: unknown[]) => void;
};

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive('click-metrika', {
		beforeMount(el, binding) {
			// if (nuxtApp.$config.public.ENV !== 'production') return;
			if (!binding?.value?.name) {
				return;
			}
			const { name, exv, ev } = binding.value;
			el.addEventListener('click', () => {
				(nuxtApp.$xsollaAnalytics as Analytics).elementClick(name, { exv, ev });
			});
		},
	});
});
