<template>
	<div class="w-ab-100 mb-0-L mb-4-S fd-c ai-c page-container">
		<div class="container">
			<NewsMainArticle v-if="mainArticle" :article="mainArticle" />

			<CategoryDropdown
				:selected-category="selectedProject"
				:categories="projects"
				@select="onProjectSelected" />

			<!-- News cards -->
			<div
				v-if="articles?.entities?.length"
				class="w-ab-100 gap px-25 px-0-S g-2 news-container"
				:style="`grid-template: repeat(1, 1fr) / repeat(${
					mobile ? 1 : tablet ? 3 : 4
				}, 1fr)`">
				<NewsCard
					v-for="article of articles.entities"
					:key="article.slug"
					xm-name="xpp_news_news_click"
					:page="page"
					:size="tablet ? 3 : 4"
					class="mb-5 mb-0-S cr-p"
					:article="article" />
			</div>

			<div v-if="articles?.entities?.length" class="group">
				<Paginate :pages="articles.pages" :page="page" @set="setPage" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Paginate from '@/components/news/paginate.vue';
import useMobileTablet from '@/composables/mobile-tablet-desktop';
import CategoryDropdown from '~/components/news/category-dropdown.vue';
import { localeCookieKey } from '~/utils/ltg';
import { localizeArticle } from '~/utils/article';
import NewsCard from '~/components/news/news-card.vue';
import type { ArticleProject } from '~/api/article.types';
import type { Ref } from 'vue';

const router = useRouter();
const route = useRoute();

const year = ref(route.params.year || null);
const page = ref(Number(route.params.number || 1));

const PAGE_SIZE = 12;
const { $api, $i18n } = useNuxtApp();

const localeCookie = useCookie(localeCookieKey);

const getQueryParamSuffix = (projectId: string | null) => {
	let query = '';
	if (projectId) {
		query += `&project=${projectId}`;
	}
	if (year.value && validateYear(year.value)) {
		query += `&year=${year.value}`;
	}
	return query;
};

const validateYear = (year: string | null | string[]): boolean => {
	if (!year) {
		return true;
	}
	const yearNumber = Number(year);
	return !isNaN(yearNumber) && yearNumber > 2000 && yearNumber <= new Date().getFullYear();
};

async function loadArticles(currentPage: number, pageSize: number, selectedProjectId: string) {
	const query = `?page=${currentPage}&pageSize=${pageSize}${getQueryParamSuffix(
		selectedProjectId
	)}`;
	const rawData = await $api.getArticles(query);
	return {
		...rawData,
		entities: rawData.entities.map((article) =>
			localizeArticle(article, localeCookie.value || 'en')
		),
	};
}

const { data: rawMainArticle } = await useAsyncData(() => $api.getMainArticle());

const mainArticle = computed(() => {
	if (!rawMainArticle.value) {
		return null;
	}
	return localizeArticle(rawMainArticle.value, localeCookie.value || 'en');
});

const { data: articles } = await useAsyncData(async () => {
	const pageValueIsValidNumber = !!page.value && page.value > 0;
	if (pageValueIsValidNumber && validateYear(year.value)) {
		const articlesData = await loadArticles(
			page.value,
			PAGE_SIZE,
			route.query.projectId as string
		);
		if (
			articlesData.pageSize * page.value <= articlesData.total + articlesData.pageSize ||
			page.value === 1
		) {
			return articlesData;
		}
	} else {
		return void router.replace({ path: `/news`, query: route.query });
	}
	void router.replace({ path: `/news`, query: route.query });
});

const { mobile, tablet } = useMobileTablet();

const projects = computed(() => {
	const resultProjects: ArticleProject[] = [{ name: $i18n.t('news.allNews'), _id: '' }];
	if (!articles.value?.projects?.length) {
		return resultProjects;
	}
	const projectsFromArticleList = [...articles.value.projects];
	projectsFromArticleList.sort((a, b) => a?.name.localeCompare(b?.name)).filter((p) => p.name);
	resultProjects.push(...projectsFromArticleList);
	return resultProjects;
});

const selectedProject = ref<ArticleProject>(
	projects.value.find((p) => p._id === route.query.projectId) || projects.value[0]
);

watch(selectedProject, async () => {
	await onChangeSelectedProject(selectedProject);
});

async function onChangeSelectedProject(selectedProject: Ref<ArticleProject>) {
	const newPageQuery = {
		...route.query,
		projectId: selectedProject.value._id || undefined,
	};
	articles.value = await loadArticles(page.value, PAGE_SIZE, selectedProject.value._id);
	void router.replace({ params: { year: year.value, number: 1 }, query: newPageQuery });
}

async function setPage(newPage: number) {
	// TODO router replace params
	const basePath = '/news';
	const yearSegment = year.value ? `/${year.value}` : '';
	const newPath = `${basePath}${yearSegment}/page-${newPage}`;
	void router.push({ path: newPath, query: route.query });
}

const onProjectSelected = (id: string) => {
	selectedProject.value = projects.value.find(({ _id }) => _id === id) || projects.value[0];
};
</script>

<style scoped lang="scss">
.news-container {
	margin-top: 20px;
}

.page-container {
	background: radial-gradient(50% 50% at 50% 50%, #535e99 0%, #0d143a 81.25%, #0d143a 100%)
		no-repeat center -1000px;
	background-size: 3020px 1548px;
}

.container {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.group {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	padding: 50px 0;

	@media screen and (max-width: 768px) {
		button {
			margin: 0 auto;
		}
	}
}

.bg {
	background: var(--card-gradient-x);
}

.textOverflow {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	word-break: break-word;
}

.none {
	@media (max-width: 1180px) {
		display: none;
	}
}

.bgCircle {
	top: -5vw;
}

.gap {
	display: grid;
}

.dropdown-bg {
	background: var(--white);
}

.dropdown-items {
	& > li {
		color: #000;

		text-align: center;
		font-size: 16px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
		text-transform: uppercase;
	}
}

li {
	&:hover {
		background: var(--accent-gradient);
	}
}
</style>
