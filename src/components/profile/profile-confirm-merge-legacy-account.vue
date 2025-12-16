<template>
	<BaseModal :is-opened="true" @close="close" :title="$t('mergeAccount.confirm.title')">
		<div>
			<BaseLoading v-if="loading" type="circle" style="padding: 25px 0" />
			<div v-else-if="showConfirm">
				<p class="result-message" v-html="result?.message"></p>

				<i18n-t keypath="mergeAccount.warn.message" tag="p" class="info-card__desc">
					<span style="font-weight: bold; color: #ecd667">
						{{ $t('mergeAccount.warn.accent') }}
					</span>
				</i18n-t>
				<div class="buttons_group">
					<LButton @click="confirmMergingAccount" variant="accent">
						{{ $t('mergeAccount.confirm.button-0') }}
					</LButton>
					<LButton @click="close" variant="accent">
						{{ $t('mergeAccount.confirm.button-1') }}
					</LButton>
				</div>
				<div style="padding-top: 25px">
					<i18n-t keypath="mergeAccount.agreement" tag="p" class="info-card__desc">
						<span>
							{{ $t('mergeAccount.confirm.button-0') }}
						</span>
						<a :href="balanceRestorationTerms" target="_blank">
							{{ $t('mergeAccount.terms') }}
						</a>
					</i18n-t>
				</div>
			</div>
			<div v-else>
				<p class="result-message" v-html="result?.message"></p>
				<div style="display: flex">
					<LButton
						variant="accent"
						@click="close"
						small
						style="width: 50%; margin-left: auto">
						{{ $t('mergeAccount.confirm.close') }}
					</LButton>
				</div>
			</div>
		</div>
	</BaseModal>
</template>
<script setup>
import LButton from '~/components/base/v2/l-button.vue';
import { IS_LIF_COINS_MODAL_VISIBLE_STATE_KEY } from '~/constants/state-keys';

const lifCoinsModalVisible = useState(IS_LIF_COINS_MODAL_VISIBLE_STATE_KEY)
const emit = defineEmits(['close', 'merged']);

const { $api } = useNuxtApp();
const route = useRoute();
const router = useRouter();

const loading = ref(false);

const result = reactive({
	message: '',
	success: false,
});

const showConfirm = ref(false);
let launcherUrl = null;

async function close() {
	if (result.success && !showConfirm.value) {
		try {
			lifCoinsModalVisible.value = true
			window.metaframe.partnerActions.openCustomMiniApp({
				miniAppName: 'Balance'
			})
		} catch (e) {}

		if (launcherUrl) {
			await navigateTo(launcherUrl, {
				external: true,
			});
		}
	}

	router.push({
		query: {},
	});

	emit('close');
}

const payload = {
	game: 'life-is-feudal',
};

async function checkLegacyUserBeforeMerge() {
	loading.value = true;

	const token = route.query.confirm_token ? route.query.confirm_token.toString() : null;

	if (route.query.to) {
		launcherUrl = route.query.to;
	}

	const steamParams = parseSteamParams();

	if (token) {
		payload.token = token;
	}

	if (steamParams['openid.sig']) {
		payload.steamParams = steamParams;
	}

	const currency = useState('currency');

	const { success, message } = await $api.checkLegacyUserBefore(payload, currency.value);

	result.message = message;
	result.success = success;

	loading.value = false;

	showConfirm.value = success;
}

async function confirmMergingAccount() {
	loading.value = true;
	const currency = useState('currency');

	const { success, message } = await $api.confirmMergeLegacyAccount(payload, currency.value);

	result.message = message;
	result.success = success;

	loading.value = false;
	showConfirm.value = false;

	if (success) {
		emit('merged', {
			is_merged: true,
			confirmation_at: new Date(),
			game: 'life-is-feudal',
		});
	}
}

function parseSteamParams() {
	const params = {
		'openid.assoc_handle': route.query['openid.assoc_handle'],
		'openid.signed': route.query['openid.signed'],
		'openid.sig': route.query['openid.sig'],
		'openid.ns': route.query['openid.ns'],
		'openid.mode': 'check_authentication',
	};

	route.query['openid.signed']?.split(',').forEach((key) => {
		params[`openid.${key}`] = route.query[`openid.${key}`];
	});

	return params;
}

onMounted(() => checkLegacyUserBeforeMerge());
</script>
<style lang="scss" scoped>
@import 'assets/css/variables.scss';
.result-message {
	color: #fff;
	font-size: 14px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	margin-bottom: 25px;
	word-break: keep-all;
	white-space: pre-line;
}
.result-message :deep(a) {
	text-decoration: underline;
	font-style: normal;
	font-weight: 500;
}

.result-message :deep(.coins-result) {
	color: #ecd667;
	font-weight: bold;
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
		align-items: flex-start;
		margin-top: 25px;
		button {
			width: 100%;
		}
	}
}
</style>
