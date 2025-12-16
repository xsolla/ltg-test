<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

type Variant = 'default' | 'max-discount';

type PlanProps = {
	isActive?: boolean;
	hasActive?: boolean;
};

type Props = {
	id: string;
	title: string;
	currencySymbol: string;
	variant: Variant;
	isDataLoading: boolean;
	plan?: PlanProps;
	amount: {
		monthly: number;
		total: string;
		totalWithoutDiscount?: string;
		economy?: string;
	};
};

type Emits = {
	click: [id: string];
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();

const onClick = () => {
	emit('click', props.id);
};

const callToActionText = computed(() => {
	const { isActive, hasActive } = props.plan || {};

	if (props.isDataLoading) {
		return 'Loading...';
	}

	if (isActive) {
		return t('subscriptionPackages.activated');
	}
	if (hasActive) {
		return t('subscriptionPackages.changePlan');
	}

	return t('subscriptionPackages.subscribe');
});
</script>

<template>
	<a
		@click="onClick"
		role="button"
		tabindex="0"
		:class="[
			$style.container,
			{
				[$style.active]: plan?.isActive || isDataLoading,
			},
		]">
		<span
			v-if="amount.economy"
			:class="[
				$style['economy-amount'],
				{
					[$style['max-discount']]: variant === 'max-discount',
				},
			]">
			<i18n-t keypath="subscriptionPackages.saveAmount">
				<template v-slot:saveAmount>{{ currencySymbol }}{{ amount.economy }}</template>
			</i18n-t>
		</span>
		<p :class="$style.title">{{ title }}</p>
		<p :class="$style['monthly-amount']">
			<span :class="$style.value">{{ currencySymbol }}{{ amount.monthly.toFixed(2) }}</span>
			<span :class="$style['period']">/{{ t('subscriptionPackages.perMonth') }}</span>
		</p>
		<p v-if="amount.totalWithoutDiscount" :class="$style['total-price']">
			{{ t('subscriptionPackages.totalPrice') }}&nbsp;
			<span
				>{{ currencySymbol }}{{ amount.total }}&nbsp;/&nbsp;<del
					>{{ currencySymbol }}{{ amount.totalWithoutDiscount }}</del
				></span
			>
		</p>
		<p></p>

		<span
			:class="[
				$style['purchase'],
				{
					[$style.active]: plan?.isActive || isDataLoading,
				},
			]"
			>{{ callToActionText }}</span
		>
	</a>
</template>

<style module lang="scss">
@import 'assets/css/themes/current';

.container {
	flex: 1;
	padding: 40px 30px 30px;
	font-family: var(--pilat-wide-font-family);
	display: flex;
	flex-direction: column;
	gap: 18px;
	cursor: pointer;
	line-height: 20px;
	font-size: 16px;

	&:before {
		content: '';
		transition: all var(--common-transition-duration-easing-function);
		background: var(--background-tertiary-color);
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		position: absolute;
	}

	&.active {
		pointer-events: none;
		background: var(--background-tertiary-active-color);
	}

	@media (hover: hover) {
		&:focus,
		&:hover {
			background: var(--background-tertiary-hover-color);

			&:before {
				left: -5px;
				right: -5px;
				top: -5px;
				bottom: -5px;
				background: var(--reskin-quinary-dark-color);
				width: calc(100% + 10px);
				height: calc(100% + 10px);
			}

			& > .purchase {
				background: var(--icon-primary-color);
			}
		}
	}

	&:focus,
	&:active {
		&:before {
			background: var(--background-tertiary-active-color);
		}

		& > .purchase {
			background: var(--icon-primary-active-color);
		}
	}
}

.title {
	font-family: var(--inter-font-family);
	font-weight: 600;
	line-height: 22px;
}

.monthly-amount {
	font-weight: 400;
	text-transform: uppercase;

	display: flex;
	flex-wrap: wrap;
	row-gap: 8px;

	& > .value {
		font-size: 30px;
	}

	& > .period {
		word-break: break-word;
		vertical-align: bottom;
		line-height: 25px;
	}
}

.economy-amount {
	background: var(--background-positive-color);
	color: var(--text-primary-color);
	font-weight: 700;
	font-size: 14px;
	line-height: 18px;
	padding: 5px 15px;
	text-transform: uppercase;

	position: absolute;
	right: 0;
	top: 0;

	&.max-discount {
		background: var(--background-negative-color);
	}
}

.total-price {
	font-family: var(--inter-font-family);
	font-weight: 400;
	color: var(--text-subhead-color);
	display: flex;
	flex-wrap: wrap;

	& > .value {
		word-break: keep-all;
	}
}

.purchase {
	transition: all var(--common-transition-duration-easing-function);
	display: flex;
	background: var(--icon-accent-color);
	color: var(--text-primary-invariably);
	text-transform: uppercase;
	padding: 16px 24px;
	font-weight: 700;
	justify-content: center;
	margin-top: auto;

	&.active {
		background: #343c67;
		border: 2px #52597e solid;
		color: #52597e;
	}
}
</style>
