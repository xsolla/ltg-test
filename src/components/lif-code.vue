<script setup lang="ts">
import type { GameKeyPackageItem } from '~/types';
type Props = {
	code: GameKeyPackageItem;
	codenum: number;
};
const props = defineProps<Props>();

const copied = ref(false);

function copyToClipboard(text: string) {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			copied.value = true;
			setTimeout(() => {
				copied.value = false;
			}, 5000);
		})
		.catch((err) => {
			console.error(err);
		});
}
</script>
<template>
	<li class="codes__item">
		<span class="codes__item-name"> Code #{{ props.codenum + 1 }}</span>
		<div class="codes__item-wrapper">
			<span class="codes__item-value">{{ props.code.code }}</span>
			<button
				v-if="!copied"
				class="codes__item-copy"
				type="button"
				@click="copyToClipboard(props.code.code)">
				<IconCopy />
			</button>
			<button v-else class="codes__item-copy" type="button">
				<IconUiKitCheck width="18" height="18" />
			</button>
		</div>
	</li>
</template>

<style scoped lang="scss">
.code__item {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.codes__item-name {
	font-family: 'Ubuntu', sans-serif;
	font-style: normal;
	font-weight: 500;
	font-size: 22px;
	line-height: 29px;
	color: #db9909;
}

.codes__item-wrapper {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 6px;
	margin: 5px 0 0 0;
}

.codes__item-copy {
	display: flex;
	align-items: flex-end;
	width: 18px;
	height: 18px;
	background-color: transparent;
	border: none;
	cursor: pointer;
}

.codes__item-value {
	white-space: nowrap;
	text-transform: uppercase;
	font-family: 'Ubuntu', sans-serif;
	font-style: normal;
	font-weight: 300;
	font-size: 15px;
	line-height: 20px;
	color: #ffffff;
}
</style>
