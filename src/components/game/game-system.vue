<script setup>
defineProps({
	item: Object,
});
</script>
<template>
	<div class="system-guide__card">
		<div class="system-guide__card-name">
			{{ item.name }}
		</div>
		<dl class="system-list">
			<div v-if="item.os" class="system-list__item">
				<dt class="system-list__item-key">{{ $t('game.system.os') }}:</dt>
				<dd class="system-list__item-value">
					{{ item.os }}
				</dd>
			</div>
			<div v-if="item.processor || item.cpu" class="system-list__item">
				<dt class="system-list__item-key">{{ $t('game.system.cpu') }}:</dt>
				<dd class="system-list__item-value">
					{{ item.processor || item.cpu }}
				</dd>
			</div>
			<div v-if="item.memory || item.ram" class="system-list__item">
				<dt class="system-list__item-key">{{ $t('game.system.ram') }}:</dt>
				<dd class="system-list__item-value">
					{{ item.memory || item.ram }}
				</dd>
			</div>
			<div v-if="item.graphics || item.gpu" class="system-list__item">
				<dt class="system-list__item-key">{{ $t('game.system.gpu') }}:</dt>
				<dd class="system-list__item-value">
					{{ item.graphics || item.gpu }}
				</dd>
			</div>
			<div v-if="item.directX || item.directx" class="system-list__item">
				<dt class="system-list__item-key">{{ $t('game.system.directx') }}:</dt>
				<dd class="system-list__item-value">
					{{ item.directX || item.directx }}
				</dd>
			</div>
			<div v-if="item.network" class="system-list__item">
				<dt class="system-list__item-key">Network:</dt>
				<dd class="system-list__item-value">
					{{ item.network }}
				</dd>
			</div>
			<div v-if="item.storage" class="system-list__item">
				<dt class="system-list__item-key">{{ $t('game.system.storage') }}:</dt>
				<dd class="system-list__item-value">
					{{ item.storage }}
				</dd>
			</div>
		</dl>
	</div>
</template>
<style lang="scss" scoped>
@import 'assets/css/base.scss';
.system-guide__card {
	position: relative;
	width: 50%;
	max-width: 640px;
	padding: 84px 10px 50px;
	background: var(--reskin-secondary-dark-color);

	@media screen and (max-width: $max-mobile) {
		width: 100%;
		max-width: 100%;
	}
}

.system-guide__card-name {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 149px;
	height: 50px;
	padding-left: 8px;
	padding-right: 8px;
	background: var(--reskin-primary-light-color);
	color: var(--primary-dark-text-color);
	text-align: center;
	text-transform: uppercase;
	font-size: 14px;
	font-style: normal;
	font-weight: 700;
	line-height: 20px;
}

.system-list {
	max-width: 80%;

	@media screen and (max-width: $max-tablet) {
		max-width: 95%;
	}

	dt {
		min-width: 100px;
		width: 40%;
		max-width: 150px;
		color: #ffffff;
		text-align: right;
		font-size: 14px;
		font-style: normal;
		font-weight: 700;
		line-height: 20px;

		@media screen and (max-width: $max-tablet) {
			width: 50%;
		}
	}

	dd {
		width: 80%;
		max-width: calc(100% - 100px);
		margin: 0 0 0 10px;
		color: #ffffff;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 20px;

		@media screen and (max-width: $max-tablet) {
			width: 50%;
		}
	}
}

.system-list__item {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	margin: 0 0 10px 0;

	&:last-child {
		margin-bottom: 0;
	}
}

.system-list__item-key {
}

.system-list__item-value {
}
</style>
