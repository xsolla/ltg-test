<script setup>
import Loading from '@/components/base/base-loading.vue';
import LModal from '@/components/base/l-modal.vue';
import LButton from '~/components/base/v2/l-button.vue';
import LInput from '~/components/base/l-input.vue';
const props = defineProps({
	isLauncher: Boolean,
});
const emits = defineEmits(['promocode-applied']);

const code = ref('');
const applyPromocodeLoading = ref(false);
const error = ref('');
const successPopup = reactive({
	title: '',
	description: '',
	show: false,
});

const { $api, $xsollaAnalytics } = useNuxtApp();
const route = useRoute();

async function checkDiscountInPromocodeForLauncher(promocode) {
	if (!props.isLauncher) return null;

	if (promocode?.content?.some((i) => i.type !== 'discount_lapi')) {
		return null;
	}

	const currency = useState('currency');
	const tokenPayload = {
		currency: currency.value,
		plan_id: promocode.promocode.pack.game.plan_id,
		type: 'payment',
		slug: promocode.promocode.pack.game.path?.replace(/\//g, ''),
		promocode: promocode.promocode.code,
	};

	if (route.query.to) {
		tokenPayload['return_to'] = route.query.to;
	}

	const data = await $api.getTokenV2(tokenPayload);

	if (!data.token) return null;

	if (data.sandbox_mode) {
		return 'https://sandbox-secure.xsolla.com/paystation4?token=' + data.token;
	}

	return 'https://secure.xsolla.com/paystation4?token=' + data.token;
}

const popupButtonText = ref('Ok');
let paymentUrl = null;

async function openPaystation(url) {
	await navigateTo(url, {
		open: {
			target: '_blank',
		},
	});
}

async function applyPromocode() {
	error.value = '';
	successPopup.title = '';
	successPopup.description = '';
	successPopup.show = false;

	if (!code.value) {
		error.value = 'Promocode cannot be empty';
		return;
	}

	applyPromocodeLoading.value = true;

	const currency = useState('currency');
	const data = await $api.applyPromocode({
		code: code.value,
		source: 'ltg:profile',
		currency: currency.value,
	});

	if (data?.status === 'success') {
		$xsollaAnalytics?.elementClick('xpp_profile_promo_apply', { ev: code.value });
		code.value = '';

		paymentUrl = await checkDiscountInPromocodeForLauncher(data.detail);

		if (paymentUrl) {
			data.detail.paymentUrl = paymentUrl;
			popupButtonText.value = 'Apply';

			data.detail.successfulMessage =
				'<p>After pressing APPLY, your promo code will be used, and you will be redirected to the payment page.</p>';
		}

		if (data?.detail?.successfulMessage) {
			successPopup.title = paymentUrl ? 'Promo code activated!' : data.message;
			successPopup.description = data.detail.successfulMessage;
			successPopup.show = true;
		}
		emits('promocode-applied', data.detail);
	} else {
		error.value = data.message;
	}
	applyPromocodeLoading.value = false;
}

function onPopupButtonClick() {
	if (paymentUrl) {
		openPaystation(paymentUrl);
	}
	successPopup.show = false;
}
</script>

<template>
	<aside class="promocode">
		<form @submit.prevent="applyPromocode" class="form form--promocode">
			<label for="promocode" class="form__label">{{ $t('promocodes.title') }}</label>
			<p class="promocode__description">
				{{ $t('promocodes.desc') }}
			</p>
			<div class="form-row">
				<LInput
					v-model="code"
					size="full-width"
					type="text"
					id="promocode"
					name="promocode"
					:focus-on-mount="false"
					placeholder="xxxxx-xxxxx-xxxxx-xxxxx" />
				<LButton size="small" :disabled="!code" variant="outline">
					<template v-if="!applyPromocodeLoading">
						{{ $t('promocodes.activate') }}
					</template>

					<Loading v-else />
				</LButton>
			</div>
			<div v-if="error" class="form__message">
				<p class="error" v-html="error"></p>
			</div>
		</form>
		<LModal
			:is-opened="successPopup.show"
			:show-close-button="false"
			:title="successPopup.title"
			@close="successPopup.show = false">
			<div>
				<div class="promocode__result-message" v-html="successPopup.description"></div>
				<div style="display: flex; justify-content: flex-end">
					<LButton @click="onPopupButtonClick" variant="accent">
						{{ popupButtonText }}
					</LButton>
				</div>
			</div>
		</LModal>
	</aside>
</template>
<style lang="scss">
.form__message p.error a {
	text-decoration: underline !important;
}

.form-row {
	gap: 10px;
}

.promocode__result-message {
	p {
		color: #fff;
		font-size: 14px;
		font-style: normal;
		line-height: 20px;
		margin-bottom: 25px;
		word-break: keep-all;
		white-space: pre-line;

		a {
			text-decoration: underline;
		}
	}

	a {
		text-decoration: underline;
	}
}

#paystation-link {
	text-decoration: underline;
	cursor: pointer;
}
</style>
