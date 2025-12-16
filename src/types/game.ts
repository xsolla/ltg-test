import type { GameType } from '~/types/index';

export type Game = {
	_id: string;
	path: string;
	settings: {
		type: GameType;
		project_id: number;
	};
};

export type UserSubscriptionStatus = 'active' | 'non_renewing' | 'canceled';

export type UserSubscription = {
	plan_external_id: string;
	date_last_charge?: string;
	date_next_charge: string;
	status: UserSubscriptionStatus;
	period: {
		value: number;
	};
};

export type PriceDisplayData = {
	amount: string;
	amountWithoutDiscount: string;
	currencySymbol: string;
	monthCount?: number;
};
