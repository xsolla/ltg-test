<script setup>
const config = useRuntimeConfig().public;

const route = useRoute();
const router = useRouter();

const launcherUrl = ref('');

async function navigateToLauncher() {
	return await navigateTo(launcherUrl.value, {
		external: true,
	});
}

onMounted(async () => {
	const query = Object.assign({}, route.query);
	router.push({
		query: undefined,
	});

	if (query.to) {
		const url = new URL(query.to);
		for (const [key, value] of Object.entries(query)) {
			if (key !== 'to') {
				url.searchParams.append(key, value);
			}
		}
		launcherUrl.value = url.toString();
		return navigateToLauncher();
	}

	if (config.LAUNCHER_DEEP_LINK) {
		launcherUrl.value = config.LAUNCHER_DEEP_LINK;
		return navigateToLauncher();
	}
});
</script>
<template>
	<div class="launcher-page">
		<h1>Opening launcher</h1>
		<p class="open-tip">
			If launcher didn't open, <span @click="navigateToLauncher">try again</span> or
			<NuxtLink to="/download-launcher/ltg"> download launcher </NuxtLink>
		</p>
	</div>
</template>

<style lang="scss" scoped>
.launcher-page {
	display: flex;
	flex-direction: column;
	place-content: center;
	justify-items: center;
	align-items: center;
	height: 100vh;
	width: 100%;
	color: white;
	text-align: center;
	padding: 0 25px;

	.loading-icon {
		margin-bottom: 25px;
	}

	.open-tip {
		font-size: 18px;
		font-weight: 500;
		line-height: 24px;
		text-align: center;
		word-break: keep-all;
	}

	.open-tip span,
	.open-tip a {
		color: #6e7bf7;
		text-decoration: underline;
		cursor: pointer;
	}
}

.launcher-page h1 {
	margin-bottom: 25px;
	text-align: center;
	max-width: 750px;
	font-size: 30px;
	font-weight: 900;
	line-height: 97.5%;
	text-transform: uppercase;
	font-family: var(--pilat-wide-font-family);
	color: var(--reskin-primary-light-text-color);
}

@media screen and (max-width: 768px) {
	.launcher-page {
		padding: 0 20px;

		h2 {
			font-size: 24px;
		}
	}
}
</style>
