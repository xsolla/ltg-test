<template>
	<div class="pagination">
		<div v-if="pages > 1" class="pagination__list" :class="{ disabled: false }">
			<div
				class="pagination__item pagination__prev"
				:class="{ disabled: page === 1 }"
				@click="prev">
				<img src="/icons/chevron.svg" class="h-ab-30" style="transform: rotate(180deg)" />
			</div>
			<div
				v-for="(i, index) in items"
				:key="`${i} ${index}`"
				class="pagination__item"
				:class="{ active: i === page, disabled: i === '...' }"
				@click="$emit('set', i)">
				<span>
					{{ i }}
				</span>
			</div>
			<div
				class="pagination__item pagination__next"
				:class="{ disabled: page === pages }"
				@click="next">
				<img src="/icons/chevron.svg" class="h-ab-30" />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		pages: Number,
		page: Number,
	},
	computed: {
		items() {
			const result = [];
			result.push(1);
			if (this.pages > 7) {
				if (this.page <= 4) {
					for (let i = 2; i < 6; i++) {
						result.push(i);
					}
				}

				if (this.page > 4) {
					result.push('...');
					if (this.page < this.pages - 3) {
						for (let i = this.page - 1; i < this.page + 2; i++) {
							result.push(i);
						}
					} else {
						for (let i = this.pages - 4; i <= this.pages; i++) {
							result.push(i);
						}
					}
				}

				if (this.page < this.pages - 3) {
					result.push('...');
					result.push(this.pages);
				}

				return result;
			}

			for (let i = 2; i < this.pages + 1; i++) {
				result.push(i);
			}

			return result;
		},
	},
	methods: {
		prev() {
			this.$emit('set', this.page === 1 ? 1 : this.page - 1);
		},
		next() {
			this.$emit('set', this.page === this.pages ? this.pages : this.page + 1);
		},
	},
};
</script>

<style lang="scss" scoped>
.pagination__list {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 10px;
}

.pagination__item {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	background: var(--white);
	box-sizing: border-box;
	cursor: pointer;
	transition: transform linear 0.2s;

	span {
		color: var(--primary-dark-text-color);
		text-align: center;
		font-size: 14px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		text-transform: uppercase;
	}

	&:hover {
		transform: scale(1.1);
	}

	&.active {
		cursor: default;
		background: var(--reskin-secondary-dark-color);

		& > span {
			color: var(--white);
		}
	}
	&.disabled {
		cursor: default;
		opacity: 0.5;
		transform: scale(1);
		border-color: rgba(133, 118, 253, 0.5);
	}
}
</style>
