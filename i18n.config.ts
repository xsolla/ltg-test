import en from '@/lang/en.json';
import fr from '@/lang/fr.json';
import es from '@/lang/es.json';
import de from '@/lang/de.json';
import hu from '@/lang/hu.json';
import it from '@/lang/it.json';
import ja from '@/lang/ja.json';
import ko from '@/lang/ko.json';
import pl from '@/lang/pl.json';
import pt from '@/lang/pt.json';
import ru from '@/lang/ru.json';
import th from '@/lang/th.json';
import tr from '@/lang/tr.json';
import vi from '@/lang/vi.json';
import cs from '@/lang/cs.json';
import zhcn from '@/lang/zh-cn.json';
import zhtw from '@/lang/zh-tw.json';
import { useNavigatorLanguage } from '@vueuse/core';
import { languages, localeCookieKey } from '@/utils/ltg';

function makeLangCode(code?: string, defaultValue: string | null = null) {
	const pattern = /^[a-z]{2}-[A-Z]{2}$/;

	if (!code) {
		return defaultValue;
	}

	const locale = code.toLowerCase();

	if (locale.length === 2) {
		// Если пришел китайский без диалекта,
		// Делаем fallback на традиционный китайский.
		if (locale === 'zh') {
			return 'zh-tw';
		}

		return locale;
	}

	// Если строка не 2 символа
	// И не подходит под паттерн xx-XX
	if (!pattern.test(code)) {
		return defaultValue;
	}

	// Если пришел китайский с диалектом,
	// То его так и возвращаем
	if (locale.startsWith('zh')) {
		return locale;
	}

	// В другом случае возвращаем первые 2 символа по ISO 639-1
	return locale.split('-')[0];
}

export default defineI18nConfig(() => {
	const availableLocales = new Set(languages.map((lang) => lang.locale));

	const cookieLocale = useCookie(localeCookieKey);

	const { query } = useRoute();

	let locale = 'en';

	let langCode = cookieLocale.value ?? null;

	if (!langCode) {
		const { language } = useNavigatorLanguage();
		langCode = makeLangCode(language.value);
	}

	if (langCode && availableLocales.has(langCode)) {
		locale = langCode;
	}

	const queryLang = makeLangCode(query?.lang?.toString());

	if (queryLang && availableLocales.has(queryLang)) {
		locale = queryLang;
	}

	cookieLocale.value = locale;

	const messages: Record<string, any> = {
		en,
	};

	messages.fr = fr;
	messages.es = es;
	messages.cs = cs;
	messages.de = de;
	messages.hu = hu;
	messages.it = it;
	messages.ko = ko;
	messages.pl = pl;
	messages.pt = pt;
	messages.ru = ru;
	messages.tr = tr;
	messages['zh-cn'] = zhcn;
	messages['zh-tw'] = zhtw;

	return {
		legacy: false,
		fallbackLocale: 'en',
		locale,
		messages,
		missing(locale, key) {
			return messages.en[key];
		},
	};
});
