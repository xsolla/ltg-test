<script setup>
import useMobileTablet from '@/composables/mobile-tablet-desktop';
import LPicture from '~/components/base/l-picture.vue';
import LButton from '~/components/base/v2/l-button.vue';
import HTMLRenderer from '~/components/html-renderer.vue';
import { localeCookieKey } from '~/utils/ltg';
import { localizeArticle } from '~/utils/article';

const { $api, $router } = useNuxtApp();
const route = useRoute();
const currentSlug = ref(route.params.newsslug.join('\/'));

const localeCookie = useCookie(localeCookieKey);

const { data } = await useAsyncData(async () => {
	const article = await $api.getArticle(currentSlug.value);
	const related = await $api.getRelatedArticles(
		article.value?.project?._id || article.value?.project || ''
	);
	return {
		article,
		relatedArticles: related?.filter((article) => article.slug !== currentSlug.value),
	};
});

if (!data.value?.article) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Article not found',
		fatal: true,
	});
}

if (data.value?.article?.slug && data.value.article.slug !== currentSlug.value) {
	currentSlug.value = data.value.article.slug;
	$router.replace({ path: `/news/${data.value?.article?.slug}` });
}

const article = computed(() => {
	if (!data.value?.article) {
		return null;
	}
	return localizeArticle(data.value?.article, localeCookie.value);
});

const relatedArticles = computed(() => {
	return data?.value?.relatedArticles;
});

const { mobile, tablet } = useMobileTablet();

const navigateToPreviousPage = () => {
	if (window.history?.state?.back === null) {
		$router.push('/news');
	} else {
		$router.go(-1);
	}
};

useHead({
	title: `${article?.value?.title} | Long Tale Games`,
	meta: [{ name: 'description', content: article?.value?.metaTags?.description }],
});
</script>

<template>
	<div v-if="article" class="w-ab-100 mb-0-L mb-4-S fd-c ai-c page-container">
		<div class="my-px-100-L my-10-S my-20 container">
			<section
				class="fd-r-M fd-cr-S fd-c jc-b ai-c-M ai-t mb-px-100-L mb-13-S mb-7 fw-nw-S fw-w mt-4">
				<NuxtLink
					v-if="mobile"
					class="d-f w-ab-15 mb-2-S cr-p d-n-S my-10-S my-12 go-back-button"
					to="/news"
					@click="navigateToPreviousPage">
					<img src="/icons/arrow-back.svg" alt="arrow-back" />

					{{ $t('common.back') }}
				</NuxtLink>

				<div class="p-px-5-L p-2 w-ab-50-M w-ab-100 mr-3">
					<div v-if="!mobile && !tablet" class="test"></div>

					<LPicture :src="article.headerImage" alt="header-image" object-fit="cover" />
				</div>

				<div class="w-ab-50-M w-ab-100">
					<button
						v-if="!mobile"
						class="go-back-button"
						href="/news"
						@click="navigateToPreviousPage">
						<img src="/icons/arrow-back.svg" alt="arrow-back" />

						{{ $t('common.back') }}
					</button>

					<h1 class="article-title">
						{{ article.title }}
					</h1>

					<div class="article-text">
						{{ article.text }}
					</div>
				</div>
			</section>
			<div class="fd-c jc-c ai-c">
				<!--        Article Body -->
				<div class="w-ab-70-M w-ab-100">
					<div
						id="htmlNews"
						class="mb-13-M mb-5-S mb-16 lh-14 fs-15 fs-18-L fs-18-S htmlNews"
						style="word-break: break-word">
						<HTMLRenderer
							:key="localeCookie"
							:html="article.description"></HTMLRenderer>
					</div>
				</div>

				<!-- Related Articles Card -->
				<div v-if="relatedArticles?.length" class="w-ab-100 fd-c ai-c jc-c">
					<div class="w-ab-100 fd-r ai-c jc-b">
						<div class="fs-px-23-L fs-24-M fs-28-S fs-20 fw-7">
							{{ $t('news.relatedNews') }}
						</div>
						<LButton size="small" href="/news" variant="accent">{{
							$t('news.showMore')
						}}</LButton>
					</div>
					<div
						:class="mobile ? 'scroll fd-r gp' : 'gap'"
						class="w-ab-100 mt-px-3-L mt-px-3-M mt-px-3-S mt-px-0 news-list"
						:style="!mobile ? `grid-template: repeat(1, 1fr) / repeat(4, 1fr)` : ''">
						<NewsCard
							v-for="article of relatedArticles"
							:key="article?.slug ? article.slug : article._id"
							xm-name="xpp_news_article_click"
							:is-horizontal-scroll="mobile"
							:size="tablet ? 3 : 4"
							class="w-ab-100"
							:article="article" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import 'assets/css/variables';

.news-list {
	@media (max-width: $max-mobile) {
		margin-top: 20px;
	}
}

.go-back-button {
	color: var(--reskin-secondary-neutral-color);
	font-family: var(--pilat-wide-font-family);
	font-size: 16px;
	font-weight: 400;
	text-transform: uppercase;
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 20px;
	width: 100%;

	@media (max-width: $max-tablet) {
		margin-top: 20px;
	}
}

.article-title {
	color: var(--white);
	font-family: var(--pilat-wide-font-family);
	font-size: 40px;
	font-style: normal;
	font-weight: 700;
	line-height: normal;
}

.article-text {
	word-break: break-word;
	margin-top: 20px;
	font-family: var(--helvetica-neue-font-family);
	font-size: 18px;
	font-weight: 400;
	line-height: 30px;
}

.page-container {
	background: radial-gradient(50% 50% at 50% 50%, #535e99 0%, #0d143a 81.25%, #0d143a 100%)
		no-repeat center -1000px;
	background-size: 3020px 1548px;
}

.htmlNews {
	&:deep {
		font-family: var(--helvetica-neue-font-family);

		& > p {
			word-break: break-word;
			font-size: 18px;

			&:empty {
				height: 25px;
			}

			& > strong {
				&,
				em,
				u,
				s {
					font-weight: 600;
				}
			}

			& > a {
				text-decoration: underline;
				color: var(--reskin-primary-neutral-color);
			}
		}

		& > p,
		& > ul,
		& > ol {
			color: var(--white-80);
		}

		& > ul,
		& > ol {
			margin-left: 28px;
		}

		& > h1 {
			font-size: 48px;
			font-weight: 800;
		}

		& > h2 {
			font-size: 30px;
			font-weight: 700;
		}

		& > h3 {
			font-size: 24px;
			font-weight: 600;
		}

		& > h4 {
			font-weight: 600;
		}

		& > h4,
		& > h5,
		& > h6 {
			font-size: 18px;
		}

		& > ul {
			list-style: disc;
		}

		& > blockquote {
			font-style: italic;
			border-left: 4px rgb(51, 65, 85) solid;
			padding-left: 15px;
			margin: 30px 0;

			& > p {
				&,
				&:before,
				&:after {
					font-weight: 600;
				}

				&:before {
					content: open-quote;
				}

				&:after {
					content: close-quote;
				}
			}
		}

		& > div > iframe {
			border: none;
		}

		& > img {
			margin: 32px 0;
			display: block;
		}

		& > table {
			width: 100%;
			margin: 16px 0;
			border-collapse: collapse;
			table-layout: fixed;

			th {
				background: #2b335e;
				text-align: initial;

				& > p {
					font-weight: 600;
				}

				&:nth-child(2n) {
					background: #272e55;
				}
			}

			td {
				color: var(--white-80);

				&:nth-child(2n) {
					background: rgba(0, 0, 0, 0.1);
				}
			}

			td,
			th {
				border: 1px solid #363b54;
			}
		}
	}
}

.textOverflow {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

ul {
	list-style-type: disc;
	@media (max-width: 960px) {
		list-style: none;
		li::before {
			content: '•';
			color: var(--main-color);
			font-size: 26px;
			margin-right: 5px;
		}
	}
}

.test {
	background: radial-gradient(
		50% 50% at 50% 50%,
		rgba(158, 102, 250, 0.3) 0%,
		rgba(158, 102, 250, 0) 100%
	);
	width: 562px;
	height: 562px;
	position: absolute;
	top: -9em;
	left: -16em;
	filter: blur(200px);
}

.bgCircle {
	top: -5vw;
}

.gap {
	display: grid;
	gap: 1vw;
}

strong {
	font-weight: bold;
}

@media (max-width: 1001px) {
	.gap {
		gap: 2vw;
	}
}

@media (max-width: 768px) {
	.gap {
		gap: 5vw 0;
	}
	.gp {
		gap: 5vw;
	}
}
</style>
