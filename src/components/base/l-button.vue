<script setup>
const props = defineProps({
	variant: {
		type: String,
		default: 'button--primary',
	},
	sizes: {
		type: String,
		default: 'md',
	},
	icon: {
		type: String,
		default: undefined,
	},
	href: {
		type: String,
		default: undefined,
	},
	to: {
		type: String,
		default: undefined,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const buttonClasses = computed(() => {
	let result = '';

	if (props.disabled) {
		result += 'disabled ';
	}

	if (props.variant === 'accent') {
		result += 'button--accent ';
	} else if (props.variant === 'outline') {
		result += 'button--outline ';
	} else if (props.variant === 'default') {
		result += 'button--default ';
	}

	if (props.sizes === 'sm') {
		result += 'button--sm ';
	} else if (props.sizes === 'md') {
		result += 'button--md ';
	} else if (props.sizes === 'lg') {
		result += 'button--lg ';
	}

	return result;
});
</script>
<template>
	<NuxtLink v-if="to" :to="to" class="button" :class="buttonClasses">
		<slot></slot>
	</NuxtLink>
	<a :href="href" v-else-if="href" class="button" :class="buttonClasses">
		<slot></slot>
	</a>
	<button v-else class="button" :class="buttonClasses">
		<slot></slot>
	</button>
</template>
<style lang="scss" scoped>
@import './src/assets/css/styles.scss';

.button {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 30px;
	border: 1px solid transparent;
	border-radius: 30px;
	background-color: transparent;
	color: var(--button-text-color);
	font-weight: 700;
	will-change: background-image, opacity;
	text-transform: uppercase;
	text-align: center;
	cursor: pointer;

	@include transition(all, 0.25s, ease-in-out);

	&:disabled {
		cursor: text;
		box-shadow: none;

		&:hover {
			cursor: text;
			box-shadow: none;
			background: inherit;
		}
	}

	//Кнопка с обводкой
	&--outline {
		background-color: var(--button-outline-bg);
		border-color: var(--button-outline-border);
		color: var(--button-outline-color);

		&:hover {
			background-color: var(--button-outline-hover-bg);
			border-color: var(--button-outline-hover-border);
			color: var(--button-outline-hover-color);
		}

		&:active {
			background-color: var(--button-outline-active-bg);
		}

		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}
	}

	//"Фиолетовая кнопка"
	&--accent {
		border-color: transparent;
		background: var(--button-accent-bg);
		color: var(--button-accent-color);

		&:hover,
		&:active {
			border-color: transparent;
			background: var(--button-accent-hover-bg);
			color: var(--button-accent-hover-color);
		}

		&:disabled {
			cursor: not-allowed;
			color: var(--button-accent-disabled-color);
		}
	}

	//"Тёмная кнопка"
	&--default {
		background: var(--button-default-bg);
		color: var(--button-default-color);

		svg {
			margin-right: 10px;
		}

		&:hover {
			background: var(--button-default-hover-bg);
		}

		&:disabled {
			background: var(--button-default-disabled-color);
		}
	}

	//Размеры кнопок
	&--lg {
		height: 60px;
		font-size: 16px;
	}

	&--md {
		height: 50px;
		font-size: 14px;
	}

	&--sm {
		height: 40px;
		font-size: 12px;
	}

	&--download {
		@media screen and (max-width: $max-mobile) {
			display: none;
		}
	}
}
</style>
