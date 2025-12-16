<template>
	<news :year="route.params.year" />
</template>

<script setup>
import News from '@/pages/news/index.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
