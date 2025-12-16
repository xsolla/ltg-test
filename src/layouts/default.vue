<script setup>
import { useBanner } from '../composables/banner';
import TheHeader from '@/components/the-header.vue';
import TheHeaderNew from '@/components/the-header-new.vue';
import TheFooter from '@/components/the-footer.vue';
import XsollaModalAuth from '@/components/xsolla-modal-auth.vue';
import { useNewsletterConsent } from '~/composables/newsletter-consent';
import { ref, watch } from 'vue';
import { NEWSLETTER_CONSENT_INPUT_CONTAINER_UNMOUNT_TIMEOUT_MS } from '~/constants/newsletter-consent';
import NewsletterConsentModal from '~/components/game/newsletter-consent/newsletter-consent-modal.vue';
import NewsletterConsentSnackbar from '~/components/game/newsletter-consent/newsletter-consent-snackbar.vue';

const showXsollaModalAuth = useState('showXsollaModalAuth');
const user = useState('user');
const route = useRoute();

const {
	isVisible: isNewsletterConsentVisible,
	remindLater,
	declineConsent,
} = useNewsletterConsent(true);

const isNewsletterConsentModalVisible = ref(false);

watch(isNewsletterConsentVisible, () => {
	if (!isNewsletterConsentVisible.value) {
		setTimeout(() => {
			isNewsletterConsentModalVisible.value = isNewsletterConsentVisible.value;
		}, NEWSLETTER_CONSENT_INPUT_CONTAINER_UNMOUNT_TIMEOUT_MS);
	}
});

const { $events, $api } = useNuxtApp();

const banner = ref(null);
const showBanner = ref(false);

let intervalId = null;
let timeoutRemaining = 0;

const paystationEvents = {};

$events.on('paystation:opened', () => {
	paystationEvents['opened'] = true;

	// Если таймер идет, поставить его на паузу
	if (intervalId) {
		clearInterval(intervalId);
	}
});

// Ивенты по простым модалкам
// Например, на странице игры: покупка подписки без авторизации с вводом email
$events.on('modal:opened', () => {
	paystationEvents['opened'] = true;

	// Если таймер идет, поставить его на паузу
	if (intervalId) {
		clearInterval(intervalId);
	}
});

$events.on('paystation:closed', () => {
	paystationEvents['closed'] = true;

	// Если есть таймер на паузе, возобновить его
	// При условии, что не было покупки
	if (!paystationEvents['purchased'] && intervalId) {
		runInterval(() => (showBanner.value = true));
	}
});

$events.on('modal:closed', () => {
	paystationEvents['closed'] = true;

	// Если есть таймер на паузе, возобновить его
	// При условии, что не было покупки
	if (!paystationEvents['purchased'] && intervalId) {
		runInterval(() => (showBanner.value = true));
	}
});

$events.on('paystation:purchased', () => {
	paystationEvents['purchased'] = true;

	// Если есть таймер активный или на паузе, удалить его
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
		timeoutRemaining = 0;
	}
});

function runInterval(callback, subtractor = 1, step = 1000) {
	if (timeoutRemaining === 0) {
		return callback();
	}

	intervalId = setInterval(() => {
		timeoutRemaining = timeoutRemaining - subtractor;

		if (timeoutRemaining < 1) {
			callback();
			clearInterval(intervalId);
		}
	}, step);
}

function checkIfBannerAlreadySeen() {
	const value = localStorage.getItem(banner.value?.ltg_source);
	return value != null;
}

const onNewsletterConsentRemindLaterClick = () => {
	remindLater();
};

const onNewsletterConsentCloseClick = () => {
	const options = user.value
		? {
				email: user.value.data.email,
				source: 'platform-popup',
			}
		: null;

	declineConsent(options);
};

const onNewsletterConsentModalCloseClick = () => {
	isNewsletterConsentModalVisible.value = false;
};

const onNewsletterConsentSubscribeClick = () => {
	isNewsletterConsentModalVisible.value = true;
};

onMounted(async () => {
	banner.value = await useBanner();
	const alreadySeen = checkIfBannerAlreadySeen();
	if (!alreadySeen && typeof banner.value?.timeout === 'number' && banner.value?.timeout > 0) {
		timeoutRemaining = banner.value.timeout;
		runInterval(() => (showBanner.value = true));
		return;
	}
	// Если timeout в баннере не указан, то показываем сразу же
	if (!alreadySeen) {
		showBanner.value = true;
	}
});
</script>
<template>
	<div class="w-ab-100 fd-c">
<!--		<TheHeader />-->
		<TheHeaderNew />
		<div style="min-height: 100vh">
			<NuxtPage class="pb-10" />
		</div>
		<Transition name="layout">
			<ClientOnly>
				<XsollaModalAuth v-if="showXsollaModalAuth" />
			</ClientOnly>
		</Transition>
		<TheFooter />
		<MetaframeBalanceModal />
		<Banner v-if="banner && showBanner" :banner="banner" @close="banner = null" />
		<NewsletterConsentSnackbar
			@subscribe="onNewsletterConsentSubscribeClick"
			@remind-later="onNewsletterConsentRemindLaterClick"
			@close="onNewsletterConsentCloseClick"
			v-if="isNewsletterConsentVisible" />

		<NewsletterConsentModal
			v-if="isNewsletterConsentModalVisible"
			@close="onNewsletterConsentModalCloseClick" />
	</div>
</template>
