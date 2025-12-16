interface JwtBody {
	exp: number;
	iat: number;
	id: string;
	xsolla_login_project_id: string;
	[key: string]: unknown;
}

function parseObjectFromBase64<T extends Record<string, unknown>>(base64Url: string): T {
	// base64url definition: https://base64.guru/standards/base64url
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	return JSON.parse(atob(base64)) as T;
}

export function getJwtBodyFromToken(token: string): JwtBody {
	const base64TokenData = token.split('.')[1];
	return parseObjectFromBase64<JwtBody>(base64TokenData);
}
