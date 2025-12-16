<template>
	<div
		class="modal"
		:class="{ 'with-header-overlap': overlapHeader }"
		@click="$emit('close-sub')">
		<div class="modal__wrapper" @click.stop>
			<header class="modal__header">
				<h2>{{ $t('subscription.subscriptionGift') }}</h2>
				<button class="close modal__close" color="dark" @click="$emit('close-sub')">
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

				<div v-else class="modal-form">
					<div class="modal-form__row">
						<label>{{ $t('subscription.subscription') }}</label>

						<div class="custom-select" v-bind:class="{ open: isSelectOpen }">
							<button
								class="custom-select__toggle"
								@click="isSelectOpen = !isSelectOpen">
								<div class="custom-select__active">
									<span class="custom-select__name">{{
										activeGiftData?.title
									}}</span>
									-
									<span class="custom-select__time">{{
										activeGiftData?.period
									}}</span>
									-
									<span class="custom-select__cost"
										>{{ activeGiftData?.price?.amount
										}}{{ currencySymbol }}</span
									>
								</div>
								<svg
									class="custom-select__arrow"
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M17.5833 7.39584L10.5833 14.4167C10.5 14.5 10.4097 14.5589 10.3125 14.5933C10.2153 14.6283 10.1111 14.6458 10 14.6458C9.88889 14.6458 9.78473 14.6283 9.68751 14.5933C9.59028 14.5589 9.5 14.5 9.41667 14.4167L2.39584 7.39584C2.20139 7.2014 2.10417 6.95834 2.10417 6.66668C2.10417 6.37501 2.20834 6.12501 2.41667 5.91668C2.625 5.70834 2.86806 5.60418 3.14584 5.60418C3.42362 5.60418 3.66667 5.70834 3.875 5.91668L10 12.0417L16.125 5.91668C16.3194 5.72223 16.5589 5.62501 16.8433 5.62501C17.1283 5.62501 17.375 5.72918 17.5833 5.93751C17.7917 6.14584 17.8958 6.3889 17.8958 6.66668C17.8958 6.94445 17.7917 7.18751 17.5833 7.39584Z"
										fill="white" />
								</svg>
							</button>
							<ul class="custom-select__content">
								<li
									v-for="gift of giftData"
									:key="gift?.item_id"
									@click="updateActiveGift(gift)"
									class="custom-select__option"
									v-bind:class="
										activeGiftData?.item_id === gift?.item_id ? 'isActive' : ''
									">
									<span class="custom-select__name">{{ gift?.title }}</span>
									-
									<span class="custom-select__time">{{ gift?.period }}</span>
									-
									<span class="custom-select__cost"
										>{{ gift?.price?.amount }}{{ currencySymbol }}</span
									>
								</li>
							</ul>
						</div>
					</div>
					<div class="modal-form__row" :class="userFormClass">
						<label for="gifting-mail">{{ $t('subscription.friendEmail') }}</label>
						<input
							:state="userFormClass"
							type="text"
							class="form-input"
							id="gifting"
							size="full-width"
							v-model="friendVal"
							:placeholder="$t('subscription.enterEmail')" />
						<p class="modal-form__message error">
							{{ $t('subscription.playerNotFound') }}
						</p>
					</div>

					<div class="modal-form__buttons">
						<LButton
							type="submit"
							variant="accent"
							@click="$emit('openSubGiftPS', receiverUser)"
							:disabled="nextPSButtonDisabled">
							{{ $t('common.next') }}
						</LButton>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import LButton from '~/components/base/v2/l-button.vue';

defineProps({
	loading: {
		type: Boolean,
	},
	currencySymbol: {
		type: String,
	},
	giftData: {
		type: Array,
	},
	activeGiftData: {
		type: Object,
	},
	overlapHeader: {
		type: Boolean,
	},
});

const emit = defineEmits(['updateActiveGift', 'openSubGiftPS', 'close-sub']);

const { $api } = useNuxtApp();

const isSelectOpen = ref(false);
const userFormClass = ref('');
const friendVal = ref('');
const nextPSButtonDisabled = ref(true);
const receiverUser = ref('');

function updateActiveGift(gift) {
	isSelectOpen.value = false;
	emit('updateActiveGift', gift);
}

watch(friendVal, (newVal) => {
	nextPSButtonDisabled.value = true;
	userFormClass.value = '';

	setTimeout(async (_) => {
		if (friendVal.value !== newVal || newVal.length <= 3) {
			return;
		}

		const data = await $api.findUser(encodeURIComponent(friendVal.value));

		if (data?.status !== true) {
			userFormClass.value = 'error';
			return;
		}

		nextPSButtonDisabled.value = false;
		userFormClass.value = 'success';
		receiverUser.value = data?.receiver;
	}, 1000);
});
</script>

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
	min-height: 375px;
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

.modal__content {
}

.modal-form__row {
	margin: 0 0 25px 0;

	label {
		display: block;
		margin: 0 0 5px 0;
		color: #a09cb9;
	}

	&.error {
		.form-input {
			border-color: #ff1f00;
			background: #393352;

			&:hover {
				background: #3b3758;
				border-color: #ff6b00;
			}
		}

		.modal-form__message {
			display: block;
			color: #c00a0a;
		}
	}

	&.success {
		.form-input {
			border-color: #5bab46;

			&:hover {
				border-color: #61c248;
				background: #2d3358;
			}
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
}

.gifting-banner {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	width: 100%;
	padding: 20px;
	min-height: 93px;
	border-radius: 5px;
	border: 1px solid #2e2a4d;
	background: #0a0a0a;
	background-repeat: no-repeat;
	background-size: cover;
}

.gifting-banner__title {
	margin: 0 0 5px 0;
	color: #db9909;
	font-size: 16px;
	font-style: normal;
	font-weight: 500;
	line-height: 15px;
	text-transform: uppercase;
	font-family:
		EB Garamond,
		Serif;
}

.gifting-banner__text {
	color: #fff;
	text-shadow: 0px 4px 34px rgba(0, 0, 0, 0.86);
	font-family:
		EB Garamond,
		Serif;
	font-size: 14px;
	font-style: normal;
	font-weight: 500;
}

.form-input {
	width: 100%;
	padding: 12px 15px;
	border: 1px solid var(--reskin-primary-neutral-color);
	background: var(--reskin-tertiary-dark-color);
	color: var(--white);
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;

	&::placeholder {
		color: var(--reskin-primary-gray);
	}

	& + .modal-form__message {
		padding-top: 5px;
	}

	&:focus,
	&:active {
		border-color: var(--reskin-primary-light-color);
		background: var(--reskin-tertiary-dark-color);
	}

	&:hover:not(:disabled) {
		border-color: var(--reskin-hover-secondary-dark-color);
		background: #2d3358;
	}
}

.modal-form__buttons {
	display: flex;
	align-items: center;
	justify-content: flex-end;

	button {
		width: 145px;
	}
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
</style>
