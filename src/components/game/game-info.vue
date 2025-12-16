<template>
	<div v-if="info" class="game-info">
		<dl class="game-info__list">
			<div class="game-info__item">
				<dt class="game-info__title">{{ $t('game.release') }}:</dt>
				<dd class="game-info__description">{{ info.release }}</dd>
			</div>
			<div class="game-info__item">
				<dt class="game-info__title">{{ $t('game.developer') }}:</dt>
				<dd class="game-info__description">{{ info.developer }}</dd>
			</div>
			<div class="game-info__item">
				<dt class="game-info__title">{{ $t('game.genre') }}:</dt>
				<dd class="game-info__description">{{ genre }}</dd>
			</div>
			<div class="game-info__item">
				<dt class="game-info__title">{{ $t('game.languages') }}:</dt>
				<dd class="game-info__description">{{ languages }}</dd>
			</div>
			<div class="game-info__item">
				<dt class="game-info__title">{{ $t('game.platform') }}:</dt>
				<dd class="game-info__description">{{ info.platform }}</dd>
			</div>
		</dl>
	</div>
</template>

<script>
export default {
	name: 'GameInfo',
	props: {
		info: Object,
	},
	computed: {
		languages() {
			return this.info?.languages?.split(',')?.join(', ');
		},
		genre() {
			return this.info?.genre?.split(',')?.join(', ');
		},
	},
};
</script>

<style lang="scss" scoped>
.game-info {
	padding: 34px 0 0 0;
	border-top: 1px solid rgba(255, 255, 255, 0.11);
	border-bottom: 0;

	@media screen and (max-width: 768px) {
		border-bottom: 1px solid rgba(255, 255, 255, 0.11);
	}
}
.game-info__list {
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	gap: 30px;

	@media screen and (max-width: 768px) {
		flex-wrap: wrap;
		justify-content: flex-start;
	}
}
.game-info__item {
	flex-grow: 1;
	width: 130px;
	font-family: var(--pilat-wide-font-family);
	color: var(--reskin-senary-dark-color);

	@media screen and (max-width: 1200px) {
		flex-grow: unset;
		width: 20%;
	}

	@media screen and (max-width: 768px) {
		flex-grow: unset;
		width: calc(50% - 15px);
		margin-bottom: 20px;
	}
}
.game-info__title {
	margin: 0 0 5px 0;
	font-size: 14px;
	font-style: normal;
	font-weight: 600;
	line-height: 20px;
	text-transform: uppercase;
}
.game-info__description {
	color: rgba(255, 255, 255, 0.75);
	font-size: 13px;
	font-style: normal;
	font-weight: 400;
	line-height: 20px;
	font-family: var(--helvetica-neue-font-family);
}
</style>
