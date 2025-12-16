import type { UserSubscription } from '~/types/game';
import type { GamePrice, Promocode } from '~/types';

export const extractPlanPrice = (
	activeSubscription?: UserSubscription | null,
	plans?: GamePrice[]
) => {
	if (!plans || !activeSubscription) {
		return 0;
	}

	const correspondingPlan = plans.find(
		(plan) => plan.planId === activeSubscription.plan_external_id
	);

	return correspondingPlan?.amount || 0;
};

export const getActiveUserSubscription = (userSubscriptions: UserSubscription[]) => {
	const sortedActiveSubscriptions = userSubscriptions
		.filter(
			(subscription) =>
				subscription.status === 'active' || subscription.status === 'non_renewing'
		)
		.sort(
			(a, b) =>
				new Date(a.date_next_charge).getTime() - new Date(b.date_next_charge).getTime()
		);

	return sortedActiveSubscriptions[0] ?? null;
};

export const getCurrentAmount = (
	currentPlan: GamePrice,
	plans: GamePrice[],
	activeSubscription?: UserSubscription | null
) => {
	const activeSubscriptionPeriod = activeSubscription?.period.value;

	const monthCount =
		activeSubscriptionPeriod && activeSubscriptionPeriod !== 1 ? activeSubscriptionPeriod : 0;

	return monthCount ? extractPlanPrice(activeSubscription, plans) : currentPlan.amount;
};

export const calculateAmountWithPromocode = (amount: number, promocode?: Promocode | null) => {
	return promocode && promocode.type !== 'subscription'
		? (amount - amount * (promocode.qty / 100)).toFixed(2)
		: amount;
};
