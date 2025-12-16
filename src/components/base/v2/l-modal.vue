<script lang="ts" setup>
import RemoveIcon from '~/components/icon/ui-kit/remove.vue';

type Emits = {
	(e: 'close'): void;
};

const emit = defineEmits<Emits>();

const onCloseClick = () => {
	emit('close');
};
</script>

<template>
	<Teleport to="body">
		<button @click="onCloseClick" :class="$style.backdrop" />

		<div :class="$style.container">
			<slot />

			<button @click="onCloseClick" :class="$style['close-button']">
				<RemoveIcon :size="20" />
			</button>
		</div>
	</Teleport>
</template>

<style lang="scss" module>
@import 'assets/css/themes/current';

.backdrop {
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	background: var(--background-contrast-alpha-color);
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	z-index: 2;
}

.container {
	background: var(--background-secondary-color);
	max-width: 360px;
	padding: 24px;
	position: fixed;
	margin: auto;
	align-self: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: fit-content;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 2;
}

.close-button {
	position: absolute;
	right: 4px;
	top: 4px;
	padding: 12px;
}
</style>
