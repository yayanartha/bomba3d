import {
	GameState,
	PlayerState,
	Role,
	playerBaseStats,
	playerStats,
	useGameEngine,
} from "@/hooks/use-game-engine";
import { useRef, useState } from "react";
import { Timer } from "./timer";
import { myPlayer, usePlayersList } from "playroomkit";
import { StatusBar } from "./status-bar";
import { Arrow } from "./arrow";

export const UI = () => {
	usePlayersList(true);
	const me = myPlayer();
	const { gameState, players, timer } = useGameEngine();
	const atbBarRef = useRef<HTMLDivElement>(null);

	const [role, setRole] = useState<"pirate" | "marine">(
		me?.getState(PlayerState.Role) || Role.Pirate,
	);

	const changeRole = () => {
		setRole((role) => {
			const nextRole = (role === Role.Pirate ? Role.Marine : Role.Pirate) as
				| "pirate"
				| "marine";
			me?.setState(PlayerState.Role, nextRole);
			return nextRole;
		});
	};

	if (gameState === GameState.Lobby) {
		return (
			<main className="fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col">
				<div className="flex flex-col flex-1 items-center justify-between p-8 gap-4">
					<div>
						<div className="text-center text-6xl text-stone-800 tracking-tighter font-sans">
							{role === Role.Pirate ? "The Runner" : "The Chaser"}
						</div>
						<div className="-mt-2">
							<div className="text-center text-4xl text-red-700 tracking-tighter font-sans">
								{role === Role.Pirate ? "Pirate" : "Marine"}
							</div>
						</div>
					</div>

					<div className="flex flex-row w-full max-w-[360px] items-center justify-between">
						<div
							className="flex flex-col w-12 h-12 items-center justify-center scale-150"
							onClick={changeRole}
						>
							<div className="absolute animate-ping opacity-50">
								<Arrow />
							</div>
							<Arrow stroke />
						</div>
						<button
							className="flex flex-col w-12 h-12 items-center justify-center scale-150 rotate-180"
							onClick={changeRole}
						>
							<div className="absolute animate-ping opacity-50">
								<Arrow />
							</div>
							<Arrow stroke />
						</button>
					</div>
				</div>

				<div className="flex-1 flex flex-col items-center justify-end p-8 gap-4">
					<div className="flex flex-col w-full max-w-[360px] self-center bg-white/70 rounded-2xl p-4 border-2 border-white">
						<StatusBar
							icon="❤️"
							value={playerBaseStats[role].hp}
							maxValue={playerStats.maxHp}
						/>
						<StatusBar
							icon="🔋"
							value={playerBaseStats[role].stamina}
							maxValue={playerStats.maxStamina}
						/>
						<StatusBar
							icon="🔥"
							value={playerBaseStats[role].power}
							maxValue={playerStats.maxPower}
						/>
						<StatusBar
							icon="💨"
							value={playerBaseStats[role].speed}
							maxValue={playerStats.maxSpeed}
						/>
					</div>

					<button
						className="w-full max-w-[360px] bg-red-700 rounded-2xl border-4 border-slate-800 h-16 text-2xl"
						onClick={() => console.log("PLAY")}
					>
						PLAY
					</button>
				</div>
			</main>
		);
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
