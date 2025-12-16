<script setup>
definePageMeta({
	layout: 'profile',
	middleware: 'auth',
});

const { $api } = useNuxtApp();

const { data: games } = await useAsyncData(() => $api.getUsersGames());

const selectedGame = ref(null);
</script>

<template>
	<div class="my-games">
		<div v-if="!selectedGame" class="w-ab-100">
			<div class="cards games-list">
				<ProfileGameCard
					v-for="game in games"
					:key="game._id"
					:game="game"
					@open-game="selectedGame = game" />
			</div>
		</div>
		<div v-else class="my-game">
			<div class="my-game__body">
				<div class="toolbar">
					<div class="toolbar__item">
						<button class="button button--mono button--sm" @click="selectedGame = null">
							<IconChevron width="8" height="14" />
							{{ $t('common.back') }}
						</button>
					</div>
				</div>
				<div class="my-game__subscriptions">
					<div
						class="info-card"
						v-for="(sub, index) in selectedGame.subscriptions"
						:key="index">
						<h2 v-if="index === 0" class="info-card__title">
							{{ $t('subscription.currentSubscription') }}
						</h2>
						<ProfileGameSubscription
							:is-last="true"
							:game="selectedGame"
							:subscription="sub" />
					</div>
				</div>
			</div>
			<aside class="my-games__sidebar">
				<ProfileGameCard
					class="game-card--text"
					:game="selectedGame"
					:show-description="true" />
			</aside>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import './src/assets/css/base.scss';

.cards {
	display: flex;
	flex-wrap: wrap;
	align-items: stretch;
	gap: 20px;
}

.my-games {
	display: flex;
	flex-wrap: nowrap;
	width: 100%;

	@media screen and (max-width: $mid-tablet) {
		flex-wrap: wrap;
	}

	@media screen and (max-width: $min-mobile) {
		flex-direction: column;
		width: 100%;
	}
}

.my-games__aside {
	display: flex;
	justify-content: flex-end;
	width: 300px;
	margin-left: 20px;

	@media screen and (max-width: $mid-tablet) {
		width: 100%;
		margin-left: 0;
	}
}
.my-game {
	display: flex;
	align-items: flex-start;
	width: 100%;

	@media screen and (max-width: $max-tablet) {
		flex-wrap: wrap;
	}
}

.my-game__body {
	flex-grow: 2;
	width: auto;
	padding: 0 20px 0 0;

	@media screen and (max-width: $max-tablet) {
		flex-grow: 1;
		width: 100%;
		padding: 0;
	}
}
.my-games__sidebar {
	width: 280px;

	@media screen and (max-width: $max-tablet) {
		flex-grow: 1;
		width: 100%;
		padding: 0;
	}
}

.toolbar {
	justify-content: space-between;
}
</style>
