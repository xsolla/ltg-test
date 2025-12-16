<script lang="ts" setup>
import RemoveIcon from '~/components/icon/ui-kit/remove.vue';
import { ref, onMounted, computed } from 'vue';

type Props = {
	title: string;
};

type Emits = {
	(e: 'close'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const user = useState('user');

const CONTAINER_VISIBILITY_TIMEOUT = 300;

const isVisible = ref(false);

const hasBottomMetaframe = computed(() => {
	// @ts-expect-error
	return Boolean(user.value?.data);
});

const onCloseClick = () => {
	emit('close');
};

onMounted(() => {
	setTimeout(() => {
		isVisible.value = true;
	}, CONTAINER_VISIBILITY_TIMEOUT);
});
</script>

<template>
	<Teleport to="body">
		<div
			:class="[
				$style.container,
				{
					[$style.visible]: isVisible,
					[$style['with-bottom-metaframe']]: hasBottomMetaframe,
				},
			]">
			<slot name="icon" />

			<p :class="$style.title">{{ title }}</p>

			<button @click="onCloseClick" :class="$style['close-button']">
				<RemoveIcon />
			</button>

			<slot name="body" />
		</div>
	</Teleport>
</template>

<style lang="scss" module>
@import 'assets/css/themes/current';
@import 'assets/css/variables';

.title {
	@include title-2-font-style;

	color: var(--text-primary-color);
	word-break: break-word;
	margin-bottom: var(--space-100);
	margin-left: var(--space-150);
	flex: 1;
}

.container {
	z-index: 2;
	background: var(--background-secondary-color);
	box-shadow:
		0 0 4px 0 rgba(0, 0, 0, 0.2),
		0 4px 8px 0 rgba(0, 0, 0, 0.15);

	left: var(--space-375);
	bottom: var(--space-375);
	transition: all var(--common-transition-duration-easing-function);
	transform: translateX(100% * -2);
	position: fixed;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	max-width: 340px;

	padding: var(--space-150);

	&.visible {
		transform: none;
	}

	@media (max-width: $max-mobile) {
		left: var(--space-250);
		right: var(--space-250);

		&.with-bottom-metaframe {
			bottom: 80px;
		}
	}
}

.close-button {
	width: fit-content;
	height: fit-content;
}
</style>
