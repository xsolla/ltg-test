<template>
	<div class="fd-c dialog of-h from-in">
		<header
			v-if="$slots.header"
			class="w-ab-100 py-5-S py-15 px-5-S px-15 fs-40-XL fs-20-L fs-14-M fs-16-S fs-18 fd-r ai-c jc-b"
			:class="[headerColor]">
			<slot name="header" />
			<BaseButton
				ghost
				link
				icon="/close.png"
				silent
				style="transform: translateX(30%) scale(0.5)"
				:class="{ 'o-0 cr-d': closed }"
				@click="close" />
		</header>
		<div v-else>
			<BaseButton
				ghost
				link
				icon="/close.png"
				silent
				style="
					transform: translateX(30%) scale(0.5);
					position: absolute;
					top: 0;
					right: 0;
					margin-top: 0.5rem;
					margin-right: 0.5rem;
				"
				:class="{ 'o-0 cr-d': closed }"
				@click="close" />
		</div>
		<main
			v-if="$slots.body"
			:class="
				full
					? `w-ab-100 fs-12 ${mclass}`
					: `w-ab-100 py-3-S py-10 px-4-S px-10 fs-12 ${mclass}`
			">
			<slot name="body" />
		</main>
		<footer v-if="$slots.footer" class="w-ab-100 fd-r jc-c py-3-S py-10 px-4-S px-10">
			<slot name="footer" />
		</footer>
	</div>
</template>

<script>
import BaseButton from '@/components/base/base-button.vue';
export default {
	components: { BaseButton },
	props: {
		headerColor: {
			type: String,
			default: 'grey',
		},
		full: {
			type: Boolean,
			default: false,
		},
		mclass: {
			type: String,
			default: '',
		},
		closed: Boolean,
	},
	methods: {
		close() {
			// document.querySelector('body').style.overflowY = 'auto';
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.dialog {
	backdrop-filter: blur(1vw);
	border-radius: var(--radius-large);
	background: var(--darker-color);
	header {
		&.blue {
			background-color: rgba(81, 138, 250, 0.3);
		}
		&.red {
			background-color: rgba(212, 91, 128, 0.5);
		}
		&.grey {
			background: var(--glass-dark);
		}
		&.main {
			background: var(--main-gradient);
		}
	}
	main {
	}
	footer {
		background: var(--glass-dark);
	}
}
</style>
