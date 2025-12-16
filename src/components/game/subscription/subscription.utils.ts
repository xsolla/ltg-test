const getLocalisedTitleKeyBasedOnChargeMonthCount = (monthCount: number) => {
	switch (monthCount) {
	case 1:
		return 'oneMonthSubscriptionTitle';
	case 3:
		return 'threeMonthSubscriptionTitle';
	case 6:
		return 'sixMonthSubscriptionTitle';
	case 12:
		return 'twelveMonthSubscriptionTitle';
	default:
		return null;
	}
};

export const getLocalisedTitleBasedOnChargeMonthCount = (
	t: (key: string) => string,
	monthCount: number
) => {
	const key = getLocalisedTitleKeyBasedOnChargeMonthCount(monthCount);
	if (!key) {
		return null;
	}
	return t(`subscriptionPackages.${key}`);
};
