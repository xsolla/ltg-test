// Поле name в объекте меню — это ключ в locale-файлах, например: lang/en.json
import { HELP_CENTER_LINK } from '../constants/common';

export const menu = [
	{
		name: 'menu.home',
		to: '/',
	},
	{
		name: 'menu.games',
		to: '',
		dropdown: [],
	},
	{
		name: 'menu.news',
		to: '/news',
	},
	{
		name: 'menu.support',
		to: HELP_CENTER_LINK,
		icon: '/icons/support.svg',
		external: true,
		target: '_blank',
	},
];

export const socials = [
	{
		// name — используется для иконки
		// как путь /socials//${name}/.svg
		name: 'facebook',
		href: 'https://www.facebook.com/LongTaleGames/',
	},
	{
		name: 'instagram',
		href: 'https://www.instagram.com/longtalegames/',
	},
	{
		name: 'twitter',
		href: 'https://twitter.com/LTGpublisher',
	},
];

export const logo = '/logo/logo.svg';

export const business = 'https://corp.ltg.com/';

export const privacy = '/privacy-policy';
export const terms = '/terms-of-service';
export const cookies = '/cookies';
export const balanceRestorationTerms = '/balance-restoration-campaign-terms';

export const about = [
	{
		title: 'home.about.bestGames.title',
		body: 'home.about.bestGames.desc',
		picture: '/icons/shield.svg',
		id: 1,
	},
	{
		title: 'home.about.bestExperience.title',
		body: 'home.about.bestExperience.desc',
		picture: '/icons/rocket.svg',
		id: 2,
	},
	{
		title: 'home.about.bestFriends.title',
		body: 'home.about.bestFriends.desc',
		picture: '/icons/like.svg',
		id: 3,
	},
];

export const localeCookieKey = 'ltg_locale';
export const authTokenCookieKey = 'xsolla_metaframe_token';

export const languages = [
	{
		locale: 'en',
		name: 'English',
	},
	{
		locale: 'fr',
		name: 'Français',
	},
	{
		locale: 'es',
		name: 'Español',
	},
	{
		name: '简体中文',
		locale: 'zh-cn',
		// simplified chinese
	},
	{
		name: '繁體中文',
		locale: 'zh-tw',
		// traditional chinese
	},
	{
		locale: 'ko',
		name: '한국어',
	},
	{
		name: 'Русский',
		locale: 'ru',
	},
	{
		locale: 'de',
		name: 'Deutsch',
	},
	{
		locale: 'it',
		name: 'Italiano',
	},
	{
		locale: 'pt',
		name: 'Português do Brasil',
	},
	{
		locale: 'pl',
		name: 'Polski',
	},
	{
		locale: 'hu',
		name: 'Hungarian',
	},
	// {
	//     locale: "ja",
	//     name: "Japanese",
	// },
	// {
	//     locale: "vi",
	//     name: "Vietnamese",
	// },
	{
		locale: 'cs',
		name: 'Čeština',
	},
	{
		name: 'Türkçe',
		locale: 'tr',
	},
	// {
	//     name: "Thai",
	//     locale: "th"
	// }
];

export const allLanguages = [
	{
		locale: 'en',
		name: 'English',
	},
	{
		locale: 'fr',
		name: 'Français',
	},
	{
		locale: 'es',
		name: 'Español',
	},
	{
		name: '简体中文',
		locale: 'zh',
	},
	{
		name: '繁體中文',
		locale: 'za',
	},
	{
		locale: 'ko',
		name: '한국어',
	},
	{
		name: 'Русский',
		locale: 'ru',
	},
	{
		locale: 'de',
		name: 'Deutsch',
	},
	{
		locale: 'it',
		name: 'Italiano',
	},
	{
		locale: 'pt',
		name: 'Português do Brasil',
	},
	{
		locale: 'pl',
		name: 'Polski',
	},
	{
		locale: 'hu',
		name: 'Hungarian',
	},
	{
		locale: 'ja',
		name: 'Japanese',
	},
	{
		locale: 'vi',
		name: 'Vietnamese',
	},
	{
		locale: 'cs',
		name: 'Čeština',
	},
	{
		name: 'Türkçe',
		locale: 'tr',
	},
	{
		name: 'Thai',
		locale: 'th',
	},
];
