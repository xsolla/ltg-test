<script setup lang="ts">
import { ref, onMounted } from 'vue';

type State = 'default' | 'success' | 'error';
interface Props {
	state?: State;
	size?: 'default' | 'full-width' | 'large';
	type?: 'text' | 'email';
	placeholder?: string;
	modelValue: string;
	focusOnMount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	type: 'text',
});
const emit = defineEmits(['update:modelValue', 'on-enter', 'focus']);

const input = ref<HTMLElement | null>(null);

function onEnter() {
	emit('on-enter');
}

const onFocus = () => {
	emit('focus');
};

onMounted(() => {
	if (props.focusOnMount) {
		input.value?.focus();
	}
});
</script>

<template>
	<input
		:value="modelValue"
		@input="emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
		:type="type"
		ref="input"
		:placeholder="placeholder"
		@focus="onFocus"
		@keyup.enter="onEnter"
		:class="[
			$style.input,
			{
				[$style['full-width']]: size === 'full-width',
				[$style['large']]: size === 'large',
				[$style['success']]: state === 'success',
				[$style['error']]: state === 'error',
			},
		]" />
</template>

<style lang="scss" module>
@import 'assets/css/variables';
@import 'assets/css/themes/current';

.input {
	width: 250px;
	padding: 12px 15px;
	border: 1px solid var(--stroke-separator-primary-alpha-color);
	background: var(--reskin-tertiary-dark-color);
	color: var(--white);
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	outline: none;

	&.large,
	&.full-width {
		width: 100%;
	}

	&.large {
		padding: var(--space-225) var(--space-300);

		font-family: var(--pilat-wide-font-family);
		font-size: 20px;
		line-height: 24px;
		font-weight: 450;

		@media (max-width: $min-mobile) {
			font-size: 12px;
			line-height: 18px;
			font-weight: 500;

			padding: var(--space-150) var(--space-200);
		}
	}

	&::placeholder {
		color: var(--text-secondary-color);
	}

	// TODO: move colors to input-related constants

	&:hover:not(:disabled) {
		border-color: var(--reskin-hover-secondary-dark-color);
		background: #2d3358;
	}

	&:focus {
		border-color: var(--reskin-primary-light-color);
		background: var(--reskin-tertiary-dark-color);
		outline: none;
	}

	&:disabled {
		background: #373f6d;
		color: var(--white-25);

		&::placeholder {
			color: var(--white-25);
		}
	}

	&.error {
		&,
		&:hover {
			border-color: #ff1f00;
		}
	}

	&.success {
		border-color: #5bab46;

		&:hover {
			border-color: #61c248;
			background: #2d3358;
		}
	}
}
</style>
