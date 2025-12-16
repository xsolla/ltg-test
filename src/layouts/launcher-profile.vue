<template>
	<div class="w-ab-100 h-100-S fd-c jc-b-S ai-c page-layout">
		<div class="py-30-S py-80 fd-r-S fd-c ai-t container">
			<ProfileSidebar :is-launcher="true" />
			<NuxtPage />
		</div>
	</div>
</template>
<style lang="css">
.profile-error {
	min-height: 30vh;
	height: min-content;
	width: 100%;
	background-color: var(--darker-color);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: auto;
	margin-bottom: auto;
}

.profile-error__wrapper {
	text-align: center;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: var(--dark-color);
	border-radius: 24px;
	width: 40%;
	padding: 50px 0px;
}

@media screen and (max-width: 769px) {
	.profile-error__wrapper {
		width: 90%;
	}
}

.profile-error__wrapper span {
	margin-bottom: 15px;
}

.profile-error__wrapper h3 {
	font-size: 16px;
	font-weight: 500;
	margin-bottom: 10px;
}

.profile-error__wrapper p {
	font-size: 14px;
	opacity: 95%;
}

.profile-error__wrapper-icon {
	width: 32px;
	height: 32px;
	margin-bottom: 15px;
}
</style>
