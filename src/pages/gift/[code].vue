<template>
	<div v-if="!fromLanding || !error" class="gift-page">
		<div v-if="loading" class="gift-page__wrapper">
			<span class="gift-page__wrapper-icon">
				<SpinnerIcon />
			</span>
			<h3>{{ $t('gift.loading.title') }}</h3>
			<p>{{ $t('gift.loading.desc') }}</p>
		</div>
		<div v-else-if="error" class="gift-page__wrapper">
			<span class="gift-page__wrapper-icon">
				<WarningRoundedIcon />
			</span>
			<h3>Uh-oh</h3>
			<p v-html="error"></p>
		</div>
		<div v-else class="gift-page__wrapper">
			<span class="gift-page__wrapper-icon">
				<CheckRoundedOutlineIcon />
			</span>
			<h3>{{ $t('gift.received.title') }}</h3>
			<p v-if="data?.detail?.promocode?.autoDownloadLauncher">
				<span v-html="$t('gift.autoDownloadLauncher.desc')"></span>
			</p>
			<p v-else>{{ $t('gift.received.desc') }}</p>
		</div>
	</div>
</template>

<script setup>
import SpinnerIcon from '~/components/icon/spinner.vue';

import useLauncherDownload from '~/composables/launcher-download';
import WarningRoundedIcon from '~/components/icon/warning-rounded.vue';
import CheckRoundedOutlineIcon from '~/components/icon/ui-kit/check-rounded-outline.vue';

const DEFAULT_REDIRECT_TIMEOUT = 2000;
const FROM_LANDING_SUCCESS_REDIRECT_TIMEOUT = 15000;
const DOWNLOAD_LAUNCHER_REDIRECT_TIMEOUT = 1000;

const route = useRoute();
const router = useRouter();

const error = ref('');
const loading = ref(false);

const user = useState('user');
const currency = useState('currency');

const code = computed(() => {
	return route.params.code;
});

const fromLanding = computed(() => {
	return route.query.from_landing === 'true';
});

const { $api, $i18n } = useNuxtApp();

const showXsollaModalAuth = useState('showXsollaModalAuth');
const data = ref(null);

const { handleDownloadPageNavigation } = useLauncherDownload();
async function applyPromocode() {
	error.value = '';
	loading.value = true;

	data.value = await $api.applyPromocode({
		code: code.value.toUpperCase(),
		source: 'ltg:link',
		currency: currency.value,
	});

	loading.value = false;

	if (data.value.status !== 'success') {
		error.value = data.value.message;
	}

	return actionAfterPromocodeApplication();
}

async function actionAfterPromocodeApplication() {
	const { redirect } = route.query;

	const performRedirect = () => {
		const defaultRedirectDestination = '/';
		const redirectDestination = fromLanding.value
			? '/game/life-is-feudal'
			: data.value?.redirect_to;

		router.push(redirectDestination || defaultRedirectDestination);
	};

	if (data.value?.detail?.promocode?.autoDownloadLauncher) {
		setTimeout(() => {
			handleDownloadPageNavigation(data.value?.redirect_to?.replace('/game/', ''));
		}, DOWNLOAD_LAUNCHER_REDIRECT_TIMEOUT);
	} else {
		if (fromLanding.value) {
			if (data.value.status === 'success') {
				setTimeout(performRedirect, FROM_LANDING_SUCCESS_REDIRECT_TIMEOUT);
			} else {
				performRedirect();
			}
		} else {
			if (redirect !== 'false') {
				setTimeout(performRedirect, DEFAULT_REDIRECT_TIMEOUT);
			}
		}
	}
}

onMounted(() => {
	if (!user.value) {
		error.value = $i18n.t('common.haveToLogIn');
		showXsollaModalAuth.value = true;
		return;
	}
	applyPromocode();
});
</script>
<style lang="scss" scoped>
@import 'assets/css/themes/current';
@import 'assets/css/variables';

.gift-page {
	min-height: 100vh;
	height: 100%;
	width: 100%;
	background-color: var(--background-primary-color);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.gift-page__wrapper {
	text-align: center;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 50px 0;
}

@media screen and (max-width: 769px) {
	.gift-page__wrapper {
		width: 90%;
	}
}

.gift-page__wrapper span {
	margin-bottom: 24px;
}

.gift-page__wrapper h3 {
	margin-bottom: 24px;

	font-family: var(--pilat-wide-font-family);
	font-weight: 900;
	font-size: 50px;
	line-height: 50px;
	color: var(--text-primary-color);

	text-transform: uppercase;
}

.gift-page__wrapper p {
	font-size: 18px;
	line-height: 28px;
	font-weight: 500;
	color: var(--text-primary-color);
	word-break: break-word;

	&:deep(a) {
		color: var(--text-link-color);
	}
}

.gift-page__wrapper-icon {
	margin-bottom: 15px;
}
</style>
