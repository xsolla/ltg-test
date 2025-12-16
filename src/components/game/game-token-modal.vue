<script setup lang="ts">
import LInput from '~/components/base/l-input.vue';
import LButton from '~/components/base/v2/l-button.vue';

import Link from '../base/link.vue';

const emits = defineEmits(['close', 'submit']);
const props = defineProps({
	title: String,
	overlapHeader: {
		type: Boolean,
		default: true,
	},
	planId: {
		type: String,
		default: null,
	},
});

const { $i18n, $api } = useNuxtApp();
const route = useRoute();

const email = ref('');
const loading = ref(false);
const hasError = ref(false);

const currency = useState<string>('currency');

const privacies = reactive([
	{
		name: $i18n.t('privacyPolicyConfirmation.privacyAndCookiesPolicy'),
		to: '/privacy-policy',
		checked: false,
	},
	{
		name: $i18n.t('privacyPolicyConfirmation.termsOfService'),
		to: '/terms-of-service',
		checked: false,
	},
]);

const privaciesAccepted = computed(() => {
	return privacies.every((p) => p.checked);
});

const emailValid = computed(() => {
	return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(email.value);
});

const slug = route.params.slug?.toString();

async function getToken() {
	if (!emailValid.value || !privaciesAccepted.value || !slug) {
		return;
	}

	loading.value = true;
	hasError.value = false;

	const res = await $api.getTokenV2({
		type: 'discount',
		currency: currency.value,
		email: email.value,
		slug,
		plan_id: props.planId,
	});

	loading.value = false;

	if (!res.token) {
		hasError.value = true;
		return;
	}

	emits('submit', res);
}
</script>

<template>
	<div class="modal" :class="{ 'with-header-overlap': overlapHeader }" @click="$emit('close')">
		<div class="modal__wrapper" @click.stop>
			<header class="modal__header">
				<h2>{{ title }}</h2>
				<button class="close modal__close" color="dark" @click="$emit('close')">
					<img class="" src="/icons/close.svg" alt="close" />
				</button>
			</header>
			<div class="modal__content">
				<span v-if="loading">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						class="wrapper-icon">
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
				<div v-else-if="hasError" class="modal-form">
					<div class="modal-form__row error">
						<h3>{{ $t('common.somethingWentWrong') }}</h3>
						<p>{{ $t('common.500') }}</p>
					</div>
				</div>

				<div v-else class="modal-form">
					<div class="modal-form__row">
						<label for="token-user-email">{{ $t('subscription.enterEmail') }}</label>
						<LInput
							size="full-width"
							type="text"
							id="token-user-email"
							v-model="email"
							placeholder="johndoe@gmail.com" />

						<div class="modal-checkboxes">
							<div class="row" v-for="(privacy, index) in privacies" :key="index">
								<label :for="`privacy-${index}`">
									<input
										type="checkbox"
										:name="`privacy-${index}`"
										:id="`privacy-${index}`"
										v-model="privacy.checked" />
									<span>
										<Link :to="privacy.to" :target="'_blank'">
											{{ privacy.name }}
										</Link>
									</span>
								</label>
							</div>
						</div>
					</div>

					<div class="modal-form__buttons">
						<LButton
							type="submit"
							:disabled="!emailValid || !privaciesAccepted"
							variant="accent"
							@click="getToken">
							{{ $t('common.next') }}
						</LButton>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(18, 15, 44, 0.8);
}

.modal__wrapper {
	width: 100%;
	max-width: 393px;
	max-height: 375px;
	height: 100%;
	padding: 30px;
	background-color: var(--reskin-primary-dark-color);
}

.modal__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 0 0 28px 0;

	h2 {
		margin: 0;
		font-size: 18px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
	}
}

.modal__close {
	width: 24px;
	height: 24px;
	transition: opacity linear 0.2s;

	img {
		width: 100%;
	}

	&:hover {
		opacity: 0.7;
	}
}

.modal__content,
.modal-form {
	height: 100%;
}

.modal-form__row {
	margin: 0 0 25px 0;

	label {
		display: block;
		margin: 0 0 5px 0;
		color: #a09cb9;
	}

	&.error {
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 70%;

		h3 {
			font-size: 16px;
			margin-bottom: 10px;
			font-weight: 500;
			font-style: normal;
			line-height: normal;
			color: white;
		}

		p {
			opacity: 90%;
			font-size: 12px;
			font-style: normal;
			line-height: normal;
			color: white;
		}

		.form-input {
			border-color: #c00a0a;
		}
	}

	&.success {
		.form-input {
			border-color: #375f06;
		}
	}
}

.modal-form__message {
	display: none;
	margin: 0;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	color: white;
}

.form-input {
	width: 100%;
	padding: 12px 15px;
	border-radius: 5px;
	border: 1px solid #2e2a4d;
	background: #1a1736;
	color: #fff;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;

	& + .modal-form__message {
		padding-top: 5px;
	}

	&:focus,
	&:active {
		border-color: #2e2a4d;
	}
}

.modal-form__buttons {
	margin-top: 40px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.custom-select {
	width: 100%;
}

.wrapper-icon {
	width: 32px;
	height: 32px;
	margin-left: 45%;
	margin-top: 30%;
}

.modal-form__row .modal-checkboxes {
	font-family: 'Montserrat';
	font-style: normal;
	font-weight: 500;
	font-size: 13px;
	line-height: 24px;
	color: #8576fd;
	width: 100%;
	margin-bottom: 15px;
}

.modal-form__row .modal-checkboxes .row {
	width: 100%;
	margin-bottom: 15px;
	top: 15px;
}

.modal-form__row .modal-checkboxes .row a {
	text-decoration: underline;
}

.modal-form__row .modal-checkboxes .row label {
	display: grid;
	grid-template-columns: 1em auto;
	gap: 1.5em;
}

.modal-form__row .modal-checkboxes .row input[type='checkbox'] {
	/* Add if not using autoprefixer */
	-webkit-appearance: none;
	/* Remove most all native input styles */
	appearance: none;
	margin: 0;
	width: 23px;
	height: 23px;

	background: var(--reskin-tertiary-dark-color);
	border: 1px solid var(--reskin-primary-neutral-color);
	position: relative;
}

.modal-form__row .modal-checkboxes .row input[type='checkbox']::before {
	content: '';
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
}

.modal-form__row .modal-checkboxes .row input[type='checkbox']:checked::before {
	background-image: url('public/icons/checkbox-mark.svg');
	background-size: 13px 16px;
	background-repeat: no-repeat;
	background-position: center;
}

.modal-form__row .modal-checkboxes .row input[type='checkbox']:focus {
	outline: 0;
	outline-offset: 0;
	background: var(--reskin-quaternary-dark-color);
	border: 1px solid var(--reskin-secondary-neutral-color);
}
</style>
