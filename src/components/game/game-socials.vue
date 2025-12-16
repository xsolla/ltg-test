<template>
	<ul class="game-social">
		<li v-for="(link, index) in links" :key="index" class="game-social__item">
			<a
				target="_blank"
				:href="link.href"
				class="game-social__link"
				v-click-metrika="{
					name: 'xpp_game_social_click',
					ev: gameId,
					exv: { name: link.name },
				}">
				<!-- TODO: change item styles to bem -->
				<img :src="`/socials/${link.name}.svg`" alt="socials"
			/></a>
		</li>
	</ul>
</template>
<script>
export default {
	name: 'game-socials',
	props: {
		socials: Array,
		gameId: String,
	},
	computed: {
		links() {
			if (!this.socials || !Array.isArray(this.socials)) {
				return [];
			}
			return this.socials.filter((s) => s.href && s.name);
		},
	},
};
</script>
<style scoped lang="scss">
.game-social__item {
	width: 30px;
	height: 30px;
	margin: 0 0 5px 0;

	&:last-child {
		margin-bottom: 0;
	}

	@media screen and (max-width: 600px) {
		width: 40px;
		height: 40px;
	}
}

.game-social__link {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	opacity: 1;
	transition: opacity ease-in 0.3s;

	img {
		width: 100%;
		height: auto;
	}

	&:hover {
		opacity: 0.8;
	}
}
</style>
