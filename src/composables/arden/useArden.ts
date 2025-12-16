import type { GamePack, CatalogItem } from '@/types/arden';
import type { UserData } from '@/types';
import currencyList from '@/utils/currency';
const EA_GROUP = "founders-packs";
const DEFAULT_LOCALE = "en";

let packs = reactive<GamePack[]>([]);
function getPacks(): GamePack[] {
	const { $i18n } = useNuxtApp();

	if (packs.length) return packs;

	packs = reactive<GamePack[]>([
		{
			name: "pack-true",
			sku: "true-believers-pack",
			minorTitle: $i18n.t("arden-index.pack_content.founder_pack_subtitle"),
			title: $i18n.t("arden-index.pack_content.founder_pack_name_1"),
			headerImage: "https://cdn.ltg.com/lif/images/cbt/founder_pack1.png",
			isMain: false,
			options: [`1000 ` + $i18n.t("arden-index.pack_content.currency"), `30 ` + $i18n.t("arden-index.pack_content.days") + " " + $i18n.t("arden-index.pack_content.premium"), $i18n.t("arden-index.pack_content.title1")],
			tools: [
				{ name: $i18n.t("arden-index.pack_content.tier_1_ws"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_1_Weapon_Skin_of_Choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_1_ts"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_1_Tool_Skin_of_choice.jpg" },
				{ name: $i18n.t("arden-index.pack_content.tier_1_ss"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_1_Skin_Set_of_choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_2_hs"), image: "https://cdn.ltg.com/lif/images/cbt/tier_2_hat_skin_of_choice.jpg" },
				{ name: "", image: "" },
			],
			item: null,
		},
		{
			name: "pack-zealous",
			sku: "zealous-believers-pack",
			headerImage: "https://cdn.ltg.com/lif/images/cbt/founder_pack3.png",
			isMain: true,
			minorTitle: $i18n.t("arden-index.pack_content.founder_pack_subtitle"),
			title: $i18n.t("arden-index.pack_content.founder_pack_name_3"),
			options: [`2000 ` + $i18n.t("arden-index.pack_content.currency"), `90 ` + $i18n.t("arden-index.pack_content.days") + " " + $i18n.t("arden-index.pack_content.premium"), $i18n.t("arden-index.pack_content.title3")],
			tools: [
				{ name: $i18n.t("arden-index.pack_content.tier_3_ws"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_3_Weapon_Skin_of_Choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_3_ss"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_3_Skin_Set_of_choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_2_of"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_2_Outfit_of_choice.jpg" },
				{ name: $i18n.t("arden-index.pack_content.tier_3_ts"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_3_Tool_Skin_of_choice3.webp" },
				{ name: $i18n.t("arden-index.pack_content.runic_tunic"), image: "https://cdn.ltg.com/lif/images/cbt/runic_tunic.jpg" },
			],
			item: null,
		},
		{
			name: "pack-devoted",
			sku: "devoted-believers-pack",
			headerImage: "https://cdn.ltg.com/lif/images/cbt/founder_pack2.png",
			isMain: false,
			minorTitle: $i18n.t("arden-index.pack_content.founder_pack_subtitle"),
			title: $i18n.t("arden-index.pack_content.founder_pack_name_2"),
			options: [`1500 ` + $i18n.t("arden-index.pack_content.currency"), `60 ` + $i18n.t("arden-index.pack_content.days") + " " + $i18n.t("arden-index.pack_content.premium"), $i18n.t("arden-index.pack_content.title2")],
			tools: [
				{ name: $i18n.t("arden-index.pack_content.tier_2_ws"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_2_Weapon_Skin_of_Choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_2_ss"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_2_Skin_Set_of_choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_2_ts"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_2_Tool_Skin_of_Choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_1_of"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_1_Outfit_of_choice.jpg" },
				{ name: $i18n.t("arden-index.pack_content.tiara_blue"), image: "https://cdn.ltg.com/lif/images/cbt/tiara_of_the_sleepless_eye_blue.jpg" },
			],
			item: null,
		},
	]);

	return packs;
}
function getPacksPage(): GamePack[] {
	const { $i18n } = useNuxtApp();

	if (packs.length) return packs;

	packs = reactive<GamePack[]>([
		{
			name: "pack-true",
			sku: "true-believers-pack",
			minorTitle: $i18n.t("arden-index.pack_content.founder_pack_subtitle"),
			title: $i18n.t("arden-index.pack_content.founder_pack_name_1"),
			headerImage: "https://cdn.ltg.com/lif/images/cbt/founder_pack1.png",
			isMain: false,
			options: [`1000 ` + $i18n.t("arden-index.pack_content.currency"), `30 ` + $i18n.t("arden-index.pack_content.days") + " " + $i18n.t("arden-index.pack_content.premium"), $i18n.t("arden-index.pack_content.title1")],
			tools: [
				{ name: $i18n.t("arden-index.pack_content.tier_1_ws"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_1_Weapon_Skin_of_Choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_1_ts"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_1_Tool_Skin_of_choice.jpg" },
				{ name: $i18n.t("arden-index.pack_content.tier_1_ss"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_1_Skin_Set_of_choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_2_hs"), image: "https://cdn.ltg.com/lif/images/cbt/tier_2_hat_skin_of_choice.jpg" },
				{ name: "", image: "" },
			],
			item: null,
		},
		{
			name: "pack-devoted",
			sku: "devoted-believers-pack",
			headerImage: "https://cdn.ltg.com/lif/images/cbt/founder_pack2.png",
			isMain: false,
			minorTitle: $i18n.t("arden-index.pack_content.founder_pack_subtitle"),
			title: $i18n.t("arden-index.pack_content.founder_pack_name_2"),
			options: [`1500 ` + $i18n.t("arden-index.pack_content.currency"), `60 ` + $i18n.t("arden-index.pack_content.days") + " " + $i18n.t("arden-index.pack_content.premium"), $i18n.t("arden-index.pack_content.title2")],
			tools: [
				{ name: $i18n.t("arden-index.pack_content.tier_2_ws"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_2_Weapon_Skin_of_Choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_2_ss"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_2_Skin_Set_of_choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_2_ts"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_2_Tool_Skin_of_Choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_1_of"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_1_Outfit_of_choice.jpg" },
				{ name: $i18n.t("arden-index.pack_content.tiara_blue"), image: "https://cdn.ltg.com/lif/images/cbt/tiara_of_the_sleepless_eye_blue.jpg" },
			],
			item: null,
		},
		{
			name: "pack-zealous",
			sku: "zealous-believers-pack",
			headerImage: "https://cdn.ltg.com/lif/images/cbt/founder_pack3.png",
			isMain: true,
			minorTitle: $i18n.t("arden-index.pack_content.founder_pack_subtitle"),
			title: $i18n.t("arden-index.pack_content.founder_pack_name_3"),
			options: [`2000 ` + $i18n.t("arden-index.pack_content.currency"), `90 ` + $i18n.t("arden-index.pack_content.days") + " " + $i18n.t("arden-index.pack_content.premium"), $i18n.t("arden-index.pack_content.title3")],
			tools: [
				{ name: $i18n.t("arden-index.pack_content.tier_3_ws"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_3_Weapon_Skin_of_Choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_3_ss"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_3_Skin_Set_of_choice1.webp" },
				{ name: $i18n.t("arden-index.pack_content.tier_2_of"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_2_Outfit_of_choice.jpg" },
				{ name: $i18n.t("arden-index.pack_content.tier_3_ts"), image: "https://cdn.ltg.com/lif/images/cbt/Tier_3_Tool_Skin_of_choice3.webp" },
				{ name: $i18n.t("arden-index.pack_content.runic_tunic"), image: "https://cdn.ltg.com/lif/images/cbt/runic_tunic.jpg" },
			],
			item: null,
		}
	]);

	return packs;
}

export function useArden() {
	return {
		getPacks,
		getPacksPage,
		getCatalogItems,
		getItemToken,
		getItemsTokens,
	};
}

function getPublisherProjectId() {
	const config = useRuntimeConfig().public;
	return config.ENV === "production" ? "270129" : "270136";
}

function getLocale() {
	const locale = useCookie(localeCookieKey).value;
	return locale || DEFAULT_LOCALE;
}

/**
 * getCatalogItems loads catalog items.
 * If token was provided, it loads catalog items for user and then updates packs.
 * If token was not provided, it just loads all catalog items and puts them to packs.
 * @param token
 * @returns
 */
async function getCatalogItems(token: string | undefined = undefined) {
	const { $api } = useNuxtApp();

	const items = await $api.getUserProjectCatalogByGroup({
		projectId: getPublisherProjectId(),
		group: EA_GROUP,
		locale: getLocale(),
		xsollaToken: token,
	});

	if (!token) {
		return addItemsToPacks(items);
	}

	updatePacksItems(items);
}

/**
 * updatePacksItems gets user catalog items
 * and updates `disabled` field in pack.item.
 * If user already bought item so then there won't be item in catalog items.
 * @param items
 */
function updatePacksItems(items: CatalogItem[]) {
	const packs = getPacks();
	for (const pack of packs) {
		const item = items.find((i) => i.sku === pack.sku);

		const index = packs.findIndex((p) => p.sku === pack.sku);

		if (index === -1) continue;

		const foundPack = packs[index];

		if (foundPack == null || foundPack.item == null) continue;

		foundPack.item.disabled = item == null;
	}
}

/**
 * addItemsToPacks gets items and adds them to `item` field in pack.
 * To find pack we iterate over items and find for equal `sku` of item and pack.
 * @param items
 */
function addItemsToPacks(items: CatalogItem[]) {
	const packs = getPacks();

	const currency = items[0]?.price?.currency || "USD";
	const currencySymbol = currencyList[currency] || currency;

	items.forEach((item) => {
		let amount = item?.price?.amount || "0";

		const amount_without_discount = item?.price?.amount_without_discount || amount;
		const is_discount = amount_without_discount != amount;

		if (is_discount) {
			amount = (parseFloat(amount_without_discount) - parseFloat(amount)).toFixed(2);
		}

		const index = packs.findIndex((p) => p.sku === item.sku);

		if (index === -1) return;

		const pack = packs[index];
		if (pack == null) return;

		pack.item = {
			token: null,
			currency,
			currencySymbol,
			is_discount,
			amount_without_discount,
			amount,
			disabled: false,
			sku: item.sku,
			sandbox: false,
		};
	});
}

/**
 * getItemToken gets paystation token for specific pack
 * and puts this token to `item.token` field.
 * @param pack
 * @param sandbox
 * @returns
 */
async function getItemToken(pack: GamePack, sandbox: boolean = false) {
	const user = useState<{ data: UserData | null }>('user');
	const xsollaToken = useCookie<string>(authTokenCookieKey);
	if (!pack.item || pack.item.disabled || !xsollaToken.value || !user.value.data) {
		return;
	}

	const index = packs.findIndex((p) => p.sku === pack.item?.sku);

	// если уже получили токен, не нужно еще раз загружать
	if (index === -1 || packs[index].item?.token) return;

	const { $api } = useNuxtApp();

	const { result } = await $api.getCatalogItemPaystationToken({
		payload: {
			xsolla_user_id: user.value.data.xsollaUserId,
			project_id: getPublisherProjectId(),
			items: [
				{
					sku: pack.item.sku,
					quantity: 1,
				},
			],
			return_url: `https://${window.location.host}/game/life-is-feudal-arden/thank-you`,
			sandbox,
			language: getLocale(),
			currency: pack.item.currency,
			email: user.value.data.email,
		},
		token: xsollaToken.value,
	});

	if (result?.token == null) return;

	const item = packs[index].item;
	if (!item) return;

	item.token = result.token;
	item.sandbox = result.sandbox;
}


async function getItemsTokens(sandbox: undefined | boolean = false) {
	const promises = Object.values(packs).map((pack) => getItemToken(pack, sandbox));
	await Promise.all(promises);
}
