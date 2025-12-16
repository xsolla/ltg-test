<template>
	<span
		:class="[$style.container, { [$style['full-height']]: variant === 'full-height' }]"
		@mousemove="$emit('move', $event)"
		@mouseleave="$emit('leave', $event)">
		<picture :class="[$style.image, { [$style.loaded]: isImageLoaded }]">
			<img
				ref="image"
				:src="src"
				:alt="alt"
				:class="[
					{
						[$style.cover]: objectFit === 'cover',
						[$style.contain]: objectFit === 'contain',
					},
				]"
				@load="onImageLoaded" />
		</picture>
	</span>
</template>

<script setup lang="ts">
interface Props {
	src: string;
	alt: string;
	objectFit?: 'cover' | 'contain';
	variant?: 'default' | 'full-height';
}

const props = defineProps<Props>();

const isImageLoaded = ref<boolean>();

const onImageLoaded = () => {
	isImageLoaded.value = true;
};

const image = ref<HTMLImageElement | null>(null);
onMounted(() => {
	if (image.value!.complete) {
		onImageLoaded();
	}
});
</script>

<style lang="scss" module>
.container {
	width: 100%;
	display: flex;
	flex-direction: row;

	&.full-height {
		height: 100%;
	}
}

.image-placeholder {
	width: 100%;
	height: 100%;
	padding-bottom: 0.5vw;
	position: absolute;
	left: 0;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.image {
	width: 100%;
	height: 100%;
	transition: 0.5s;
	display: flex;
	justify-content: center;
	align-items: center;
	opacity: 0;

	&.loaded {
		opacity: 1;
		animation-name: shutters;
		animation-duration: 2s;
	}

	& > img {
		width: 100%;
		height: 100%;

		&.cover {
			object-fit: cover;
		}

		&.contain {
			object-fit: contain;
		}
	}
}
</style>
