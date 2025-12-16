export interface CatalogItem {
	item_id: number;
	sku: string;
	type: string;
	name: string;
	description: string;
	image_url: string;
	virtual_item_type: string;
	can_be_bought: boolean;
	is_free: boolean;
	attributes: CatalogItemAttr[];
	custom_attributes?: Record<string, unknown>;
	groups: CatalogItemGroup[];
	inventory_options?: CatalogItemInventoryOption;
	limits?: CatalogItemLimit;
	periods?: CatalogItemPeriod[];
	price?: CatalogItemPrice;
	promotions?: CatalogItemPromotion[];
	virtual_prices?: CatalogItemVirtualPrices[];
	vp_rewards?: CatalogItemVpRewards[];
	disabled?: boolean;
	is_discount: boolean;
	amount: string;
	token?: string;
}
export type CatalogItemAttr = {
	external_id: string;
	name: string;
	values: CatalogItemAttrVal[];
};

export type CatalogItemAttrVal = {
	external_id: string;
	value: string;
};
export type CatalogItemGroup = {
	external_id: string;
	name: string;
};
export type CatalogItemInventoryOption = {
	consumable?: {
		usages_count: number;
	};
	expiration_period?: {
		type: string;
		value: number;
	};
};
export type CatalogItemLimit = {
	per_item?: {
		available: number;
		total: number;
	};
	per_user?: {
		available: number;
		recurrent_schedule?: {
			interval_type?: string;
			reset_next_date?: number;
		};
	};
	total?: number;
};
export type CatalogItemPeriod = {
	date_from?: string;
	date_until?: string;
};
export type CatalogItemPrice = {
	amount: string;
	amount_without_discount?: string;
	currency: string;
};
export type CatalogItemPromotion = {
	bonus?: CatalogItemPromotionBunus[];
	date_end?: string | null;
	date_start?: string | null;
	discount?: {
		percent: string | null;
		value: string | null;
	};
	name: string;
	limits?: {
		per_user: {
			available: number;
			total: number;
		};
	};
};
export type CatalogItemPromotionBunus = {
	amount_without_discount?: string;
	currency?: string;
};
export type CatalogItemVirtualPrices = {
	amount: number;
	amount_without_discount: number;
	description: string;
	image_url: string;
	is_default: boolean;
	name: string;
	sku: string;
	type: string;
};
export type CatalogItemVpRewards = {
	amount: number;
	image_url: string;
	is_clan: boolean;
	item_id: number;
	name: string;
	sku: string;
};
export type ItemTokenResp =
	| {
			success: boolean;
			result: {
				token: string;
				sandbox: boolean;
				url: string;
			};
	  }
	| {
			success: boolean;
			error_code: 'string';
			result: null;
			message: string | null;
	  };

export type GameOwnedItem = {
	name: string;
	description: string;
	game_sku: string;
	drm: string;
};

export type GameKeyPackage = {
	package_name: string;
	codes: GameKeyPackageItem[];
};
export type GameKeyPackageItem = {
	code: string;
	name: string | null;
};
export interface GamePack {
	name: string;
	minorTitle: string;
	title: string;
	sku: string;
	headerImage: string;
	isMain: boolean;
	options: string[];
	tools: GamePackTool[];
	item: null | GamePackItem;
}

export interface GamePackItem {
	token: string | null;
	sandbox: boolean;
	is_discount: boolean;
	sku: string;
	amount_without_discount: string;
	amount: string;
	disabled: boolean;
	currency: string;
	currencySymbol: string;
}
export type GamePackTool = {
	name: string;
	image: string;
};

type Article = {
	title: string;
	headerImage: string;
	description: string;
	text: string;
	images: string[];
};

export type GameArticle = {
	_id: string;
	articleId: number;
	title: string;
	headerImage: string;
	description: string;
	text: string;
	updatedAt: string | Date;
	state: boolean;
	slug: string;
	project?: {
		_id: string;
		name: string;
	};
	localization: Record<string, Article>;
};
export type FullGame = {
	_id: string;
	name: string;
	description: string;
	path: string;
	socials: GameSocial[];
	settings: {
		project_id: string;
		sandbox_mode: boolean;
	};
};
export type GameSocial = {
	href: string;
	name: string;
};
