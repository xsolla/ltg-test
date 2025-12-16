<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import type { Game, PriceDisplayData, UserSubscription } from '~/types/game';
import type { PaystationTokenData, Promocode, UserData } from '~/types';
import { Translation, useI18n } from 'vue-i18n';
import LButton from '~/components/base/v2/l-button.vue';
import usePaystation from '~/composables/game/paystation';
import PromocodeSelector from '~/components/game/promocode/promocode-selector.vue';
import { useState } from 'nuxt/app';
import { useShowLogin } from '~/composables/login';
import MonthsPriceText from '~/components/game/purchase-block/months-price-text.vue';
import Loader from '~/components/game/purchase-block/loader.vue';

type Props = {
	game: Game;
	activeSubscription?: UserSubscription | null;
	priceDisplayData: PriceDisplayData | null;
	paystationTokenData: PaystationTokenData;
	selectedPromocode: Promocode | null;
	isLoadingPriceData: boolean;
	promocodes: Promocode[];
};

type Emits = {
	(eventName: 'promocode-selected', item: Promocode | null): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const { openPaystation } = usePaystation();
const user = useState<{ data: UserData }>('user');

const buttonMetricsData = computed(() => {
	const eventName =
		props.selectedPromocode?.type === 'subscription'
			? 'xpp_game_trial_click'
			: 'xpp_game_purchase_click';

	return {
		name: eventName,
		ev: props.game._id,
	};
});

const buttonDataPixel = computed(() => {
	const slug = props.game.path.replace('/', '');

	return `${props.game.settings.type}-${slug}`;
});

const buttonText = computed(() => {
	if (props.selectedPromocode?.type === 'subscription') {
		return t('game.activateTrial');
	}

	return props.game.settings.type === 'subscription' ? t('game.subscribe') : t('game.buy');
});

const onPromocodeSelected = (promocode: Promocode | null) => {
	emit('promocode-selected', promocode);
};

const onPurchaseButtonClick = () => {
	if (!user.value?.data) {
		useShowLogin();
	}

	const { sandbox_mode, token } = props.paystationTokenData;

	if (!token) {
		return;
	}

	openPaystation({
		token,
		isSandbox: sandbox_mode,
	});
};

const hasNonDefaultPlan = computed(() => {
	return props.priceDisplayData?.monthCount && props.priceDisplayData?.monthCount !== 1;
});
</script>

<template>
	<div :class="$style.container">
		<LButton
			:disabled="isLoadingPriceData"
			variant="accent-gradient"
			@click="onPurchaseButtonClick"
			:data-pixel="buttonDataPixel"
			v-click-metrika="buttonMetricsData">
			{{ buttonText }}
		</LButton>

		<div
			:class="[
				$style.dataContainer,
				{
					[$style.isLoading]: isLoadingPriceData,
				},
			]">
			<Loader v-if="isLoadingPriceData" />

			<template v-if="selectedPromocode?.type === 'subscription' && priceDisplayData">
				<p :class="$style.trialDataText">
					<span>
						{{
							t('game.firstDays', {
								qty: selectedPromocode.qty,
							})
						}}
					</span>
					{{ priceDisplayData.currencySymbol }}
					0
				</p>

				<p :class="[$style.trialDataText, $style.trialThenText]">
					<MonthsPriceText
						v-if="hasNonDefaultPlan"
						variant="next"
						:display-data="priceDisplayData" />

					<template v-else>
						<span>{{ t('game.then') }}</span>
						{{ priceDisplayData.currencySymbol }}
						{{ priceDisplayData.amountWithoutDiscount }}
						{{ $t('game.month') }}
					</template>
				</p>
			</template>

			<template
				v-else-if="
					priceDisplayData &&
					priceDisplayData.amountWithoutDiscount !== priceDisplayData.amount &&
					game.settings.type === 'subscription' &&
					priceDisplayData
				">
				<p :class="$style.trialDataText">
					<MonthsPriceText
						v-if="hasNonDefaultPlan"
						variant="first"
						:display-data="priceDisplayData" />

					<template v-else>
						<span>
							{{ t('game.firstMonth') }}
						</span>
						{{ priceDisplayData.currencySymbol }}
						{{ priceDisplayData.amount }}

						<span :class="[$style.saleBadge, $style.subscription]">SALE</span>
					</template>
				</p>

				<p :class="[$style.trialDataText, $style.trialThenText]">
					<MonthsPriceText
						v-if="hasNonDefaultPlan"
						variant="next"
						:display-data="priceDisplayData" />

					<template v-else>
						<span>{{ t('game.then') }}</span>
						{{ priceDisplayData.currencySymbol }}
						{{ priceDisplayData.amountWithoutDiscount }}
						{{ t('game.month') }}
					</template>
				</p>
			</template>

			<template v-else-if="priceDisplayData">
				<p
					v-if="priceDisplayData.amountWithoutDiscount !== priceDisplayData.amount"
					:class="$style.amountWithoutDiscountText">
					<del
						>{{ priceDisplayData.currencySymbol }}
						{{ priceDisplayData.amountWithoutDiscount }}</del
					>
					<span :class="$style.saleBadge">{{ t('game.sale') }}</span>
				</p>

				<p :class="$style.amount">
					<template v-if="game.settings.type === 'subscription'">
						<template v-if="hasNonDefaultPlan">
							{{
								`${priceDisplayData.currencySymbol}${priceDisplayData.amount} / ${
									priceDisplayData.monthCount
								} ${t('subscriptionPackages.months')}`
							}}
						</template>

						<template v-else>
							{{ priceDisplayData.currencySymbol }} {{ priceDisplayData.amount }}
							{{ t('game.month') }}
						</template>
					</template>
					<template v-else>
						{{ priceDisplayData.currencySymbol }} {{ priceDisplayData.amount }}
					</template>
				</p>
			</template>

			<PromocodeSelector
				@promocode-selected="onPromocodeSelected"
				v-if="promocodes.length"
				:promocodes="promocodes"
				:selected-promocode="selectedPromocode" />
		</div>
	</div>
</template>

<style lang="scss" module>
.container {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: var(--space-125) 0 var(--space-475);

	@media (max-width: 468px) {
		flex-wrap: wrap;
		align-items: center;
		flex-direction: column-reverse;
		gap: 10px;
		background: #1a1736;
		border-radius: 16px;
		justify-content: center;
		padding: 20px;
	}
}

.trialDataText {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 5px;
	color: var(--reskin-secondary-light-color);
	font-size: 22px;
	background: transparent;
	font-family: var(--pilat-wide-font-family);
	border-top: none;
	text-transform: uppercase;

	&,
	& > span {
		font-weight: 700;
	}

	& > span {
		margin-right: 10px;
		min-width: 270px;
		text-align: right;
	}

	@media (max-width: 768px) {
		flex-wrap: wrap;
		justify-content: flex-end;
		width: 100%;

		& > span:first-child {
			width: 100%;
			margin: 0;
		}
	}

	@media (max-width: 468px) {
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;
		text-align: center;
		width: 100%;

		& > span {
			text-align: center;
			margin: 0;
			width: 100%;
		}

		& > span:not(:last-child) {
			width: 100%;
		}
	}
}

.trialThenText {
	color: var(--card-text-color-minor);
	line-height: 20px;
	font-size: 16px;
	font-style: normal;
	text-transform: uppercase;

	@media (max-width: 468px) {
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;
		text-align: center;
		width: 100%;

		& > span {
			text-align: center;
			width: 100%;
			margin: 0;
		}

		& > span:not(:last-child) {
			width: 100%;
		}
	}
}

.dataContainer {
	gap: 10px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	min-height: 88px;

	&.isLoading {
		pointer-events: none;
		user-select: none;

		& > span:first-child {
			position: absolute;
			right: 40px;
			top: 20px;

			@media (max-width: 468px) {
				margin: auto;
				top: auto;
				left: auto;
				right: auto;
				align-self: center;
			}
		}

		& > p {
			color: transparent;

			& > span {
				visibility: hidden;
			}
		}
	}

	@media (max-width: 768px) {
		flex: 1;
	}
}

.trialThenText,
.amount {
	& + p {
		align-self: flex-end;
	}
}

.amount {
	text-align: right;
	gap: 10px;
	display: flex;
	flex-direction: column;
	margin-left: auto;
	font-size: 26px;
	text-transform: uppercase;
	font-weight: 400;
	font-family: var(--pilat-wide-font-family);

	@media (max-width: 468px) {
		margin: 0;
		align-self: center;
	}
}

.amountWithoutDiscountText {
	font-size: 18px;
	line-height: 22px;
	text-align: right;
	font-family: var(--pilat-wide-font-family);
	text-transform: uppercase;
	color: #8f94a5;
	gap: 5px;
	align-self: flex-end;
	align-items: center;
	display: flex;

	&,
	& > del {
		font-weight: 600;
	}
}

.saleBadge {
	font-weight: 700;
	font-size: 18px;
	line-height: 22px;
	align-items: center;
	text-align: center;
	text-transform: uppercase;
	color: var(--reskin-secondary-light-color);
	padding: 2px 5px;
	background: var(--badge-bg-sale);

	&.subscription {
		margin-right: 0;
		min-width: auto;
		width: auto;
	}
}
</style>
