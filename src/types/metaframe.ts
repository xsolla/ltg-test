export interface Metaframe {
	create(payload: CreatePayload): void;
	partnerActions: MetaframePartnerActions;
	setIsMobile(isMobile: boolean): void;
}

interface MetaframePartnerActions {
	openLogin(): void;
	openProfile(): void;
	openCustomMiniApp(params: { miniAppName: string }): void;
}

interface CreatePayload {
	loginProjectId: string;
	merchantId: number;
	projectId: number;
	orbsApiHostId?: string;
	isMobile: boolean;
}

export interface MetaframeEvent extends Event {
	detail: {
		token: string;
	};
}
