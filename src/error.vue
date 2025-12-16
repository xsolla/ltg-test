<script setup lang="ts">
import LPicture from '~/components/base/l-picture.vue';
import LButton from '~/components/base/v2/l-button.vue';
import { clearError } from 'nuxt/app';

const props = defineProps({
	error: Object,
});

console.error('props.error', props.error);
const handleError = () => clearError({ redirect: '/' });
</script>

<template>
	<div class="w-ab-100 fd-c">
		<main :class="$style.main" class="w-ab-100 h-ab-100 fd-c jc-c ai-c z-10">
			<LPicture src="/oops.png" alt="error-image" />
			<div v-if="error?.statusCode === 404" class="mb-4">
				<h1 class="fs-50-M fs-20-S fs-90 mt-2-M mt-3-S mt-5">{{ $t('common.404') }}</h1>
			</div>
			<div v-else class="fd-c jc-c ai-c">
				<h1 class="fs-50-M fs-20-S fs-90 mt-2-M mt-3-S mt-5">{{ $t('common.oops') }}</h1>
				<div class="fs-24-M fs-32-S fs-14 mt-1-M mt-2-S mt-5 mb-4">
					{{ $t('common.500') }}
				</div>
			</div>
			<LButton variant="accent" href="#" @click.prevent="handleError">{{
				$t('menu.home')
			}}</LButton>
		</main>
	</div>
</template>
<style module lang="scss">
@import '@/assets/css/base';
.main {
	height: 80vh;

	& > span:first-child {
		width: 20vw;

		@media (min-width: $max-mobile) {
			width: 13vw;
		}

		@media (min-width: $max-tablet) {
			width: 7vw;
		}
	}

	@media (max-width: 1500px) {
		height: 85vh;
	}
	@media (max-width: 1100px) {
		height: 84vh;
	}
}
</style>
