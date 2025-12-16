<script setup lang="ts">
import { defineProps } from 'vue';
import type { PriceDisplayData } from '~/types/game';
import { Translation, useI18n } from 'vue-i18n';

const { t } = useI18n();

type Props = {
	displayData: PriceDisplayData;
	variant: 'first' | 'next';
};

const props = defineProps<Props>();

const translationKeyPaths = computed(() => {
	if (props.variant === 'first') {
		return {
			container: 'game.firstMonthsWithPrice',
			months: 'game.firstMonths',
		};
	} else {
		return {
			container: 'game.nextMonthsWithPrice',
			months: 'game.nextMonths',
		};
	}
});
</script>

<template>
	<Translation :keypath="translationKeyPaths.container">
		<template v-slot:months>
			<span>
				{{
					t(translationKeyPaths.months, {
						qty: displayData.monthCount,
					})
				}}
			</span>
		</template>

		<template v-slot:price>
			{{
				`${displayData.currencySymbol}${
					variant === 'first' ? displayData.amount : displayData.amountWithoutDiscount
				}`
			}}
		</template>
	</Translation>

	<span v-if="variant === 'first'" :class="$style.saleBadge">SALE</span>
</template>

<style lang="scss" module>
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
	width: auto;

	&:last-child {
		min-width: auto;
		margin-right: 0;
		width: auto;
	}
}
</style>
