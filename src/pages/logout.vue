<script setup>
import useXsollaLogin from '@/composables/xsolla';
import { authTokenCookieKey } from '~/utils/ltg';
const { $api, $events } = useNuxtApp();

definePageMeta({
	layout: 'clean',
});

const user = useState('user');

async function logout() {
	const xsollaToken = useCookie(authTokenCookieKey);
	localStorage.removeItem('accessTokenOverride');

	// perform simultaneous logout using promises to decrease logout time
	const logoutPromises = [];
	if (xsollaToken.value) {
		logoutPromises.push(
			// eslint-disable-next-line no-async-promise-executor
			new Promise(async (resolve) => {
				try {
					const token = xsollaToken.value;
					xsollaToken.value = null;
					const xsolla = await useXsollaLogin();
					await xsolla.api.logout(token, 'sso');
				} catch (e) {
					console.error('error during logout:', e);
				}
				// resolve every time, because if logout is unsuccessful
				// we just log error and do nothing more
				resolve();
			})
		);
	}
	logoutPromises.push(() => $api.forumLogout());
	await Promise.all(logoutPromises);

	// TODO: add composable useCookie
	const expirationDate = new Date('December 18, 1996 13:30:00');
	document.cookie = `xsolla_metaframe_token=; expires=${expirationDate};`;
	document.cookie = `zendesk_session=; expires=${expirationDate};`;
	localStorage.removeItem('currency');
	localStorage.removeItem('user');

	user.value = null;

	$events.emit('user:updated', true);

	window.location.replace('/');
}

onMounted(logout);
</script>

<template>
	<div class="logout-page">
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
	</div>
</template>

<style lang="css">
.logout-page {
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

.logout-page span {
	margin-bottom: 15px;
}
</style>
