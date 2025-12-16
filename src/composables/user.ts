import { isUserDataEqual } from '~/utils/user';
import type { UserData } from '~/types';

export const useSetUser = async () => {
	const { $api, $events } = useNuxtApp();
	const res = await $api.getMe();

	const user = useState<{ data?: UserData }>('user');
	const router = useRouter();

	const userData = res.data;

	// if status 401, do logout
	// it means xsolla token expired, and we're unable to refresh it now
	if (res.status === 401) {
		console.error('res.status === 401');
		return await router.push('/logout?session-expired=1');
	}

	if (!userData) {
		console.error('!userData');
		return await router.push('/logout?session-expired=1');
	}

	if (!isUserDataEqual(user.value?.data, userData.data)) {
		user.value = userData;
		$events.emit('user:updated', true);
	}

	return user.value;
};
