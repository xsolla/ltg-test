<template>
	<div class="info-card__row">
		<div class="info-card__pic">
			<img class="p-a h-3 h-2-L h-1-XL no-select" src="/icons/lif-mmo.png" />
		</div>

		<p class="info-card__name">Life Is Feudal</p>

		<div class="buttons_group">
			<LButton
				@click="showModal = !isLifConnected"
				variant="accent"
				:disabled="isLifConnected">
				{{ isLifConnected ? $t('mergeAccount.merged') : $t('mergeAccount.mergeEmail') }}
			</LButton>

			<LButton
				v-if="!isLifConnected"
				@click="showSteamModal = !isLifConnected"
				variant="accent">
				{{ $t('mergeAccount.mergeSteam') }}
			</LButton>
		</div>

		<!-- Модальное окно с вводом email -->
		<BaseModal :is-opened="showModal" @close="close" :title="$t('mergeAccount.request.title')">
			<div>
				<p v-if="!result.message" class="info-card__desc">
					{{ $t('mergeAccount.request.desc') }}
				</p>
				<div class="email-input-form" v-if="!result.message">
					<LInput
						size="full-width"
						style="margin-bottom: 25px"
						v-model="email"
						@on-enter="mergeAccount"
						:focus-on-mount="true"
						:placeholder="$t('mergeAccount.request.emailPlaceholder')" />
					<LButton
						:disabled="isEmailValid !== true"
						style="width: 100%"
						@click="mergeAccount"
						variant="accent"
						:submit="true">
						<template v-if="!loading">{{ $t('mergeAccount.request.cta') }}</template>
						<BaseLoading v-else style="height: 14px" />
					</LButton>
				</div>
				<div v-else>
					<p class="result-message" v-html="result.message"></p>
					<div style="display: flex">
						<LButton @click="close" variant="accent" style="width: 100%">
							{{ $t('mergeAccount.request.close') }}
						</LButton>
					</div>
				</div>
				<div style="padding-top: 25px">
					<i18n-t keypath="mergeAccount.agreement" tag="p" class="info-card__desc">
						<span>
							{{ $t('mergeAccount.request.cta') }}
						</span>
						<a :href="balanceRestorationTerms" target="_blank">
							{{ $t('mergeAccount.terms') }}
						</a>
					</i18n-t>
				</div>
			</div>
		</BaseModal>

		<!-- Модальное окно для подтверждения steam merge -->
		<BaseModal
			:is-opened="showSteamModal"
			@close="close"
			:title="$t('mergeAccount.requestSteam.title')">
			<div>
				<i18n-t keypath="mergeAccount.warn.message" tag="p" class="info-card__desc">
					<span style="font-weight: bold">
						{{ $t('mergeAccount.warn.accent') }}
					</span>
				</i18n-t>
				<div class="buttons_group">
					<LButton @click="openUpSteamLogin" variant="accent">
						{{ $t('mergeAccount.requestSteam.button-0') }}
					</LButton>
					<LButton @click="close" variant="accent">
						{{ $t('mergeAccount.requestSteam.button-1') }}
					</LButton>
				</div>
				<div style="padding-top: 25px">
					<i18n-t keypath="mergeAccount.agreement" tag="p" class="info-card__desc">
						<span>
							{{ $t('mergeAccount.requestSteam.button-0') }}
						</span>
						<a :href="balanceRestorationTerms" target="_blank">
							{{ $t('mergeAccount.terms') }}
						</a>
					</i18n-t>
				</div>
			</div>
		</BaseModal>
	</div>
</template>
<script setup lang="ts">
import type { MergedAccount, MergeLegacyAcountDTO } from '@/types';
import { balanceRestorationTerms } from '@/utils/ltg';
import { useValidateEmail } from '@/composables/forms';
import LButton from '~/components/base/v2/l-button.vue';
import LInput from '~/components/base/l-input.vue';
import { isElectron } from '~/utils/platform';
const props = defineProps<{
	mergedAccounts: MergedAccount[];
	openOnMount: boolean;
	launcher?: string;
}>();

const { $api } = useNuxtApp();

const showModal = ref(props.openOnMount || false);
const showSteamModal = ref(false);

const email = ref('');
const loading = ref(false);

const isEmailValid = computed(() => useValidateEmail(email.value));

let xsollaUserId: string | null = null;

const result = reactive({
	message: '',
	success: false,
});

const isLifConnected = computed(() => {
	return props.mergedAccounts.some((a) => a?.game === 'life-is-feudal');
});

async function mergeAccount() {
	if (!isEmailValid.value) {
		return;
	}

	loading.value = true;

	const payload: MergeLegacyAcountDTO = {
		email: email.value,
		game: 'life-is-feudal',
	};

	if (props.launcher) {
		payload.launcher = props.launcher;
	}

	const currency = useState<string>('currency');

	const { success, message } = await $api.mergeLegacyAccount(payload, currency.value);

	result.message = message;
	result.success = success;
	loading.value = false;
}

async function openUpSteamLogin() {
	const steamLogin = 'https://steamcommunity.com/openid/login';

	const callbackUrl = new URL(`${window.location.origin}/profile/personal-info`);

	callbackUrl.searchParams.append('action', 'confirm-merge-account');

	if (props.launcher) {
		callbackUrl.searchParams.append('to', props.launcher);
		if (xsollaUserId) {
			callbackUrl.searchParams.append('xsollaUserId', xsollaUserId);
		}
	}

	const params = {
		'openid.ns': 'http://specs.openid.net/auth/2.0',
		'openid.mode': 'checkid_setup',
		'openid.realm': callbackUrl.origin,
		'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
		'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
		'openid.return_to': decodeURIComponent(callbackUrl.toString()),
	};

	const url = new URL(steamLogin);

	Object.entries(params).forEach(([key, value]) => {
		url.searchParams.append(key, value);
	});

	if (isElectron()) {
		await navigateTo(url.toString(), {
			open: {
				target: '_blank',
			},
		});
		return;
	}

	await navigateTo(url.toString(), {
		external: true,
	});
}

// Закрывает модалку и очищает форму
function close() {
	showModal.value = false;
	showSteamModal.value = false;
	result.message = '';
	result.success = false;
	loading.value = false;
	email.value = '';
}

const route = useRoute();

onMounted(async () => {
	if (route.query.action === 'open-lif-connect') {
		showModal.value = true;
	}
	if (route.query.token) {
		xsollaUserId = await $api.setXsollaToken(route.query.token.toString());
	}
});
</script>
<style lang="scss" scoped>
@import 'assets/css/variables.scss';

.info-card__pic img {
	width: 100%;
	height: 100%;
}

.email-input-form {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: flex-end;

	& > div {
		width: 100%;
	}
}

.info-card__name {
	@media (max-width: $max-mobile) {
		& + button {
			margin-top: 15px;
		}
	}
}

.result-message {
	color: #fff;
	font-size: 14px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	margin-bottom: 25px;
	word-break: break-word;
}

.result-message :deep(a) {
	text-decoration: underline;
	font-style: normal;
	font-weight: 500;
}

.buttons_group {
	display: flex;
	align-items: center;
	gap: 15px;

	button {
		width: max-content;
	}

	@media screen and (max-width: $mid-mobile) {
		flex-wrap: wrap;
		margin-top: 25px;
		button {
			width: 100%;
		}
	}

	@media screen and (max-width: $min-mobile) {
		align-items: flex-start;
	}
}
</style>
