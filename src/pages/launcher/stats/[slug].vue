<script setup lang="ts">
definePageMeta({
	layout: 'launcher',
});
const { $api } = useNuxtApp();
const gameSlug = useRoute().params.slug?.toString();
const { data: stats } = await useAsyncData(() => $api.getGameStats(gameSlug));
</script>
<template>
	<div v-if="stats" class="stat-wrapper">
		<div class="stat-block">
			<div class="stat-block-header">
				<p>Server status</p>
			</div>
			<div class="stat-block-body">
				<div class="stat-block-row">
					<span>Current online</span><span>{{ stats.current_online }}</span>
				</div>
				<div class="stat-block-row">
					<span>Yesterday’s PCCU</span><span>{{ stats.peak_ccu }}</span>
				</div>
				<div class="stat-block-row d-none">
					<span>Yesterday’s PCCU</span><span>{{ stats.peak_utc_time }}</span>
				</div>
				<div class="stat-block-row">
					<span>Daily active users</span><span>{{ stats.dau }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.stat-wrapper {
	position: fixed;
	width: 100%;
	height: 100%;
	z-index: 10;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background-image: url('https://cdn.ltg.com/launcher/lif_launcher_bg.png');
	background-position: center center;
	background-size: cover;
	.stat-block {
		background: rgba(18, 15, 44, 0.8);
		border: 1px solid rgba(255, 255, 255, 0.17);
		color: #fff;
		border-radius: 5px;
		min-width: 320px;
		.stat-block-header {
			font-size: 16px;
			padding: 20px;
			border-bottom: 1px solid rgba(255, 255, 255, 0.17);
		}
		.stat-block-body {
			padding: 20px;
			font-size: 14px;
			display: flex;
			flex-direction: column;
			gap: 20px;
			.stat-block-row {
				display: flex;
				&.d-none {
					display: none;
				}
				span:first-child {
					color: rgba(255, 255, 255, 0.5);
					width: 100%;
				}
			}
		}
	}
}
</style>
