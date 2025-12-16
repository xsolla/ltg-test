<script setup>
import Link from '@/components/base/link.vue';
</script>
<template>
	<article class="game-card">
		<Link v-if="to" :to="to" class="cards__link">
			<figure class="cards__item-pic" :style="background">
				<img v-if="showLogo" :src="logo" class="cards__item-logo" alt="" />
			</figure>
			<div class="cards__item-body">
				<h3 class="game-card__title">{{ game.name }}</h3>
				<p v-if="showDescription" class="game-card__text">{{ game.description }}</p>
			</div>
		</Link>
		<div v-else @click="$emit('open-game')" class="cards__link" style="cursor: pointer">
			<figure class="cards__item-pic" :style="background">
				<img v-if="showLogo" :src="logo" class="cards__item-logo" alt="" />
			</figure>
			<div class="cards__item-body">
				<h3 class="game-card__title">{{ game.name }}</h3>
				<p v-if="showDescription" class="game-card__text">
					{{ game.description }}
				</p>
			</div>
		</div>
	</article>
</template>
<script>
export default {
	name: 'profile-game-card',
	props: {
		game: Object,
		showDescription: {
			type: Boolean,
			default: false,
		},
		showLogo: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		background() {
			if (!this.game?.images?.main) {
				return {};
			}
			const image = this.game.images.card || this.game.images.main;
			return { 'background-image': 'url(' + image + ')' };
		},
		logo() {
			if (!this.game?.images?.logo) {
				return '';
			}
			return this.game?.images?.logo;
		},
		to() {
			if (this.game?.type !== 'subscription') {
				return `/game${this.game.path}`;
			}
			return null;
		},
	},
};
</script>
<style lang="scss" scoped>
@import './src/assets/css/base.scss';
.cards {
	display: flex;
	flex-wrap: wrap;
	align-items: stretch;
	gap: 20px;
}

.games-list .game-card {
	padding: 0;
}

.cards__item {
	width: 32.333333%;
	max-width: 320px;
	padding: 10px;
	background: #181533;
	box-sizing: border-box;

	&--text {
		width: 100%;
		max-width: 280px;

		@media screen and (max-width: $mid-tablet) {
			max-width: 100%;
		}

		p {
			font-size: 12px;
			line-height: 20px;
			-webkit-line-clamp: 5;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}
}

.cards__link {
	display: block;
	width: 100%;
	padding: 10px;
	background: var(--reskin-secondary-dark-color);
	cursor: pointer;
	transition: all 200ms ease-in-out;

	&:hover {
		background: var(--reskin-quinary-dark-color);
	}
}

.cards__item-pic {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 190px;
	height: auto;
	aspect-ratio: 16/9;
	margin: 0 0 20px 0;
	background-color: var(--extra-color-2);
	background-position: center center;
	background-repeat: no-repeat;
	background-size: cover;
	overflow: hidden;
}

.cards__item-body {
	margin-top: auto;
	min-height: 30px;
}

.cards__item-title {
	margin: 0;
	color: #fff;
	font-size: 16px;
	font-weight: 700;
}
</style>
