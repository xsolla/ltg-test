<script setup>
const route = useRoute();
if (route.query.return_url) {
	await navigateTo(`/game/${route.query.return_url}`);
} else {
	await navigateTo('/');
}
</script>
<template>
	<section class="content-page">
		<div class="container payment-success">
			<h2 class="">{{ $t('paymentSuccess.title') }}</h2>
			<div class="content-wrapper">
				<p>{{ $t('paymentSuccess.desc') }}</p>
			</div>
		</div>
	</section>
</template>
<style lang="css" scoped>
.payment-success {
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
