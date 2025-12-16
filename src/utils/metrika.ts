export const siteDomains = [
	'ltg.com',
	'lifeisfeudalmmo.com',
	'lifmmo.ltg.com',
	'forum.ltg.com',
	'support.longtalegames.com',
];

type PageEvent = {
	en?: string;
	ev?: string;
};

export const pageEvents: Record<string, PageEvent> = {
	'/': {
		en: 'xpp_main_visit',
	},
	'/news': {
		en: 'xpp_news_news_visit',
	},
	'/news/:id': {
		en: 'xpp_news_article_visit',
		ev: 'id',
	},
	'/profile/personal-info': {
		en: 'xpp_profile_visit',
	},
};
