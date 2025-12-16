export function useShowLogin(params?: { isOnlyXsollaLogin?: boolean }) {
	// Если пользователь авторизован, то ничего не делаем
	const user = useState('user');
	if (user.value) {
		return;
	}

	// Если нет метафрейма — поднимаем окно xsolla login
	if (!window.metaframe || params?.isOnlyXsollaLogin) {
		const showXsollaLogin = useState('showXsollaModalAuth');
		showXsollaLogin.value = true;
		return;
	}

	// Иначе — открываем окно авторизации в метафрейме
	window.metaframe.partnerActions.openLogin()
}
