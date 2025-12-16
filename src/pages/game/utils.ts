import { useNuxtApp } from 'nuxt/app';
import type { GamePrice, GameType, LinkedGame } from '~/types';

const getLinkedGameDisplayPrice = (prices: GamePrice[], gameType: GameType): GamePrice => {
	if (gameType === 'subscription') {
		const primarySubscriptionPrice = prices.find(({ isPrimary }) => isPrimary);

		if (primarySubscriptionPrice) {
			return primarySubscriptionPrice;
		}
	}

	return prices[0];
};

export const getLinkedGames = async (gameSlug: string, currency: string) => {
	const { $api } = useNuxtApp();

	const responseLinkedGames: LinkedGame[] = await $api.getLinkedGames(gameSlug);

	return await Promise.all(
		responseLinkedGames.map(async (game) => {
			const { type } = game.settings;
			const slug = game.path.replace('/', '');

			if ((type === 'subscription' || type === 'game_key') && !game.isGamePurchased) {
				const gamePrices = await $api.getGamePrice({
					slug,
					currency,
				});

				return {
					...game,
					price: getLinkedGameDisplayPrice(gamePrices, type),
				};
			} else {
				return game;
			}
		})
	);
};
