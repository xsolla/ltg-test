<script setup lang="ts">
import SubscriptionPackageCard from '~/components/game/subscription/subscription-package-card.vue';
import SubscriptionChangeModal from '~/components/game/subscription/subscription-change-modal.vue';
import { useI18n, Translation as I18nT } from 'vue-i18n';
import { localeCookieKey } from '~/utils/ltg';
import ZendeskAuthForm from '~/components/zendesk-auth-form.vue';
import { getLocalisedTitleBasedOnChargeMonthCount } from '~/components/game/subscription/subscription.utils';

type PlanProps = {
	isActive?: boolean;
	hasActive?: boolean;
};

type Plan = {
	amount: string;
	amountWithoutDiscount: number;
	currency: string;
	type: string;
	trialDays: number;
	discount: boolean;
	currencySymbol: string;
	isPrimary: boolean;
	planId: string;
	charge: {
		value: number;
		type: string;
	};
	plan: PlanProps;
	title: string;
	amountData: {
		total: string;
		monthly: number;
		totalWithoutDiscount?: string;
		economy?: string;
	};
	variant: 'default' | 'max-discount';
};

type ActiveSubscription = {
	plan_id: number;
	plan_external_id?: string;
	plan_name: string;
	status: string;
	date_next_charge: string;
	charge: {
		amount: number;
		currency: string;
	};
	period: {
		value: number;
		unit: string;
	};
	next_charge_en?: string;
};

const props = defineProps<{
	plans: Plan[];
	activeSubscription: ActiveSubscription | null;
	isDataLoading: boolean;
}>();

const emit = defineEmits<{
	changePlan: [planId: string];
}>();

const oneMonthPrice = props.plans?.filter((el) => el.isPrimary)?.[0]?.amountWithoutDiscount;

const nextChargeDateText = computed(() => {
	if (props.activeSubscription) {
		const cookieLocale = useCookie(localeCookieKey);
		return new Date(props.activeSubscription.date_next_charge).toLocaleDateString(
			cookieLocale.value || 'en-GB',
			{ day: '2-digit', month: 'long', year: 'numeric' }
		);
	}
	return '';
});

const { t } = useI18n();

const planEconomies = props.plans.map(
	(el) => oneMonthPrice * el?.charge?.value - parseFloat(el.amount)
);

const mappedPlans = computed(() => {
	return props.plans.map((el) => {
		const economy = oneMonthPrice * el?.charge?.value - parseFloat(el.amount);
		const totalWithoutDiscount = oneMonthPrice * el?.charge?.value;
		const defaultTitle = `${el?.charge?.value} ${el.charge?.type} Subscription`;
		const localizedTitle = getLocalisedTitleBasedOnChargeMonthCount(t, el.charge.value);
		const mappedPlan: Plan = {
			...el,
			plan: {
				hasActive: Boolean(
					props.activeSubscription?.plan_external_id &&
						props.activeSubscription?.plan_external_id !== el?.planId
				),
				isActive: props.activeSubscription?.plan_external_id === el?.planId,
			},
			title: localizedTitle || defaultTitle,
			amountData: {
				totalWithoutDiscount:
					totalWithoutDiscount - parseFloat(el.amount) === 0
						? undefined
						: totalWithoutDiscount.toFixed(2),
				total: el.amount,
				monthly: parseFloat(el.amount) / el?.charge?.value,
				economy: economy < 1 ? undefined : economy.toFixed(2),
			},
			variant: economy === Math.max(...planEconomies) ? 'max-discount' : 'default',
		};
		return mappedPlan;
	});
});

const isSubscriptionChangeModalVisible = ref(false);

const onChangePlanClick = (plan_id: string) => {
	if (props.activeSubscription) {
		isSubscriptionChangeModalVisible.value = true;
	} else {
		emit('changePlan', plan_id);
	}
};

const onClosePlanChangeModal = () => {
	isSubscriptionChangeModalVisible.value = false;
};
</script>

<template>
	<SubscriptionChangeModal
		:current-subscription="{
			title: activeSubscription?.plan_name ?? '',
			endsOn: nextChargeDateText,
		}"
		@close="onClosePlanChangeModal"
		v-if="isSubscriptionChangeModalVisible" />

	<section :class="$style.container">
		<h2 :class="$style.title">{{ t('subscriptionPackages.chooseSubscriptionPlan') }}</h2>

		<p v-if="activeSubscription">
			<i18n-t keypath="subscriptionPackages.currentSubscriptionDescription">
				<template v-slot:title
					><span :class="$style['current-subscription-name']">{{
						activeSubscription.plan_name
					}}</span></template
				>

				<template v-slot:endsOn>{{ nextChargeDateText }}</template>
			</i18n-t>
		</p>

		<p>
			<i18n-t keypath="subscriptionPackages.subscriptionChangeDescription">
				<template v-slot:support>
					<ZendeskAuthForm>
						<button type="submit" :class="$style['technical-support']">
							{{ t('subscriptionPackages.toSupport') }}
						</button>
					</ZendeskAuthForm>
				</template>
			</i18n-t>
		</p>

		<div :class="$style['card-container']">
			<SubscriptionPackageCard
				v-for="(item, index) in mappedPlans"
				:is-data-loading="isDataLoading"
				:plan="item.plan"
				:variant="item.variant"
				:key="index"
				:id="item.planId"
				:title="item.title"
				:amount="item.amountData"
				:currency-symbol="item.currencySymbol"
				@click="onChangePlanClick(item.planId)" />
		</div>
	</section>
</template>

<style module lang="scss">
@import 'assets/css/variables';

.title {
	width: 100%;
	margin-bottom: 48px;

	color: var(--reskin-secondary-light-color);
	text-align: center;
	text-transform: uppercase;
	font-family: var(--pilat-wide-font-family);
	font-weight: 700;
	line-height: 31px;
	font-size: 24px;
}

.technical-support {
	font-size: 16px;
}

.technical-support,
.current-subscription-name {
	font-weight: 700;
}

.current-subscription-name {
	text-transform: uppercase;
}

.container {
	display: flex;
	max-width: 1300px;
	margin: 0 auto;
	padding-bottom: 48px;
	flex-wrap: wrap;

	& > p {
		width: 100%;
		text-align: center;

		font-weight: 400;
		font-family: var(--inter-font-family);
		font-size: 16px;
		line-height: 22px;
		word-break: break-word;

		& + p {
			margin-top: 8px;
		}

		&:last-of-type {
			margin-bottom: 48px;
		}
	}

	@media (max-width: $max-tablet) {
		padding: 0 20px 48px;
	}
}

.card-container {
	gap: 20px;
	flex-wrap: wrap;
	display: flex;
	width: 100%;

	@media (max-width: $max-tablet) {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	@media (max-width: $mid-mobile) {
		display: flex;
		flex-direction: column;
	}
}
</style>
