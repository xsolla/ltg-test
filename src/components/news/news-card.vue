<script setup>
import useMobileTablet from '@/composables/mobile-tablet-desktop';
import { localeCookieKey } from '~/utils/ltg';
import { localizeArticle } from '~/utils/article';

const props = defineProps({
	article: Object,
	size: {
		type: [Number, String],
		default: 4,
	},
	xmName: {
		type: String,
		default: '',
	},
	xmMainNews: {
		type: String,
		default: 'nonmain',
	},
	page: {
		type: Number,
		default: 1,
	},
	isHorizontalScroll: {
		default: false,
		type: Boolean,
	},
	target: {
		type: String,
		default: '_self'
	}
});

const localeCookie = useCookie(localeCookieKey);
const localizedArticle = computed(() => {
	return localizeArticle(props.article, localeCookie.value);
});

if (props.xmName !== '') {
	// eslint-disable-next-line
	props.article.xm = {
		name: props.xmName,
		exv: { page: props.page, type: props.xmMainNews },
		ev: props.article?.articleId,
	};
}

const { mobile, tablet } = useMobileTablet();
const cardClasses = computed(() => {
	let cardClasses = ' ';
	if (props.size) {
		cardClasses = cardClasses += ' ';
	}
	return cardClasses;
});

const articleDate = usePrettifyDate(props.article?.startDate ?? props.article.updatedAt);
</script>

<template>
	<NuxtLink
		:to="`/news/${new Date(article.updatedAt).getFullYear()}/${article.slug}`"
		:target="target"
		v-click-metrika="props.article.xm"
		class="card"
		:class="[cardClasses]">
		<div :class="{ 'w-60': isHorizontalScroll }" class="w-ab-100 fd-c jc-c card-wrapper">
			<div class="article-picture-wrapper">
				<img
					class="article-picture"
					:src="localizedArticle.headerImage"
					:alt="localizedArticle.title" />
			</div>
			<div class="content-wrapper">
				<div class="title-wrapper">
					<p class="project-name">{{ article?.project?.name || $t('news.allNews') }}</p>
					<p class="article-date">{{ articleDate }}</p>
				</div>
				<div class="content">
					<h3 class="article-title">{{ localizedArticle.title }}</h3>
					<p class="article-preview-text">{{ localizedArticle.text.slice(0, 80) }}</p>
				</div>
			</div>
		</div>
	</NuxtLink>
</template>
<style scoped lang="scss">
@import 'assets/css/variables';

.card-wrapper {
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: flex-start;
}

.content-wrapper {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	padding: 8px 0 20px;
}

.title-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 5px 20px;
}

.project-name {
	display: flex;
	flex: 1;
	color: #6b7299;
	font-family: var(--pilat-wide-font-family);
	font-weight: 700;
	font-size: 12px;
	line-height: 16px;
	text-transform: uppercase;
	margin-right: 5px;
}

.card.cbt-style {
    p.project-name {
        color: #FFC148!important;
    }
}

.content {
	padding: 0 20px;
	max-height: 120px;
	height: 100%;
}

.article-date {
	font-weight: 700;
	font-size: 12px;
	line-height: 15px;
	color: #b0b8df;
}

.article-title {
	font-family: var(--pilat-wide-font-family);
	color: var(--white);
	font-weight: 600;
	font-size: 20px;
	line-height: 25px;
	width: 100%;
	word-break: break-word;
	text-overflow: ellipsis;
	max-width: 100%;

	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;

	margin-top: 14px;
}

.article-preview-text {
	color: var(--white-70);
	font-size: 14px;
	font-weight: 500;
	line-height: 17px;
	min-height: 51px;
	width: 100%;

	margin-top: 10px;
}

.article-picture-wrapper {
	aspect-ratio: 1.8;
	align-items: center;
	justify-content: center;
	display: flex;
}

.article-picture {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	object-fit: cover;
}

.card {
	display: flex;
	justify-content: center;
	align-items: center;

	&:before {
		content: '';
		transition: all var(--common-transition-duration-easing-function);
		background: var(--reskin-secondary-dark-color);
		height: 100%;
		width: 100%;
		position: absolute;
	}

	@media (hover: hover) {
		&:hover {
			&:before {
				background: var(--reskin-quinary-dark-color);
				width: calc(100% + 10px);
				height: calc(100% + 10px);
			}
		}
	}
}

p {
	word-break: break-word;
}

.news__btn-more {
	white-space: nowrap;
}

.news__btn-more .button {
	font-size: 100px;
}
</style>
