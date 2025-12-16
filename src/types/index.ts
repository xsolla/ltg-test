export interface Banner {
	title: string;
	description: string;
	button: {
		text?: string;
		url: string;
	};
	game?: {
		images: {
			logo: string;
		};
	};
	image: string;
	timeout: number;
	ltg_source: string;
}

export type MenuItem = {
	name: string;
	to: string;
	dropdown?: Omit<MenuItem, 'dropdown'>[];
	handler: string;
	external?: boolean;
	xm?: string | { exv: { place: string | undefined }; name: string };
	target?: string;
};

export interface MergedAccount {
	is_merged: boolean;
	confirmed_at: Date;
	email: string;
	game: string;
}

export interface MergeLegacyAcountDTO extends Record<string, any> {
	email: string;
	game: string;
	launcher?: string;
}

export interface PersonalInfo {
	mergedAccounts: MergedAccount[];
}

export interface GamePrice {
	amount: number;
	amountWithoutDiscount: number;
	currency: string;
	currencySymbol: string;
	discount: boolean;
	hasGame: boolean;
	trialDays: number;
	type: 'subscription' | 'free_to_play' | 'game_key';
	isPrimary: boolean;
	planId: string;
	charge?: {
		value: number;
		type: 'month' | string;
	};
}
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

export type GameProperty = {
	cloud: boolean;
	html5: boolean;
	nft: boolean;
	modifier: boolean;
};
export type LinkedGame = {
	name: string;
	path: string;
	settings: {
		type: GameType;
	};
	property: GameProperty;
	price?: GamePrice;
	isGamePurchased?: boolean;
	_id: string;
};

export interface ProjectCategory {
	name: string;
	_id: string;
}

export type GameType = 'subscription' | 'free_to_play' | 'game_key';

export type LauncherType = 'default' | 'life-is-feudal' | 'pacer-classic' | 'dark-lord';

export interface LauncherDownloadData {
	gameTitle?: string;
	installerFilename?: string;
	link: string;
}

type StatsType = 'current_online' | 'peak_utc_time' | 'peak_ccu' | 'dau';

export type Stats = Record<StatsType, string>;

type PromocodeType = 'discount_lapi' | 'xpn' | 'subscription';

export type Promocode = {
	code: string;
	qty: number;
	type: PromocodeType;
};

export type UserData = {
	isAcceptedPrivacy: boolean;
	xsollaUserId: string;
	email: string;
	username: string;
};

export type PaystationTokenData =
	| {
			error?: never;
			token: string;
			sandbox_mode: boolean;
			is_subscription?: boolean;
			hasGame?: boolean;
	  }
	| { error?: string; status?: false; token: null; sandbox_mode: null; is_subscription?: null };

export type SecChUaPlatformHeader = '"Windows"' | '"macOS"' | '"Android"' | '"Linux"' | '"iOS"';

export type GameArticle = {
	_id: string;
	articleId: number;
	title: string;
	headerImage: string;
	description: string;
	text: string;
	state: boolean;
	slug: string;
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
