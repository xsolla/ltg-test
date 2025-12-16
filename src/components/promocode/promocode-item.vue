<template>
	<article class="promocodes__item">
		<figure class="promocodes__item-pic">
			<img :src="promocodePic" width="30" height="30" alt="" />
		</figure>
		<div class="promocodes__item-info">
			<h2 class="promocodes__item-title">
				{{ promocode.promocode.pack.name }}
			</h2>
			<dl class="promocodes__item-dates">
				<div v-if="useDate" class="option">
					<dt>{{ $t('promocodes.received') }}:</dt>
					<dd>{{ useDate }}</dd>
				</div>
				<div v-if="activationDate" class="option">
					<dt>{{ $t('promocodes.activated') }}:</dt>
					<dd>{{ activationDate }}</dd>
				</div>
			</dl>
		</div>
		<div @click="onPromocodeStatusClick" class="promocodes__item-actions">
			<span class="badge" :class="{ 'badge--link': promocode.paymentUrl }">{{ status }}</span>
		</div>
	</article>
</template>

<script setup>
const props = defineProps({
	promocode: Object,
});

const { $i18n } = useNuxtApp();

const useDate = computed(() => {
	if (!props.promocode?.useDate) {
		return null;
	}
	return getDate(props.promocode.useDate);
});

const activationDate = computed(() => {
	if (!props.promocode?.activationDate) {
		return null;
	}
	return getDate(props.promocode.activationDate);
});

const promocodePic = computed(() => {
	if (props.promocode?.promocode?.pack?.game?.images?.icon) {
		return props.promocode.promocode.pack.game.images.icon;
	}
	return '/profile/promocodes/logo_1.png';
});

const status = computed(() => {
	if (props.promocode.paymentUrl) return 'Apply';

	if (props.promocode.status === 'used') return $i18n.t('promocodes.activated');

	return $i18n.t('promocodes.inProcess');
});

function getDate(date) {
	date = new Date(date);
	const localOffset = date.getTimezoneOffset();
	const gmtTime = new Date(date.getTime() + localOffset * 60 * 1000);
	return new Date(gmtTime).toLocaleDateString('fr-CH', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	});
}
async function onPromocodeStatusClick() {
	if (!props.promocode.paymentUrl) return;
	await navigateTo(props.promocode.paymentUrl, {
		open: {
			target: '_blank',
		},
	});
}
</script>

<style lang="scss" scoped>
.badge {
	background: var(--reskin-primary-neutral-color);
}
</style>
