<template>
	<div ref="wrapper" class="w-ab-100 h-ab-100 p-f l-0 t-0 b-0 r-0 fd-r ai-c jc-c z-50 of-h modal">
		<div class="w-ab-100 h-ab-100 p-a l-0 t-0" @click="close" />
		<slot />
	</div>
</template>

<script>
export default {
	name: 'Wrapper',
	methods: {
		close() {
			// document.querySelector('body').style.overflowY = 'auto';
			this.$emit('close');
		},
	},
	mounted() {
		window.onkeydown = (e) => {
			if (e.code === 'Escape') {
				this.$emit('close');
			}
		};
		// document.querySelector('body').style.overflowY = 'hidden';
	},
};
</script>

<style lang="scss" scoped>
.modal {
	background: rgba(17, 28, 42, 0.75);
	backdrop-filter: brightness(0.5);
	animation-timing-function: ease-in-out;
	animation-name: wrapper;
	animation-duration: 200ms;
	width: 100%;
	will-change: transform, backdrop-filter;
}
@keyframes wrapper {
	0% {
		backdrop-filter: brightness(1);
	}
	100% {
		backdrop-filter: brightness(0.5);
	}
}
</style>
