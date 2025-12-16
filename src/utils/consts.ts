/**
 * Query actions are values for key `action` in query params
 */
export const QUERY_ACTIONS = {
	/**
	 * Key in query params for opening paystation
	 */
	OPEN_PAYSTATION: 'open-paystation',
};

/**
 * Keys that we store in useState
 */

export const STATE_KEYS = {
	/**
	 * Key for XsollaToken that is stored globally in useState
	 */
	TOKEN: 'token',

	/**
	 * Key for showing login widget for auth without metaframe
	 */
	SHOW_LOGIN_WIDGET: 'show-login-widget',

	/**
	 * Key for storing user data after auth in state
	 */
	USER: 'user',

	/**
	 * Key for storing user's region based on IP
	 */
	REGION: 'user-region',
};
