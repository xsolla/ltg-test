import type { GamePrice, PaystationTokenData, Promocode, UserData } from '~/types';
import { computed, ref, type Ref, watch } from 'vue';
import { useNuxtApp, useState } from 'nuxt/app';
import { type UserSubscription, type Game, type PriceDisplayData } from '~/types/game';
import { getActiveUserSubscription, getCurrentAmount } from '~/composables/game/game-price/utils';

type Props = {
	game: Game;
	currency: string;
	promocode: Ref<Promocode | null | undefined>;
};

const useGamePrice = (props: Props) => {
	const { $api } = useNuxtApp();

	const currentPlanTokenData = ref<PaystationTokenData>({
		token: null,
		sandbox_mode: null,
	});
	const plansTokenData = ref<Record<string, PaystationTokenData>>();
	const plans = ref<GamePrice[]>([]);
	const isLoadingPlansTokenData = ref<boolean>(false);

	const activeSubscription = ref<UserSubscription | null>();
	const isLoadingPriceData = ref<boolean>(true);
	const user = useState<{ data?: UserData }>('user');

	const gameSlug = props.game.path.replace('/', '');

	const currentPlan = computed(() => {
		if (activeSubscription.value) {
			const activeSubscriptionPlan = plans.value.find(
				({ planId }) => planId === activeSubscription.value?.plan_external_id
			);

			if (activeSubscriptionPlan) {
				return activeSubscriptionPlan;
			}
		}

		return plans.value.find(({ isPrimary }) => isPrimary) ?? plans.value[0];
	});

	const currentPriceData = computed(() => {
		if (!currentPlan.value || !plans.value) {
			return null;
		}

		const { amountWithoutDiscount, amount, currencySymbol } = currentPlan.value;

		const monthCount =
			currentPlan.value.charge?.type === 'month' ? currentPlan.value.charge.value : 1;

		return {
			amount: amount.toString(),
			amountWithoutDiscount: amountWithoutDiscount.toString(),
			currencySymbol,
			monthCount,
		} as PriceDisplayData;
	});

	const loadActiveSubscription = async () => {
		const userSubscriptions = await $api.getUserSubscriptionByProject(
			props.game.settings.project_id
		);

		activeSubscription.value = getActiveUserSubscription(userSubscriptions);
	};

	const loadPlans = async () => {
		plans.value = await $api.getGamePrice({
			slug: gameSlug,
			currency: props.currency,
			promocode: props.promocode.value?.code,
			withoutPromocode: !props.promocode.value,
		});
	};

	const getGameToken = async (planId: string) => {
		const { promocode } = props;

		const promocodeType =
			promocode.value && (promocode.value?.type === 'subscription' ? 'trial' : 'discount');

		const tokenType = promocodeType ?? 'purchase';

		const tokenData = await $api.getToken({
			slug: gameSlug,
			currency: props.currency,
			type: tokenType,
			planId,
			promocode: promocode.value?.code,
			withoutPromocode: !promocode.value,
		});

		return {
			planId,
			tokenData,
		};
	};

	const updateCurrentPlanTokenData = async () => {
		if (!currentPlan.value || !user.value?.data) {
			isLoadingPriceData.value = false;
			return;
		}

		const gameType = props.game.settings.type;

		if (gameType === 'subscription') {
			currentPlanTokenData.value = (await getGameToken(currentPlan.value.planId)).tokenData;
		} else if (gameType === 'game_key') {
			currentPlanTokenData.value = await $api.getGameKeyToken(
				gameSlug,
				props.currency,
				currentPlan.value.planId
			);
		}

		isLoadingPriceData.value = false;
	};

	const getPlanTokens = async (
		planIds: string[]
	): Promise<{ tokenData: PaystationTokenData; planId: string }[]> => {
		return Promise.all(
			planIds.map((planId) => {
				return getGameToken(planId);
			})
		);
	};

	watch(
		[user, props.promocode],
		() => {
			const promocodeIsNotLoadedYet =
				!props.promocode.value && props.promocode.value !== null;

			if (promocodeIsNotLoadedYet) {
				return;
			}

			isLoadingPriceData.value = true;

			if (props.game.settings.type === 'subscription') {
				isLoadingPlansTokenData.value = true;
			}

			loadPlans();
		},
		{ immediate: true }
	);

	watch(
		user,
		() => {
			if (user.value?.data && props.game.settings.type === 'subscription') {
				loadActiveSubscription();
			}
		},
		{ immediate: true }
	);

	watch(currentPlan, updateCurrentPlanTokenData);

	watch([activeSubscription, plans], () => {
		if (activeSubscription.value || !user.value) {
			isLoadingPlansTokenData.value = false;
		}

		if (!user.value || !currentPlan.value || activeSubscription.value) {
			return;
		}

		const plansIdsToLoadTokens = plans.value
			.filter(({ planId }) => planId !== currentPlan.value.planId)
			.map(({ planId }) => planId);

		getPlanTokens(plansIdsToLoadTokens)
			.then((tokens) => {
				const tokenData: Record<string, PaystationTokenData> = {};

				for (const { tokenData: data, planId } of tokens) {
					tokenData[planId] = data;
				}

				plansTokenData.value = tokenData;
			})
			.finally(() => {
				isLoadingPlansTokenData.value = false;
			});
	});

	return {
		plans,
		currentPlan,
		currentPlanTokenData,
		currentPriceData,
		isLoadingPriceData,
		isLoadingPlansTokenData,
		activeSubscription,
		plansTokenData,
	};
};

export default useGamePrice;
