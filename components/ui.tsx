import { GameState, useGameEngine } from "@/hooks/use-game-engine";
import { useRef } from "react";
import { Timer } from "./timer";

export const UI = () => {
	const { gameState, players, timer } = useGameEngine();
	const atbBarRef = useRef<HTMLDivElement>(null);

	if (gameState === GameState.Lobby) {
		return null;
	}

	if (gameState === GameState.Game) {
		return (
			<main className="fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col gap-4 items-stretch justify-between pointer-events-none">
				{/* <div
				ref={atbBarRef}
				className="h-12 rounded-2xl bg-slate-600 border-slate-300 border-2 m-6"
			></div> */}

				<div className="flex-row items-center gap-4">
					<div className="flex-1">
						{players.length > 0 && (
							<div className="bg-white rounded-2xl p-4">
								<div className="flex-row items-center gap-4">
									{/* <img
									src={players[0].state.getProfile().photo}
									alt="p1-avatar"
								/> */}
									<div className="flex-1">
										<h3>{players[0].state.getProfile().name}</h3>
									</div>
								</div>
							</div>
						)}
					</div>

					<Timer />

					<div className="flex-1"></div>
				</div>
			</main>
		);
	}

	if (gameState === GameState.CountDown) {
		return (
			<div className="flex-1 items-center justify-center bg-slate-800/60">
				<h1 className="text-white">{timer}</h1>
			</div>
		);
	}

	if (gameState === GameState.Winner) {
		return null;
	}

	return null;
};
