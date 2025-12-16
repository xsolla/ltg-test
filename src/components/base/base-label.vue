<template>
	<label>{{ label }}</label>
</template>
<script setup>
defineProps({
	label: String,
});
</script>
<style lang="scss" scoped>
label {
	display: block;
	margin: 0 0 5px 0;
	color: #a09cb9;
}
</style>
