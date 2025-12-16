import type { Game } from '~/api/game.types';

export function checkAndFixGameData(game: Game): Game {
	fixGameGallery(game);
	return game;
}

function fixGameGallery(game: Game) {
	game.gallery.screenShots = game.gallery.screenShots.filter((screen) => screen.src);
}
