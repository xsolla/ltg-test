<template>
	<news :page="route.params.number" />
</template>

<script setup>
import News from '@/pages/news/index.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
