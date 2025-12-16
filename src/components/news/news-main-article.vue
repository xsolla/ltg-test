<script setup>
import LearnMore from '~/components/base/base-learn-more.vue';

const props = defineProps({
	article: Object,
});
const articleDate = usePrettifyDate(props.article?.startDate ?? props.article.updatedAt);
</script>

<template>
	<NuxtLink
		:to="`/news/${new Date(article.updatedAt).getFullYear()}/${article.slug}`"
		v-click-metrika="{
			name: 'xpp_news_news_click',
			ev: article.articleId,
			exv: { page: 1, type: 'main' },
		}"
		class="d-f jc-b ai-c mb-px-50-L mb-4-M mb-6-S mt-10-L mt-15-M mt-20-S mt-30 mb-30 mb-4-S fw-nw-S fw-w card">
		<img class="article-image" :src="article.headerImage" alt="news-main-article" />

		<div class="w-ab-100 mt-0-S mt-10 card-body">
			<p class="article-project-name">
				{{ article.project?.name || $t('news.allNews') }}
			</p>

			<p class="article-date">
				{{ articleDate }}
			</p>

			<h3 class="article-title">
				{{ article.title }}
			</h3>

			<p class="article-preview-text">
				{{ article.text }}
			</p>

			<LearnMore small>{{ $t('news.readMore') }}</LearnMore>
		</div>
	</NuxtLink>
</template>

<style scoped lang="scss">
@import 'assets/css/variables';

.card {
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: flex-end;
	background: var(--reskin-secondary-dark-color);

	&:before {
		content: '';
		transition: all var(--common-transition-duration-easing-function);
		background: var(--reskin-secondary-dark-color);
		height: 100%;
		width: 100%;
		position: absolute;
		left: 0;
	}

	&:hover {
		&:before {
			background: var(--reskin-quinary-dark-color);
			width: calc(100% + 20px);
			left: -10px;
			right: -10px;
			height: calc(100% + 20px);
		}
	}

	@media (max-width: $max-tablet) {
		flex-wrap: wrap;
	}
}

.card-body {
	height: 100%;
	width: 50%;
	padding: 15px 50px;
	font-family: var(--pilat-wide-font-family);
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;

	@media (max-width: $max-tablet) {
		padding: 20px;
		width: 100%;
		margin-top: 0;
	}
}

.article-project-name,
.article-date {
	text-transform: uppercase;
	color: var(--reskin-secondary-neutral-color);
	font-size: 16px;
	font-weight: 900;
	line-height: 20px;

	@media (max-width: 1440px) {
		font-size: 14px;
		line-height: 18px;
	}
}

.article-title {
	margin-top: 20px;
	font-weight: 600;
	line-height: 42px;
	font-size: 40px;
	word-break: break-word;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3; /* number of lines to show */
	line-clamp: 3;
	-webkit-box-orient: vertical;

	@media (max-width: 1440px) {
		font-size: 28px;
		line-height: 34px;
		margin-top: 15px;
	}

	@media (max-width: $max-tablet) {
		font-size: 32px;
		line-height: 42px;
		width: 100%;
	}
}

.article-preview-text {
	margin: 16px 0 30px;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	word-break: break-word;
	font-family: var(--helvetica-neue-font-family);
	font-size: 16px;
	font-weight: 400;
	line-height: 25px;
	height: 75px;
	width: 100%;

	& + button {
		padding: 0;
		margin: 0;
	}

	@media (max-width: 1440px) {
		margin: 10px 0 20px;
	}

	@media (min-width: $max-tablet) and (max-width: 1440px) {
		font-size: 14px;
		font-weight: 400;
		line-height: 20px;
		height: 60px;
	}
}

.article-image {
	position: relative;
	left: 0;
	top: 0;
	width: 50%;
	object-fit: contain;

	@media (max-width: $max-tablet) {
		width: 100%;
		position: relative;
		object-fit: cover;
	}
}
</style>
