import type { Article, ArticleBase } from '~/api/article.types';

export const localizeArticle = (article: Article, locale: string): Article => {
	if (!canArticleBeLocalized(article, locale)) {
		if (locale === 'en') {
			return article;
		}
		return localizeArticle(article, 'en');
	}
	const localeData = getLocaleDataFromArticle(article, locale);
	return Object.assign(article, localeData);
};

const canArticleBeLocalized = (article: Article, locale: string) => {
	const localeData = getLocaleDataFromArticle(article, locale);
	if (!localeData) {
		return false;
	}
	return isLocalizationFull(localeData);
};

const isLocalizationFull = (localization: ArticleBase) => {
	return (
		localization.title &&
		localization.text &&
		localization.description &&
		localization.headerImage &&
		localization.images
	);
};

const getLocaleDataFromArticle = (article: Article, locale: string): ArticleBase | undefined => {
	return article?.localization?.[locale];
};
