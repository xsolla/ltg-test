<template>
	<div v-if="type === 'dots'" style="display: flex; align-items: center; justify-content: center">
		<span class="dot dot-left"></span>
		<span class="dot dot-center"></span>
		<span class="dot dot-right"></span>
	</div>
	<div
		v-else-if="type === 'circle'"
		style="display: flex; align-items: center; justify-content: center">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			style="width: 32px; height: 32px">
			<path
				fill="currentColor"
				d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
				opacity=".5" />
			<path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
				<animateTransform
					attributeName="transform"
					dur="1s"
					from="0 12 12"
					repeatCount="indefinite"
					to="360 12 12"
					type="rotate" />
			</path>
		</svg>
	</div>
</template>
<script setup lang="ts">
defineProps({
	type: {
		type: String as PropType<'dots' | 'circle'>,
		default: 'dots',
	},
});
</script>
<style lang="css" scoped>
.dot {
	background-color: #222222;
	color: #222222;
	margin-left: 0.35rem;
	margin-right: 0.35rem;
	width: 0.35rem;
	height: 0.35rem;
	border-radius: 9999px;
	animation: dotFlashing 0.5s infinite linear alternate;
}
.dot-center {
	animation-delay: 0.25s;
}
.dot-left {
	animation-delay: 0s;
}
.dot-right {
	animation-delay: 0.5s;
}
@keyframes dotFlashing {
	0% {
		background-color: #222222;
	}
	50%,
	100% {
		background-color: #f3f3f3;
	}
}
</style>
