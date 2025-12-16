<template>
	<button v-if="!href" :class="buttonClasses">
		<span class="arden-button__text">
			<slot></slot>
		</span>
	</button>
	<a v-else :href="href" :class="buttonClasses">
		<span class="arden-button__text">
			<slot></slot>
		</span>
	</a>
</template>

<script lang="ts" setup>
const props = defineProps<{
	href?: string;
	size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
	color: 'primary' | 'secondary' | 'accent';
	disabled?: boolean;
}>();

const buttonClasses = computed(() => {
	const classes = ['arden-button', `arden-button--${props.size}`, `arden-button--${props.color}`];

	if (props.disabled) {
		classes.push('arden-button--disabled');
	}

	return classes.join(' ');
});
</script>

<style lang="scss">
.arden-button {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px 24px;
	border: none;
	border-radius: 0 !important;
	color: #000000;
	opacity: 1;
	cursor: pointer;
	background-color: transparent;
	background-repeat: no-repeat;

	&:before,
	&:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-position: center;
		transition: opacity 0.3s ease-in-out;
	}

	&:before {
		z-index: 1;
		opacity: 1;
	}

	&:after {
		z-index: 2;
		opacity: 0;
	}

	&:hover {
		&:before {
			opacity: 0;
		}

		&:after {
			opacity: 1;
		}
	}

	span {
		position: relative;
		z-index: 10;
		font-family: 'Goudy Trajan', serif;
		font-style: normal;
		font-weight: 700;
		text-transform: uppercase;
	}

	&--disabled {
		filter: brightness(0.5) hue-rotate(10deg) grayscale(1) contrast(1.1) saturate(1.7)
			opacity(0.93);
		color: #cccccc;
		opacity: 0.7;
		cursor: not-allowed;

		&:hover {
			background-image: url('https://cdn.ltg.com/lif/images/cbt/button-one-row.png') !important;
		}
	}

	//yellow заменено на primary (зеленая кнопка)
	&--yellow,
	&--primary {
		&:before {
			background-image: url('https://cdn.ltg.com/lif/images/arden/button-arden-primary.png');
		}

		&:after {
			background-image: url('https://cdn.ltg.com/lif/images/arden/button-arden-hover.png');
		}

		span {
			color: #ffffff;
		}
	}

	//light заменено на secondary (светло-серая кнопка)
	&--light,
	&--secondary {
		&:before {
			background-image: url('https://cdn.ltg.com/lif/images/arden/button-arden-secondary.png');
		}

		&:after {
			background-image: url('https://cdn.ltg.com/lif/images/arden/button-arden-hover.png');
		}

		span {
			color: #000000;
		}
	}

	//кнлопка с красным фоном
	&--accent {
		&:before {
			background-image: url('https://cdn.ltg.com/lif/images/arden/accent-button.png');
		}

		&:before {
			background-image: url('https://cdn.ltg.com/lif/images/arden/button-arden-hover.png');
		}
	}

	&--xsmall {
		span {
			font-size: 16px;
		}
	}

	&--small {
		span {
			font-size: 18px;
		}
	}

	&--medium {
		span {
			font-size: 20px;
		}
	}

	&--large {
		span {
			font-size: 22px;
		}
	}

	&--xlarge {
		span {
			font-size: 25px;
		}
	}
}
</style>
