<template>
	<Teleport to="body">
		<div v-if="isOpened" class="modal" :class="{ 'with-header-overlap': overlapHeader }">
			<div
				class="modal__wrapper"
				ref="modalWrapper"
				:class="{ 'fit-content': size === 'fit-content' }">
				<header class="modal__header">
					<h2 v-if="title">{{ title }}</h2>
					<button class="modal__close" color="dark" @click="close">
						<IconX />
					</button>
				</header>
				<div class="modal__content">
					<slot></slot>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';

interface Props {
	title?: string;
	isOpened?: boolean;
	overlapHeader?: boolean;
	size?: 'default' | 'fit-content';
}

const props = withDefaults(defineProps<Props>(), {
	isOpened: false,
	overlapHeader: true,
});

const emit = defineEmits(['close']);

const modalWrapper = ref<HTMLElement | null>(null);

onClickOutside(modalWrapper, close);

function close() {
	$events.emit('modal:closed');
	emit('close');
}

const { $events } = useNuxtApp();

onMounted(() => {
	// Когда модалка загружается
	// Отбрасываем глобальное событие
	$events.emit('modal:opened');
});

onUnmounted(() => {
	$events.emit('modal:closed');
});
</script>

<style lang="scss" scoped>
.modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(18, 15, 44, 0.8);
}

.modal__wrapper {
	width: 100%;
	max-width: 393px;
	padding: 30px;
	background-color: var(--reskin-primary-dark-color);

	&.fit-content {
		max-width: fit-content;
	}
}

.modal__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 0 0 28px 0;

	h2 {
		margin: 0;
		font-size: 18px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
	}
}

.modal__close {
	width: 24px;
	height: 24px;
	transition: opacity linear 0.2s;
	margin-left: auto;
	svg {
		width: 14px;
		height: 14px;
	}

	&:hover {
		opacity: 0.7;
	}
}
</style>
