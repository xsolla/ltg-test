<script setup lang="ts">
import { defineEmits } from 'vue';
import BurgerIcon from '~/components/icon/ui-kit/burger.vue';

type Emits = {
	(e: 'click'): void;
};

const emit = defineEmits<Emits>();
</script>

<template>
	<button :class="$style.button" @click="emit('click')">
		<BurgerIcon class="burger-icon"/>
	</button>
</template>

<style module lang="scss">
.button {
	display: flex;
}
</style>
