import { ref, watch, onBeforeMount } from 'vue';
import { useNuxtApp, useState } from 'nuxt/app';
import type { Promocode } from '~/types';

type Props = {
	gamePath: string;
};

const usePromocodeSelection = (props: Props) => {
	const { $api } = useNuxtApp();

	const promocodes = ref<Promocode[]>([]);
	const selectedPromocode = ref<Promocode | undefined | null>(undefined);
	const user = useState('user');

	const onPromocodeSelected = (promocode: Promocode) => {
		selectedPromocode.value = promocode;
	};

	const updateGamePromocodes = () => {
		if (user.value) {
			$api.getGamePromocodes(props.gamePath).then((gamePromocodes) => {
				promocodes.value = gamePromocodes;

				if (gamePromocodes.length) {
					selectedPromocode.value = gamePromocodes[0];
				} else {
					selectedPromocode.value = null;
				}
			});
		} else {
			selectedPromocode.value = null;
		}
	};

	watch(user, updateGamePromocodes);

	onBeforeMount(updateGamePromocodes);

	return {
		promocodes,
		selectedPromocode,
		onPromocodeSelected,
	};
};

export default usePromocodeSelection;
