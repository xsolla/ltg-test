<script setup lang="ts">
import LInput from '~/components/base/l-input.vue';
</script>

<template>
	<article>
		<h3>Share link</h3>

		<p>Send the link to download the web version to yourself or a friend</p>

		<LInput :disabled="true" v-model="'www.downloadlis.com'" />
	</article>
</template>
<style lang="scss" module>
.container {
	background: #161d45;
	border-radius: 15px;
	padding: 30px;
}
</style>
