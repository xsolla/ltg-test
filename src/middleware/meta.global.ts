import { pageTags } from '~/utils/meta';

export default defineNuxtRouteMiddleware(async (to) => {
	const routeName = String(to?.name);
	const url = useRequestURL();
	const title = pageTags[routeName]?.title || 'LTG Multiverse';
	const canonicalLink = `${url.protocol}//${url.host}${to.fullPath}`;

	useHead(() => ({
		title,
		meta: [{ name: 'description', content: pageTags[routeName]?.description }],
		link: [{ rel: 'canonical', href: canonicalLink }],
	}));
});
