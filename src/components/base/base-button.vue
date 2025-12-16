<script setup>
import useMobileTablet from '@/composables/mobile-tablet-desktop';

const { mobile, tablet } = useMobileTablet();
</script>
<template>
	<nuxt-link
		:is="whatIs"
		:type="submit ? 'submit' : 'button'"
		:to="to"
		:target="href ? `_blank` : undefined"
		:href="href"
		class="ai-c jc-c cr-p z-1 no-select button"
		:class="`${buttonClasses} ${propClass} ${right ? 'fd-rr' : 'fd-r'}`">
		<div v-if="!link" class="w-ab-85 h-ab-40 p-a rad-50 z-1 circle" />
		<div
			:class="
				dashed
					? mobile
						? 'rad-20 dashed'
						: tablet
						? 'rad-6 dashed'
						: 'rad-45 dashed'
					: 'rad-45 bg'
			"
			class="w-ab-100 h-ab-100 p-a t-0 l-0 z-1" />

		<div class="w-ab-100 h-ab-100 fd-c jc-c ai-c p-a t-0 l-0 z-0">
			<div v-if="dashed && mobile" class="w-ab-50 h-ab-90 rad-50 dashed-bg" />
		</div>

		<div v-if="!link" class="w-ab-100 h-ab-100 p-a t-0 l-0 rad-45 z-1 border" />

		<img
			v-if="icon"
			:style="`transform: scale(${scaleImg}); margin-${
				right ? 'left' : 'right'
			}: ${margin}rem;`"
			:src="icon"
			alt="icon"
			class="w-px-1-L w-1-M w-1-S w-1 z-1" />

		<div
			v-if="!silent"
			class="z-1"
			:class="`${link ? '' : 'tt-u'} ${
				small ? 'fs-12 fw-7' : xSmall ? 'fs-12 fw-7' : 'fs-16 fw-7'
			}`">
			<slot />
		</div>
	</nuxt-link>
</template>

<script>
export default {
	// eslint-disable-next-line
	name: 'Button',
	props: {
		icon: {
			type: String,
			default: undefined,
		},
		rotate: {
			type: Boolean,
			default: false,
		},
		color: {
			type: String,
			default: 'main',
		},
		propClass: {
			type: String,
			default: '',
		},

		href: {
			type: String,
			default: undefined,
		},
		to: {
			type: String,
			default: undefined,
		},

		px: {
			type: [String, Number],
			default: undefined,
		},

		scaleImg: {
			type: String,
			default: '1',
		},

		margin: {
			type: String,
			default: '0.5',
		},

		right: Boolean,

		link: Boolean,

		block: Boolean,
		disabled: Boolean,

		dashed: Boolean,

		large: Boolean,
		small: Boolean,
		xSmall: Boolean,

		submit: Boolean,
		silent: Boolean,
	},
	computed: {
		whatIs() {
			if (this.href) {
				return 'a';
			}
			if (this.to) {
				return 'nuxt-link';
			}
			if (this.disabled) {
				return 'div';
			}
			return 'button';
		},

		buttonClasses() {
			let buttonClasses = ' ';

			if (!this.px) {
				buttonClasses += ' px-px-50-L px-6-S px-10';
			}

			if (this.block) {
				buttonClasses += ' w-ab-100';
			}
			if (this.color && !this.link) {
				buttonClasses += ` ${this.color}`;
			}
			if (this.disabled) {
				buttonClasses += ' disabled';
			}
			if (this.link) {
				buttonClasses += ' link';
			}

			if (this.large) {
				buttonClasses += ' py-px-15-L py-5-M py-8-S py-16 px-px-50-L px-9-S px-30';
			}
			if (this.small) {
				buttonClasses += ' py-px-15-L py-4-M py-6-S py-14 px-px-50-L px-4-S px-24';
			}
			if (this.xSmall) {
				buttonClasses += ' py-px-15-L py-3-M py-5-S py-8 px-px-50-L px-4-S px-24';
			}

			if (this.px) {
				buttonClasses += ` px-${this.px}-S px-${this.px}`;
			}

			return buttonClasses;
		},
	},
};
</script>

<style lang="scss" scoped>
.button {
	transition: all 250ms ease-in-out;
	//will-change: transform, filter;

	.bg,
	.dashed,
	.border {
		will-change: background-image, opacity;
		transition: all 250ms ease-in-out;
	}

	img {
		transition: all 400ms cubic-bezier(0.62, 1.39, 0.8, 1.4);
	}

	&:hover,
	&:focus {
		.bg {
			//filter: brightness(1.1);
			//transform: scale(1.04);
		}
	}

	&:active {
		//transform: scale(0.95);
		.bg {
			//filter: contrast(1) brightness(0.9);
		}
	}

	&.main {
		.border {
			background: linear-gradient(249deg, #8b49d1 0%, #6557d2 100%);

			inset: 0;
			padding: 5px;
			-webkit-mask: var(--border-mask);
			-webkit-mask-composite: xor;
			mask-composite: exclude;
		}

		.bg {
			background: var(--main-gradient);
			//border: 5px solid rgba(0, 0, 0, 0.1);
			&::before {
				content: '';
				width: 100%;
				height: 100%;

				position: absolute;
				top: 0;
				left: 0;
				border-radius: inherit;

				background: transparent;

				transition: all 200ms ease-in-out;
			}
		}

		&:hover {
			color: var(--main-color);

			.border {
				opacity: 0.3;
			}

			.bg {
				&::before {
					background: white;
				}
			}
		}

		&:active {
			color: var(--main-color);

			.border {
				opacity: 0;
			}

			.bg {
				background-image: linear-gradient(250deg, #ffffff 0%, #ffffff 100%);
			}
		}
	}

	&.modal {
		color: #fff;
		padding: 12px 64px;
		.border {
			align-items: center;
			left: 4px;
			right: 4px;
			top: 4px;
			bottom: 4px;
			width: auto;
			height: auto;
			background: linear-gradient(249.03deg, #a857ff 0%, #8576fd 100%);
			border-radius: 50px;
		}

		.bg {
			align-items: center;
			border-radius: 50px;
			background: linear-gradient(249.03deg, #8f4ed4 0%, #7163e1 100%);
			//border: 5px solid rgba(0, 0, 0, 0.1);
			&::before {
				content: '';
				width: 100%;
				height: 100%;

				position: absolute;
				top: 0;
				left: 0;
				border-radius: inherit;

				background: transparent;

				transition: all 200ms ease-in-out;
			}
		}

		&:hover {
			color: var(--main-color);

			.border {
				opacity: 0.5;
			}

			.bg {
				opacity: 0.5;
			}
		}

		&:active {
			color: var(--main-color);

			.border {
				opacity: 0;
			}

			.bg {
				background-image: linear-gradient(250deg, #ffffff 0%, #ffffff 100%);
			}
		}
	}

	&.dark {
		.bg {
			background: var(--darker-color);
			border: 1px solid var(--main-color);
		}

		&:hover,
		&:focus {
			.bg,
			.dashed {
				background: #1c1745;
				box-shadow: 0 0 7px #a857ff;
			}
		}

		&:active {
			.bg,
			.dashed {
				box-shadow: 0 0 2px transparent;
			}
		}
	}

	.dashed {
		background-color: var(--darker-color);
		border: 1px dashed var(--main-color);
	}

	.dashed-bg {
		background: rgba(168, 87, 255, 0.75);
		filter: blur(11px);
	}

	&.link {
		color: var(--main-color);

		.bg {
			background: transparent;
			border: 1px solid transparent;
		}

		&:hover {
			//img {
			//  transform: scale(1.1);
			//}
		}
	}

	&.disabled {
		cursor: default;
		opacity: 0.5;
		&:hover,
		&:focus {
			.bg,
			.dashed {
				// transform: scale(1);
				// filter: contrast(1) brightness(1);
				background: transparent !important;
				box-shadow: 0 0 0 transparent;
			}
		}
	}
}
</style>
