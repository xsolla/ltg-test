import type { UserData } from '~/types';

export const isUserDataEqual = (oldUserData?: UserData, newUserData?: UserData) => {
	if (oldUserData?.xsollaUserId !== newUserData?.xsollaUserId) {
		return false;
	}

	const stringifiedOldUserDataEntries = Object.entries(oldUserData ?? {})
		.sort()
		.toString();

	const stringifiedNewUserDataEntries = Object.entries(newUserData ?? {})
		.sort()
		.toString();

	return stringifiedOldUserDataEntries === stringifiedNewUserDataEntries;
};
