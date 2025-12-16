<template>
	<div class="sso-page">
		<span class="sso-page__wrapper-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
		<form ref="formRef" id="jwtForm" :action="zendeskSSOUrl" method="post">
			<input ref="inputRef" id="jwtInput" type="hidden" name="jwt" />
		</form>
	</div>
</template>

<script setup>
import { useRuntimeConfig, useRoute, useRouter } from '#app';

import { useShowLogin } from '~/composables/login';
const { $api, $i18n, $events } = useNuxtApp();
const cookieLocale = useCookie(localeCookieKey);
const config = useRuntimeConfig();
const zendeskSSOUrl = `${config.public.ZENDESK_URI}/access/jwt`;
const user = useState('user');
const formRef = ref(null);
const inputRef = ref(null);
const route = useRoute();
const router = useRouter();

function redirectToSignInWithSSOParams() {
	const queryString = Object.keys(route.query)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(route.query[key])}`)
		.join('&');
	const redirectTo = `/sso${queryString ? '?' + queryString : ''}`;
	router.replace({
		path: '/sign-in',
		query: { redirect_to: redirectTo }
	});
}

onMounted(() => {
	user?.value ? SSOZendeskAuth() : redirectToSignInWithSSOParams();
});

$events.on('user:updated', (_) => {
	if (user?.value) {
		SSOZendeskAuth();
	}
});

// TODO add query || referrer for other SSO
async function SSOZendeskAuth() {
	const response = await $api.getSSOJWT('zendesk', cookieLocale.value || 'en');
	if (!response.success) {
		return false;
	} // TODO redirect to main page
	inputRef.value.value = response.data;
	formRef.value.submit();
}
</script>
<style lang="css">
.sso-page {
	min-height: 100vh;
	height: 100%;
	width: 100%;
	background-color: var(--darker-color);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.sso-page__wrapper span {
	margin-bottom: 15px;
}

.sso-page__wrapper h3 {
	font-size: 16px;
	font-weight: 500;
	margin-bottom: 10px;
}

.sso-page__wrapper p {
	font-size: 14px;
	opacity: 95%;
}

.sso-page__wrapper-icon {
	width: 32px;
	height: 32px;
	margin-bottom: 15px;
}
</style>
