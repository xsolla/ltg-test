export type Game = {
	body: {
		title: string;
		description: string;
	};
	createdAt: string;
	description: string;
	fullDescription: string;
	gallery: {
		screenShots: {
			id: number;
			src: string;
		}[];
		videos: {
			id: number;
			src: string;
		}[];
		showScreenShots: boolean;
		showVideos: boolean;
	};
	games: {
		_id: string;
		name: string;
	}[];
	images: {
		bg: {
			desktop: string;
			tablet: string;
		};
		card: string;
		main: string;
		logo: string;
		icon: string;
	};
	name: string;
	path: string;
	publisher_id: string;
};
