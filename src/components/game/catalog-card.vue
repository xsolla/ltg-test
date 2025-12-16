<script setup lang="ts">
import type { GamePrice, UserData } from '~/types';
import { watch } from 'vue';

const { card } = defineProps({
	card: {
		type: Object,
		default: () => {},
	},
});

const { $api, $i18n } = useNuxtApp();

const price = ref<GamePrice | null>(null);

const currency = useState<string>('currency');
const user = useState<{ data?: UserData }>('user');

// eslint-disable-next-line
const priceDisplayData = computed(() => {
	if (price.value) {
		const { currencySymbol, amount, amountWithoutDiscount } = price.value;

		const amountPostfix = price.value.type === 'subscription' ? '/mo' : '';

		return {
			amount: `${currencySymbol}${amount}${amountPostfix}`,
			amountWithoutDiscount: `${currencySymbol}${amountWithoutDiscount}${amountPostfix}`,
		};
	}
});

async function getPrice() {
	const priceArray = await $api.getGamePrice({
		slug: card.slug,
		currency: currency.value,
	});
	price.value = priceArray?.find((el) => el.isPrimary) || priceArray?.[0];
}

watch(user, getPrice, { immediate: true });
</script>

<template>
	<article class="games-card">
		<nuxt-link
			class="card-body"
			:class="{ 'with-discount': price?.discount }"
			v-click-metrika="{
				name: 'xpp_main_game_click',
				ev: card?._id,
				exv: { place: 'main' },
			}"
			:to="`/game/${card.slug}`">
			<figure class="games-card__pic game-picture">
				<svg width="0" height="0">
					<defs>
						<clipPath id="mask">
							<path
								d="M420 15V376C384.5 399 326.5 439.5 212 442.5C120.4 444.9 32.5 399.333 0 376V14.5C0 4.1 9.33333 0.5 14 0H405C416.2 0 419.667 10 420 15Z"
								fill="transparent" />
						</clipPath>
					</defs>
				</svg>
				<img :src="card.thumbnail" alt="" />
			</figure>

			<h3 class="game-title">{{ card.name }}</h3>

			<template v-if="price?.amount">
				<p v-if="!price.discount" class="game-price">
					{{ priceDisplayData?.amount }}
				</p>

				<div v-else>
					<p class="game-price with-discount">
						{{ priceDisplayData?.amount }}
					</p>

					<p class="game-old-price">
						<s> {{ priceDisplayData?.amountWithoutDiscount }}</s>
					</p>
				</div>
			</template>
		</nuxt-link>
	</article>
</template>

<style lang="scss" scoped>
@import 'assets/css/ui';

.game-picture {
	margin-bottom: 20px;
	width: 100%;
}

.card-body {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	cursor: pointer;

	font-family: var(--pilat-wide-font-family);
	font-weight: 400;
	font-size: 16px;
	line-height: 20px;

	align-items: flex-start;
	justify-content: space-between;
	padding-bottom: 21px;

	&.with-discount {
		padding-bottom: 0;
	}
}

.game-title {
	line-height: 30px;
	flex: 1;
	margin-right: 10px;
}

.game-price {
	display: flex;
	justify-content: center;
	align-items: center;
	background: var(--reskin-secondary-dark-color);
	padding: 5px 10px;
	align-self: flex-start;

	&.with-discount {
		background: var(--badge-bg-sale);
	}
}

.game-old-price {
	width: 100%;
	text-align: right;
	margin-top: 6px;
	padding-right: 10px;

	font-family: var(--pilat-wide-font-family);
	font-size: 12px;
	font-weight: 400;
	line-height: 15px;
}
</style>
