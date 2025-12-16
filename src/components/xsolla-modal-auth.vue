<script setup>
import useXsollaLogin from '@/composables/xsolla';

defineProps({
	overlapHeader: {
		type: Boolean,
		default: true,
	},
});

const { $i18n } = useNuxtApp();
const route = useRoute();
const widget = await useXsollaLogin(route.fullPath);

onMounted(() => {
	if (!widget || typeof window === 'undefined') {
		return;
	}
	widget.mount('login-widget-wrapper');
});
onUnmounted(() => {
	if (!widget || typeof window === 'undefined') {
		return;
	}
	widget.unmount();
});

const showXsollaModalAuth = useState('showXsollaModalAuth', () => false);

const authTip = computed(() => {
	const guide = $i18n.t('auth.guide');
	const tip = $i18n.t('auth.tip', {
		guide: `<a href="/news/21" style="color: #8576fd;" target="_blank">${guide}</a>`,
	});
	return tip;
});
</script>

<template>
	<div class="bg-b modal" :class="{ 'with-header-overlap': overlapHeader }">
		<div class="cnt-b">
			<button class="close" color="dark" @click="showXsollaModalAuth = false">
				<img class="" src="/icons/close.svg" alt="close" />
			</button>
			<p class="modal_title">{{ $t('auth.title') }}</p>
			<p class="modal_sub_title">
				{{ $t('auth.desc') }}
			</p>
			<div id="login-widget-wrapper" class="of-h"></div>
			<p class="modal_sub_info" v-html="authTip"></p>
		</div>
	</div>
</template>

<style scoped lang="scss">
.bg-b {
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100vh;
	background-color: rgba(18, 15, 44, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
}

.cnt-b {
	background-color: var(--reskin-primary-dark-color);
	padding: 30px;
	font-size: 14px;
	max-width: 399px;
}

.cnt-b > p {
	word-break: initial;
}

.close {
	position: absolute;
	width: 24px;
	height: 24px;
	top: 30px;
	right: 30px;
	z-index: 1;
}

.close img {
	width: 100%;
	height: 100%;
}

#login-widget-wrapper {
	height: 76px;
	margin-bottom: 15px;
}

.modal_title {
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 22px;
	line-height: 1.2;
}

.modal_sub_title {
	font-size: 14px;
	font-weight: 500;
	line-height: 1.71;
	color: #c6c5cd;
}

.modal_sub_info {
	font-size: 12px;
	font-weight: 500;
	line-height: 1.83;
	color: #c6c5cd;
	margin-top: 0;
}

.modal_sub_info a {
	color: #8576fd;
}
</style>
