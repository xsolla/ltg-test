<script lang="ts" setup>
import currencyList from '~/utils/currency';
import type { GamePrice, GameProperty } from '~/types';

type Price = Omit<GamePrice, 'type' | 'trialDays' | 'currency'>;

type Props = {
	price?: Price;
	path: string;
	name: string;
	description: string;
	property: GameProperty;
	images: {
		logo: string;
		main: string;
	};
};

const props = defineProps<Props>();

const isLogo = computed(() => {
	if (props.images?.logo) {
		return 'game-unit';
	}
	return 'game-unit no-logo';
});

function openLinkedGame(to: string) {
	window.open('/game' + to, '_self');
}
</script>

<template>
	<article :class="`${isLogo}`" style="cursor: pointer" @click="openLinkedGame(path)">
		<span class="game-unit__pic" :style="`background-image: url('${images.main}')`">
			<template v-if="price">
				<div v-if="price.discount" class="game-unit__footer">
					<span class="badge badge--sale"
						>{{ price.amount }} {{ price.currencySymbol }}</span
					>
					<div class="game-unit__cost">
						<span class="game-unit__cost">
							{{ price.amountWithoutDiscount }}
							{{ price.currencySymbol }}
						</span>
					</div>
					<!-- <a href="" class="link link--bordered">view game page</a> -->
				</div>
				<div v-else class="game-unit__footer">
					<div class="game-unit__cost without-discount">
						<p>{{ price.amount }} {{ price.currencySymbol }}</p>
					</div>
					<!-- <a href="" class="link link--bordered">view game page</a> -->
				</div>
			</template>
		</span>

		<div class="game-unit__col">
			<h3 class="game-unit__title">
				{{ name }}
			</h3>
			<p class="game-unit__text">
				{{ description }}
			</p>

			<div class="game-unit__tags tags">
				<span v-if="property.nft" class="tags__item badge badge--default">{{
					$t('game.nft')
				}}</span>
				<span v-if="property.html5" class="tags__item badge badge--default">{{
					$t('game.html5')
				}}</span>
				<span v-if="property?.cloud" class="tags__item badge badge--default">{{
					$t('game.cloud')
				}}</span>
				<span v-if="property?.modifier" class="tags__item badge badge--colored">{{
					$t('game.modifier')
				}}</span>
			</div>
		</div>
	</article>
</template>

<style scoped lang="scss">
.game-unit__pic {
	font-family: var(--pilat-wide-font-family);
}

.badge--sale {
	font-size: 16px;
	line-height: 21px;
	font-weight: 400;
	color: var(--white);
}

.game-unit__cost {
	color: var(--white);
	font-size: 12px;
	font-weight: 400;
	line-height: 15px;
	margin: 6px 6px 0 0;

	&.without-discount {
		font-size: 16px;
		line-height: 20px;
		margin: 0;
		padding: 2px 10px;
		background: var(--white);
		& > p {
			font-weight: 400;
			color: #000;
		}
	}
}
</style>
