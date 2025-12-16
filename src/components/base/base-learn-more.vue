<template>
	<button @click="$emit('click')" class="learn-more-button">
		<span style="margin-right: 6px"><slot></slot></span>
		<svg
			width="24"
			height="9"
			viewBox="0 0 24 9"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path d="M18.1397 5.625H0.5V3.375H18.1397V0L24 4.5L18.1397 9V5.625Z" />
		</svg>
	</button>
</template>

<script>
export default {
	name: 'learn-more',
};
</script>

<style lang="scss" scoped>
.learn-more-button {
	padding: 5px 0 0 0;
	margin: 0 0 20px 0;
	font-size: 18px;
	font-style: normal;
	font-weight: 450;
	line-height: normal;
	transition: color linear 0.3s;
	font-family: var(--pilat-wide-font-family);
	color: var(--reskin-primary-light-color);

	&:hover {
		color: #ffffff;

		svg {
			transform: translateX(5px);
			fill: #ffffff;
		}
	}

	svg {
		fill: var(--reskin-primary-light-color);
		transition:
			fill linear 0.3s,
			transform linear 0.3s;
	}
}
</style>
