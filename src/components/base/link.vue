<script setup lang="ts">
const { debounceInterval, to, external, target, active } = defineProps({
	to: { type: String, required: false },
	debounceInterval: { type: Number, default: 500 },
	target: { type: String, required: false },
	external: { type: Boolean, default: false },
	active: { type: Boolean, default: true },
});

const { $router } = useNuxtApp();

const isLinkClickable = ref(true);

const toggleLinkClick = () => {
	if (!to) {
		return;
	}

	if (!external) {
		$router.push(to);
	} else {
		const navigationTarget = target || '_self';

		navigateTo(to, { external, open: { target: navigationTarget } });
	}

	isLinkClickable.value = false;
	setTimeout(() => (isLinkClickable.value = true), debounceInterval);
};
</script>
<template>
	<NuxtLink
		v-if="active"
		:to="isLinkClickable ? to : ''"
		v-on:click="toggleLinkClick"
		:target="target"
		:external="external">
		<slot></slot>
	</NuxtLink>
	<span v-else><slot></slot></span>
</template>
