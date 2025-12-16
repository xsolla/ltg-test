export type ArticleBase = {
	title?: string;
	text?: string;
	description?: string;
	headerImage?: string;
	images?: string[];
};

export type ArticleProject = {
	_id: string;
	name: string;
};

export type Article = ArticleBase & {
	localization?: Record<string, ArticleBase>;
	_id: string;
	articleId: string;
	slug: string;
	project: ArticleProject;
};

export type ListArticleResponse = {
	entities: Article[];
	page: number;
	pageSize: number;
	pages: number;
	projects: ArticleProject[];
	total: number;
};
