<script lang="ts" setup>
type Variant = 'outline' | 'accent' | 'accent-gradient' | 'active-toggle';
type Size = 'default' | 'small' | 'medium';
type StretchMode = 'default' | 'full-width';

interface Props {
	variant?: Variant;
	size?: Size;
	stretchMode?: StretchMode;
	href?: string;
	disabled?: boolean;
	target?: '_self' | '_blank';
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'outline',
});
</script>

<template>
	<!--	TODO: refactor-->
	<NuxtLink
		:href="href"
		:target="target"
		:class="[
			$style.button,
			{
				[$style.outline]: variant === 'outline',
				[$style.accent]: variant === 'accent',
				[$style['accent-gradient']]: variant === 'accent-gradient',
				[$style['active-toggle']]: variant === 'active-toggle',
				[$style.small]: size === 'small',
				[$style.medium]: size === 'medium',
				[$style['full-width']]: stretchMode === 'full-width',
				[$style.disabled]: disabled,
			},
		]"
		v-if="href">
		<slot />
	</NuxtLink>

	<button
		:disabled="disabled"
		:class="[
			$style.button,
			{
				[$style.outline]: variant === 'outline',
				[$style.accent]: variant === 'accent',
				[$style['accent-gradient']]: variant === 'accent-gradient',
				[$style['active-toggle']]: variant === 'active-toggle',
				[$style.small]: size === 'small',
				[$style.medium]: size === 'medium',
				[$style['full-width']]: stretchMode === 'full-width',
				[$style.disabled]: disabled,
			},
		]"
		v-else>
		<slot />
	</button>
</template>

<style module lang="scss">
@import 'assets/css/themes/current';
@import 'assets/css/variables';

@property --first-gradient-color {
	syntax: '<color>';
	initial-value: #000;
	inherits: false;
}

@property --second-gradient-color {
	syntax: '<color>';
	initial-value: #fff;
	inherits: false;
}

.button {
	font-size: 16px;
	font-weight: 700;
	text-transform: uppercase;
	color: var(--white);
	font-family: var(--pilat-wide-font-family);
	text-align: center;
	padding: 20px 30px;

	transition:
		--first-gradient-color var(--common-transition-duration-easing-function),
		--second-gradient-color var(--common-transition-duration-easing-function);

	&:hover {
		cursor: pointer;
	}

	&.active-toggle,
	&.outline {
		transition: all var(--common-transition-duration-easing-function);

		border: 1px var(--reskin-primary-light-color) solid;
		padding: 19px 29px;
		color: var(--reskin-primary-light-color);

		&:hover {
			border-color: var(--white);
			color: var(--white);
		}

		&:active {
			background: var(--reskin-active-outline-button-background-color);
			border-color: var(--reskin-primary-light-color);
			color: var(--reskin-primary-light-color);
		}

		&.disabled {
			background: var(--reskin-active-outline-button-background-color);
			border-color: var(--white-15);
			color: var(--white-15);
		}
	}

	&.accent {
		--first-gradient-color: var(--white);
		--second-gradient-color: var(--white);

		background: linear-gradient(var(--first-gradient-color), var(--second-gradient-color));
		color: var(--primary-dark-text-color);

		&:hover {
			--first-gradient-color: var(--reskin-hover-button-gradient-first-color);
			--second-gradient-color: var(--reskin-hover-button-gradient-second-color);
		}

		&:active {
			--first-gradient-color: var(--reskin-primary-neutral-color);
			--second-gradient-color: var(--reskin-primary-neutral-color);
		}
	}

	&.accent-gradient {
		padding: 20px 40px;
		min-width: 150px;

		--first-gradient-color: var(--reskin-accent-button-gradient-first-color);
		--second-gradient-color: var(--reskin-accent-button-gradient-second-color);

		background: linear-gradient(
			var(--reskin-accent-button-gradient-rotation-angle),
			var(--first-gradient-color),
			var(--second-gradient-color)
		);

		color: var(--primary-dark-text-color);

		&:hover {
			--first-gradient-color: var(--reskin-hover-accent-button-gradient-first-color);
			--second-gradient-color: var(--reskin-hover-accent-button-gradient-second-color);
		}

		&:active {
			--first-gradient-color: var(--reskin-active-accent-button-gradient-first-color);
			--second-gradient-color: var(--reskin-active-accent-button-gradient-second-color);
		}

		@media (max-width: $mid-tablet) {
			padding: 20px 45px;
		}
	}

	&.active-toggle {
		background: var(--reskin-active-outline-button-background-color);
		color: var(--reskin-primary-light-color);
	}

	&.small {
		padding: 5px 30px;

		@media (max-width: $max-mobile) {
			font-size: 12px;
		}
	}

	&.medium {
		padding: var(--space-150) var(--space-250);

		line-height: 16px;
		font-size: 14px;
	}

	&.full-width {
		width: 100%;
	}

	&.disabled {
		background: var(--reskin-disabled-button-background-color);
		color: var(--white-40);
		cursor: inherit;
		pointer-events: none;
	}
}
</style>
