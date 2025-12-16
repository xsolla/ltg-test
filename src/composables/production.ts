export function isProduction() {
	return useRuntimeConfig().public.ENV === 'production';
}
