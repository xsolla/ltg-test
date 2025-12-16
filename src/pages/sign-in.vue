<script setup lang="ts">
import { Widget } from '@xsolla/login-sdk';
import { localeCookieKey } from '~/utils/ltg';

definePageMeta({
	layout: 'sign-in',
});

const config = useRuntimeConfig();
const url = useRequestURL();
const callbackUrl = `${url.protocol}//${url.host}/access`;
const projectId = config.public.LOGIN_WIDGET_PROJECT_ID || '89c824d7-9b5d-11eb-bc85-42010aa80004';
const locale = useCookie(localeCookieKey);
const route = useRoute();
const apiUrl = config.public.LTG_API;
const router = useRouter();

const authToken = useCookie(authTokenCookieKey).value;
if (authToken) {
	router.push('/');
}

function buildCallbackUrl() {
	if (route.query.redirect_to) {
		return `${callbackUrl}?redirect_to=${route.query.redirect_to}`;
	}
	return callbackUrl;
}

function openWidget() {
	const xl = new Widget({
		projectId,
		callbackUrl: buildCallbackUrl(),
		preferredLocale: locale.value || 'en_XX',
		customStyle: `${apiUrl}/xsolla-login/styles`,
	});

	xl.mount('xl_auth');
}

onMounted(() => {
	setTimeout(() => {
		openWidget();
	}, 100);
});
</script>

<template>
	<section class="content-page">
		<div id="xl_auth" class="widget-container"></div>
	</section>
</template>

<script lang="ts">
export default {
	name: 'SignIn',
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variables.scss';

.content-page {
	padding-bottom: 0;
	padding-top: 0;
}

.widget-container {
	width: 100%;
	height: 100vh;

	@media screen and (max-width: $max-mobile) {
		height: 100vh;
	}
}
</style>
