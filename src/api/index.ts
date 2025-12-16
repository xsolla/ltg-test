import type { F9, FetchOptions } from '@augustjourney/f9';
import type {
	Banner,
	PersonalInfo,
	GamePrice,
	LauncherDownloadData,
	MergeLegacyAcountDTO,
	LinkedGame,
	Stats,
	Promocode,
	UserData,
	PaystationTokenData,
	ItemTokenResp,
	GameOwnedItem,
	GameKeyPackage,
} from '@/types';
import type { CatalogItem } from '@/types/arden';
import type { Article, ListArticleResponse } from '~/api/article.types';
import type { UserSubscription } from '~/types/game';
import type { GetCatalogItemPaystationTokenDTO, GetUserProjectCatalogByGroupDTO } from '~/api/dto';

type CommonRequestOptions = {
	headers?: Record<string, string>;
};

type PostRequestOptions = CommonRequestOptions & {
	body: Record<string, unknown>;
};

export default ($f9: F9) => ({
	async getRequest<T>(requestUrl: string, options?: CommonRequestOptions) {
		const response = await $f9.get<T>(requestUrl, {
			headers: options?.headers,
		});

		return response.$data;
	},

	async postRequest<T>(requestUrl: string, options?: PostRequestOptions) {
		const response = await $f9.post<T>(requestUrl, {
			headers: options?.headers,
			body: options?.body,
		});

		return response.$data;
	},

	// Games
	async getGame(slug: string, query: string = '') {
		const res = await $f9.get(`/game/one/${slug}?${query}`);
		return res.$data;
	},

	async getGamesMenu() {
		const res = await $f9.get<{ data: { name: string; slug: string; _id?: string }[] }>(
			'/v2/games?menu=true'
		);
		if (!res.$data?.data || !Array.isArray(res.$data?.data)) {
			return [];
		}
		return res.$data?.data.map((game) => {
			return { name: game.name, to: `/game/${game.slug}`, _id: game._id };
		});
	},

	async getGamesCatalog() {
		const res = await $f9.get('/v2/games?home=true');
		// @ts-expect-error
		return res.$data?.data || [];
	},

	async getSubscriptionGifts(projectId: string | number) {
		const res = await $f9.get(`/subgift?projectId=${projectId}`);
		return res.$data;
	},

	async getSubGiftToken(payload: any) {
		const res = await $f9.post('/game/getSubGiftToken', payload);
		if (!res.$success) {
			return { token: null, sku: null, sandbox_mode: null, is_subscription: null };
		}
		return res.$data;
	},

	async getToken(payload: {
		slug: string;
		currency: string;
		type: string;
		planId: string | number;
		promocode?: string;
		withoutPromocode: boolean;
	}): Promise<PaystationTokenData> {
		const { slug, currency, type, planId, promocode, withoutPromocode } = payload;

		const queryParams = new URLSearchParams({
			game: slug,
			currency,
			type,
			plan_id: planId.toString(),
		});

		if (promocode) {
			queryParams.append('promocode', promocode);
		}

		if (withoutPromocode) {
			queryParams.append('without_promocode', 'true');
		}

		const res = await $f9.get<{ response: PaystationTokenData }>(
			`/game/getToken?${queryParams}`
		);

		if (!res.$success) {
			return { status: false, token: null, sandbox_mode: null, is_subscription: null };
		}

		return res.$data.response;
	},

	async getTokenV2(payload: {
		slug: string;
		currency: string;
		type: string;
		email?: string;
		plan_id?: string;
		return_to?: string;
	}) {
		const res = await $f9.post<{ data: { token: string } }>(
			`/v2/games/${payload.slug}/token`,
			payload
		);
		if (!res?.$success) {
			return {
				status: res.$success,
				token: null,
				sandbox_mode: false,
				error: res.$data || res.$message,
			};
		}
		return {
			status: res.$success,
			...res.$data.data,
		};
	},

	async getGamePrice(payload: {
		slug: string;
		currency: string;
		promocode?: string;
		withoutPromocode?: boolean;
	}) {
		const { slug, currency = 'USD', promocode, withoutPromocode } = payload;

		const queryParams = new URLSearchParams({
			currency,
		});

		if (promocode) {
			queryParams.append('promocode', promocode);
		}

		if (withoutPromocode) {
			queryParams.append('without_promocode', 'true');
		}

		const res = await $f9.get<{ data: GamePrice[] }>(`/v2/games/${slug}/price?${queryParams}`);
		return res.$data?.data || null;
	},

	async getLinkedGames(gameSlug: string) {
		const response = await this.getRequest<{ data: LinkedGame[] }>(
			`/v2/games/${gameSlug}/linked-games`
		);

		return response.data;
	},

	async getGamePromocodes(gamePath: string) {
		const response = await this.getRequest<Promocode[]>(`/game${gamePath}/promocodes`);

		return response;
	},

	async getGameKeyToken(
		slug: string,
		currency: string,
		plan_id: string | number
	): Promise<PaystationTokenData> {
		const res = await $f9.get<PaystationTokenData>(
			`/game/getGameKeyToken?game=${slug}&currency=${currency}&plan_id=${plan_id}`
		);
		if (!res.$success) {
			return {
				status: false,
				is_subscription: null,
				sandbox_mode: null,
				token: null,
				error: res.$message,
			};
		}
		return res.$data;
	},

	async getLauncherDownloadData({
		launcherSlug,
		ltgCode,
	}: {
		launcherSlug: string;
		ltgCode?: string | null;
	}) {
		const query = ltgCode ? `?ltg_code=${ltgCode}` : '';
		const requestUrl = `v2/launcher/${launcherSlug}${query}`;

		const res = await $f9.get<{ data: LauncherDownloadData }>(requestUrl);

		return res.$data.data;
	},

	// Articles
	async getArticles(params: string) {
		const res = await $f9.get<ListArticleResponse>(`/article/list${params}`);
		return res.$data;
	},

	async getMainArticle() {
		const res = await $f9.get<Article>('/article/mainArticle');
		return res.$data;
	},

	async getArticle(slug: string | number) {
		const res = await $f9.get(`/article/one/${encodeURIComponent(slug)}`);
		// @ts-expect-error
		return res.$data?.data || null;
	},

	async getHomeArticles(params: string) {
		const res = await $f9.get(`/article/list${params}`);
		// @ts-expect-error
		return res.$data?.entities || [];
	},

	async getRelatedArticles(project = '', pageSize = 4) {
		const res = await $f9.get(`/article/list?page=1&pageSize=${pageSize}&project=${project}`);
		// @ts-expect-error
		return res.$data?.entities || [];
	},

	async getGameArticles(game: string) {
		const res = await $f9.get(`/article/list?page=1&pageSize=4&project=${game}`);
		// @ts-expect-error
		return res.$data?.entities || [];
	},

	//  Forum
	async getForumLink() {
		const res = await $f9.get<{ data: { host: string; session: string } }>('/v2/forum/login?');
		if (res.$status === 401 || !res.$data) {
			return 'https://forum.ltg.com';
		}
		return 'https://forum.ltg.com?session=' + res.$data.data.session;
	},

	async getForumSession() {
		const res = await $f9.get<{ data: { host: string; session: string } }>('/v2/forum/login?');
		if (res.$status === 401 || !res.$data) {
			return null;
		}
		return res.$data.data.session;
	},

	async forumLogout() {
		const res = await $f9.get('/v2/forum/logout');
		return res.$data;
	},

	//  Sliders
	async getSliders() {
		const res = await $f9.get('/news/slider');
		return res.$data || [];
	},

	//  Users
	async getMe() {
		const res = await $f9.get<{ data: UserData }>('/v2/users/me');
		return {
			data: res.$data,
			status: res.$status,
		};
	},

	async getUsersSubscriptions() {
		const res = await $f9.get<{ data: unknown[] }>('/v2/users/me/subscriptions');
		return res.$data?.data || [];
	},

	async getUsersPersonalInfo() {
		const res = await $f9.get<{ data: PersonalInfo }>('/v2/users/me/personal-info');
		return res.$data?.data || [];
	},

	async stopSubscription(subscriptionId: string | number, payload: any) {
		const res = await $f9.post<{ data: { success: boolean; message: string } }>(
			`/user/me/subscriptions/${subscriptionId}/stop`,
			payload
		);
		return res.$data;
	},

	async getUsersPromocodes(skip = 0, limit = 100) {
		const res = await $f9.get<{ data: unknown[] }>(
			`/v2/users/me/promocodes?skip=${skip}&limit=${limit}`
		);
		return res.$data?.data || [];
	},

	async getUsersGames() {
		const res = await $f9.get('/user/me/games');
		// @ts-expect-error
		return res.$data?.data || [];
	},

	async getUsersBalance(): Promise<{ amount: number }> {
		const res = await $f9.get<{ data: { amount: number } }>('/v2/users/me/balance');
		return res.$data?.data || { amount: 0 };
	},

	async shareToGetReward(gameId: string, method: string, locale: string) {
		try {
			const res = await $f9.post<{ status: string; message: string }>('/share', {
				body: { gameId, method, locale },
			});
			return res.$data || { status: 'error' };
		} catch (e) {
			return { status: 'error' };
		}
	},

	async findUser(receiver: string) {
		const res = await $f9.get(`/user/find?receiver=${receiver}`);
		// @ts-expect-error
		return res.$data.data;
	},

	async mergeLegacyAccount(dto: MergeLegacyAcountDTO, currency: string) {
		const res = await $f9.post<{ data: { success: boolean; message: string } }>(
			`/v2/users/merge-account?currency=${currency}`,
			{ body: dto }
		);
		return {
			success: res.$data?.data?.success || false,
			message: res.$data?.data?.message || 'Something went wrong. Please contact support.',
		};
	},

	async checkLegacyUserBefore(
		dto: {
			token?: string;
			steamParams?: Record<string, string>;
			game: string;
		},
		currency: string
	) {
		const res = await $f9.post<{ data: { success: boolean; message: string } }>(
			`/v2/users/merge-account/validate?currency=${currency}`,
			dto
		);
		return {
			success: res.$data?.data?.success || false,
			message: res.$data?.data?.message || 'Something went wrong. Please contact support.',
		};
	},

	async confirmMergeLegacyAccount(
		dto: {
			token?: string;
			steamParams?: Record<string, string>;
			game: string;
		},
		currency: string
	) {
		const res = await $f9.post<{ data: { success: boolean; message: string } }>(
			`/v2/users/merge-account/confirm?currency=${currency}`,
			dto
		);
		return {
			success: res.$data?.data?.success || false,
			message: res.$data?.data?.message || 'Something went wrong. Please contact support.',
		};
	},

	// Promocodes
	async applyPromocode(payload: any) {
		const res = await $f9.post<{ data: unknown }>('/v2/promocodes/', payload);
		return res.$data.data;
	},

	// Banners
	async getBanner(ltgSource: string) {
		const res = await $f9.get<{ data: Banner }>(`/v2/banners/${ltgSource}`);
		return res.$data?.data || null;
	},

	// Auth

	async exchangeBabkaToken(internalBabkaToken: string, projectId: string) {
		const { $data: data } = await $f9.post<{ token: string }>('/external-auth', {
			body: {
				token: internalBabkaToken,
				projectId: projectId,
			},
		});
		return data;
	},

	async getAuthTokens(xsollaToken: string) {
		const opts = {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Code: document.cookie,
				Authorization: `Bearer ${xsollaToken}`,
			},
		};
		const res = await $f9.get('/auth/token', opts);
		return res.$data;
	},

	async signup(dto: { ltg_code: string; xsollaToken: string }) {
		const res = await $f9.post<{ success: boolean; data: { is_registration?: boolean } }>(
			'/v2/auth/signup',
			{
				body: {
					ltg_code: dto.ltg_code,
				},
				headers: {
					xsollaToken: dto.xsollaToken,
				},
			}
		);
		return res.$data;
	},

	//  Currency
	async getCurrency() {
		const url = 'https://store.xsolla.com/api/v2/project/202099/items/sku/checker';
		const opts = {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		// @ts-expect-error
		const res = await $f9.raw(url, opts);
		// @ts-expect-error
		return res.$data?.price?.currency || 'USD';
	},

	async getLauncherLink() {
		const res = await $f9.get('/merchant?key=launcher_link');
		// @ts-expect-error
		return res.$data?.data;
	},

	async getMaintenance() {
		const res = await $f9.get('/settings/get-maintenance');
		// @ts-expect-error
		return res.$data?.result;
	},

	async refreshToken(refreshToken: string) {
		const res = await $f9.get('/auth/refreshToken', {
			headers: {
				Authorization: `Bearer ${refreshToken}`,
			},
		});
		return {
			status: res.$status,
			data: res.$data,
		};
	},

	async test404() {
		await $f9.get('/game/one/lif');
	},

	async getPage(payload: { endpoint: string }) {
		const res = await $f9.post('/dynamic/pagecontent', payload);
		return res.$data;
	},

	// Old requests -> not used currently
	async setConfirmEmail(payload: { code: string | number }) {
		const res = await $f9.post('/user/confirm-email', payload);
		return res.$data;
	},

	async setEmail(payload: { email: string }) {
		const res = await $f9.post('/user/set-email', payload);
		return res.$data;
	},

	async getSSOJWT(type: string, locale: string) {
		const res = await $f9.post<{ data: string; success: boolean }>(
			`/v2/user/sso?type=${type}&locale=${locale}`
		);
		return res.$data;
	},

	async getUserSubscriptionByProject(project_id: string | number) {
		const res = await $f9.get<{ data: UserSubscription[] }>(
			`v2/user/subscription/${project_id}`
		);
		return res.$data.data;
	},

	async setXsollaToken(xsollaToken: string) {
		const res = await $f9.post<{ success: boolean; data: string }>('/v2/user/xsollatoken', {
			headers: {
				xsollaToken,
			},
		});
		return res.$data?.data;
	},

	async getXsollaToken(xsollaUserId: string) {
		const res = await $f9.get<{ success: boolean; data: string }>(
			`/v2/user/xsollatoken/${xsollaUserId}`
		);
		return res.$data?.data;
	},

	async getGameStats(gameSlug: string) {
		const res = await $f9.get<{ success: boolean; data: Stats }>(`/v2/stats/${gameSlug}`);
		return res.$data?.data;
	},

	async createNewsletterConsent(payload: { email: string; source: string; isAccepted: boolean }) {
		await this.postRequest('/newsletter-consent', {
			body: payload,
		});
	},

	async checkNewsletterConsent() {
		return await this.getRequest<{ exists: boolean }>('/newsletter-consent/check');
	},

	async getUserCBTaccess(
		project_id: string,
		game_key: string,
		xsollaToken: string | null | undefined
	) {
		const url = `https://store.xsolla.com/api/v2/project/${project_id}/entitlement?limit=50&offset=0`;
		const opts: FetchOptions = {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${xsollaToken}`,
			},
		};
		let isOwner = false;
		const res = await $f9.raw<{
			has_more: boolean;
			total_items_count: number;
			items: GameOwnedItem[];
		}>(url, opts);
		if (res.$data?.items) {
			res.$data?.items.forEach((item) => {
				if (item.game_sku == game_key) isOwner = true;
			});
		}
		return isOwner;
	},

	async getUserFiendCodes() {
		const config = useRuntimeConfig().public;
		const url = `${config.PUBLIC_LTG_API}/v1/account/game-keys?type=friend`;
		const opts: FetchOptions = {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${useCookie(authTokenCookieKey).value}`,
			},
		};

		const res = await $f9.raw<{ success: boolean; result: GameKeyPackage[] }>(url, opts);
		return res.$data?.result || [];
	},

	async getUserProjectCatalogByGroup(dto: GetUserProjectCatalogByGroupDTO) {
		const url = `https://store.xsolla.com/api/v2/project/${dto.projectId}/items/group/${dto.group}?limit=50&offset=0&locale=${dto.locale}`;
		const opts: FetchOptions = {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${dto.xsollaToken}`,
			},
		};

		const res = await $f9.raw<{ has_more: boolean; items: CatalogItem[] }>(url, opts);
		return res.$data?.items || [];
	},

	async getCatalogItemPaystationToken(
		dto: GetCatalogItemPaystationTokenDTO
	): Promise<ItemTokenResp> {
		const config = useRuntimeConfig().public;
		const url = `${config.XSOLLA_SERVICE}/paystation/token/items`;
		const opts = {
			headers: {
				Authorization: `Bearer ${dto.token}`,
			},
			body: dto.payload,
		};

		const res = await $f9.post<ItemTokenResp>(url, opts);
		return res.$data || null;
	},
});
