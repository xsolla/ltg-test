export interface GetUserProjectCatalogByGroupDTO {
	projectId: string;
	group: string;
	locale: string;
	xsollaToken?: string;
}

export interface GetCatalogItemPaystationTokenDTO {
	payload: any;
	token: string;
}
