<template>
	<div class="metaframe-info">
		<a
			class="link"
			target="_blank"
			href="https://ltg.com/news/2023/7-day-free-access-to-life-is-feudal-mmo">
			How to activate trial
		</a>
		<a class="link" target="_blank" href="https://ltg.com/news/2023/how-to-register-on-ltgcom">
			How to register
		</a>
	</div>
</template>
<script setup lang="ts">
definePageMeta({
	layout: 'metaframe',
});
</script>
<style lang="css" scoped>
.metaframe-info {
	display: flex;
	flex-direction: column;
	gap: 16px;
	background-color: transparent !important;
	padding: 0 32px;
}

.link {
	text-decoration: none;
	color: #000;
	text-transform: uppercase;
	background: rgba(177, 185, 231, 1);
	line-height: 21px;
	height: 50px;
	font-size: 16px;
	font-weight: 700;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	flex: 1 auto;
	transition: all ease 0.25s;
	font-family: 'Pilat Wide', 'Montserrat', Helvetica, Arial, sans-serif;
}

.link:hover {
	background: #fff;
}

.link:active {
	background: rgba(127, 139, 201, 1);
}

@media (max-width: 768px) {
	.metaframe-info {
		padding: 24px 20px 0 20px;
	}
	.link {
		white-space: pre-line;
		padding: 32px 0;
	}
}
</style>
