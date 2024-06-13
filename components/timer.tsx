import { GameState, useGameEngine } from "@/hooks/use-game-engine";

export const Timer = () => {
	const { gameState, timer } = useGameEngine();

	if (gameState === GameState.Game) {
		const min = Math.floor(timer / 60);
		const sec = timer % 60;
		const time = `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;

		return <h1 className="text-white">{time}</h1>;
	}

	return null;
};
