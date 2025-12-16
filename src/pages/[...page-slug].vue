<script setup>
import { useNuxtApp, useRoute, useAsyncData, useHead, createError } from 'nuxt/app';

const { $api } = useNuxtApp();
const route = useRoute();
const { data: content } = await useAsyncData(() => $api.getPage({ endpoint: route.fullPath }));
if (!content.value || !content.value?.isPublish) {
	throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}
useHead({
	title: `${content.value.title} | Long Tale Games`,
	meta: [{ name: 'description', content: content?.value?.metaTags?.description }],
});
</script>

<template>
	<section class="content-page">
		<div class="container">
			<h2 class="">{{ content?.title }}</h2>
			<div class="content-wrapper">
				<div class="html mb-14-M" v-html="content?.content"></div>
			</div>
		</div>
	</section>
</template>
