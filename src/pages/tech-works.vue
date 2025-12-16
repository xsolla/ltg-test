<template>
	<section class="content-page">
		<div class="container tech-works">
			<h2 class="">{{ $t('techWorks.title') }}</h2>
		</div>
	</section>
</template>
<script setup>
const { data: techWorksOn } = await useAsyncData(() => useTechWorks());
const user = useState('user');
const toHome = () => {
	if (!techWorksOn.value || user?.value?.data?.admin) {
		navigateTo('/');
	} else {
		useHead({
			title: 'LTG || Tech Works Sorry...',
		});
	}
};
watch(user, () => {
	toHome();
});
toHome();
</script>
<style lang="css" scoped>
.tech-works {
	display: flex;
	flex-direction: column;
	place-content: center;
	justify-items: center;
	align-items: center;
	height: 80vh;
	width: 100%;
	color: white;
	text-align: center;
}
</style>
