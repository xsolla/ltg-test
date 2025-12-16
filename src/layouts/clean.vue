<script setup>
import TheHeader from '@/components/the-header.vue';
import TheFooter from '@/components/the-footer.vue';
</script>
<template>
	<div class="w-ab-100 fd-c">
		<TheHeaderNew />
		<div style="min-height: 100vh">
			<NuxtPage class="pb-10 z-10" />
		</div>
		<TheFooter class="z-20" />
	</div>
</template>
