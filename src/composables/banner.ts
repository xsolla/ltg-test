import type { Banner } from '@/types';
export async function useBanner() {
	const { $api } = useNuxtApp();

	const ltgSource = useRoute().query?.ltg_source as string;
	if (!ltgSource) {
		return null;
	}

	return await $api.getBanner(ltgSource);
}
