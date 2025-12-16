<script setup lang="ts"></script>

<template>
	<span :class="$style.container">Loading</span>
</template>

<style module lang="scss">
.container {
	font-size: 18px;
	font-weight: 600;

	&:after {
		position: absolute;
		content: '';
		animation: dotsLoading 1.25s infinite linear;
	}
}

@keyframes dotsLoading {
	0% {
		content: '';
	}

	25% {
		content: '.';
	}

	50% {
		content: '..';
	}

	75% {
		content: '...';
	}
}
</style>
