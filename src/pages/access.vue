<script setup>
import { useSetAuth } from '@/composables/auth';
import { getJwtBodyFromToken } from '~/utils/jwt';

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();
const config = useRuntimeConfig();

const fromLanding =
	typeof document !== 'undefined' && document.referrer === 'https://lifmmo.ltg.com/';

function getRedirectUrl() {
	if (route.query.to) {
		if (!/\b(http|https)/.test(route.query.to)) {
			return route.query.to.toString();
		}
	}
	if (route.query.redirect_to) {
		return decodeURIComponent(route.query.redirect_to.toString());
	}
	return '/';
}

async function performRedirectAfterAuth() {
	const redirectUrl = getRedirectUrl();
	if (redirectUrl.startsWith('http')) {
		if (typeof window !== 'undefined') {
			window.location = redirectUrl;
		}
		return;
	}
	await router.push({
		path: getRedirectUrl(),
		query: {
			...route.query,
			redirect_to: undefined,
			to: undefined,
			ltg_code: undefined,
			token: undefined,
			from_landing: fromLanding ? 'true' : undefined,
		},
	});
}

async function setAuth(token) {
	// TODO: when metaframe will support 'refresh' event, delete this line, and uncomment lines in useSetAuth
	if (typeof document !== 'undefined') {
		document.cookie = `${authTokenCookieKey}=${token}; expires=session; path=/`;
	}

	await useSetAuth(token);

	performRedirectAfterAuth();
}

if (route.query['ltg_code']) {
	const ltg_code = useCookie('ltg_code');
	ltg_code.value = route.query['ltg_code'];
}

const exchangeExternalToken = async (token) => {
	const data = await $api.exchangeBabkaToken(token, config.public.LOGIN_PROJECT_ID);
	return data.token;
};

const parseToken = async (token) => {
	const tokenBody = getJwtBodyFromToken(token);
	if (tokenBody.xsolla_login_project_id === config.public.LOGIN_PROJECT_ID) {
		return { token, isNoMetaframeFlow: false };
	}
	const exchangedToken = await exchangeExternalToken(token);
	return { token: exchangedToken, isNoMetaframeFlow: true };
};

const postUpdateToMetaframe = (token) => {
	if (typeof window !== 'undefined') {
		window.postMessage({ type: '@xsolla-login/sdk:login:success', params: { token } });
	}
};

if (route.query.token) {
	const { token, isNoMetaframeFlow } = await parseToken(route.query.token);
	if (isNoMetaframeFlow) {
		postUpdateToMetaframe(token);
	}
	setAuth(token);
} else {
	await router.push({
		path: '/',
		query: {
			...route.query,
			to: undefined,
			ltg_code: undefined,
			token: undefined,
			from_landing: fromLanding ? 'true' : undefined,
		},
	});
}
</script>

<template>
	<div class="access-page">
		<span>
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
					opacity=".5" />
				<path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
					<animateTransform
						attributeName="transform"
						dur="1s"
						from="0 12 12"
						repeatCount="indefinite"
						to="360 12 12"
						type="rotate" />
				</path>
			</svg>
		</span>

		<h2 class="">{{ $t('access.title') }}</h2>
	</div>
</template>

<style lang="css">
.access-page {
	display: flex;
	flex-direction: column;
	place-content: center;
	justify-items: center;
	align-items: center;
	height: 100vh;
	width: 100%;
	color: white;
	text-align: center;
}

.access-page span {
	margin-bottom: 15px;
}

.access-page h2 {
	margin-bottom: 10px;
	font-size: 30px;
	font-weight: 800;
	text-transform: uppercase;
}

@media screen and (max-width: 768px) {
	.access-page h2 {
		font-size: 24px;
	}
}
</style>
