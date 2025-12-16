<script setup>
import { useBanner } from '~/composables/banner';
import TheHeader from '@/components/the-header.vue';
import TheFooter from '@/components/the-footer.vue';
import XsollaModalAuth from '@/components/xsolla-modal-auth.vue';
import TheHeaderNew from '~/components/the-header-new.vue';

const showXsollaModalAuth = useState('showXsollaModalAuth');
const user = useState('user');
const route = useRoute();

const { $api } = useNuxtApp();

const banner = ref(null);
const showBanner = ref(false);

let intervalId = null;
let timeoutRemaining = 0;

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
	<div class="w-ab-100 fd-c" style="display: flex; flex-direction: column">
		<TheHeaderNew :forceOpacityOnMobile="true"/>
		<NuxtPage />
		<Transition name="layout">
			<ClientOnly>
				<XsollaModalAuth v-if="showXsollaModalAuth" />
			</ClientOnly>
		</Transition>
		<TheFooter />
		<Banner v-if="banner && showBanner" :banner="banner" @close="banner = null" />
	</div>
</template>
