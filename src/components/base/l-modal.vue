<!-- Эта модалка скопирована из ветки LTGPL-1728 -->
<!-- Но компонент переименован в LModal, там он BaseModal -->
<!-- Чтобы не было конфликтов. Использовать дальше будем LModal -->
<!-- Так же, как и другие base-компоненты переименовываем в l-компоненты -->
<template>
	<Teleport to="body">
		<div v-if="isOpened" class="modal" :class="{ 'with-header-overlap': overlapHeader }">
			<div class="modal__wrapper">
				<header class="modal__header">
					<h2 v-if="title">{{ title }}</h2>
					<button v-if="showCloseButton" class="modal__close" color="dark" @click="close">
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

<script setup>
defineProps({
	title: String,
	isOpened: {
		type: Boolean,
		default: false,
	},
	showCloseButton: {
		type: Boolean,
		default: true,
	},
	overlapHeader: {
		type: Boolean,
		default: true,
	},
});
const emit = defineEmits(['close']);

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
