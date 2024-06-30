import {
	GameState,
	GlobalState,
	PlayerState,
	Role,
	playerBaseStats,
	playerStats,
} from "@/hooks/use-game-engine";
import { useMemo, useState } from "react";
import {
	isHost,
	myPlayer,
	useMultiplayerState,
	usePlayersList,
} from "playroomkit";
import { StatusBar } from "./status-bar";
import { Arrow } from "./arrow";
import { motion } from "framer-motion";
import { CountdownTimer } from "./countdown-timer";

export const UI = () => {
	const players = usePlayersList(true);
	const me = myPlayer();
	const [gameState, setGameState] = useMultiplayerState(
		GlobalState.GameState,
		GameState.Lobby,
	);
	const enemy = useMemo(() => {
		if (players.length === 1) return undefined;
		return players.find((p) => p.id !== me?.id);
	}, [players]);

	const [role, setRole] = useState<"pirate" | "marine">(
		me?.getState(PlayerState.Role) || Role.Pirate,
	);
	const [invited, setInvited] = useState(false);
	const [isShowInfo, setIsShowInfo] = useState(false);

	const changeRole = () => {
		setRole((role) => {
			const nextRole = (role === Role.Pirate ? Role.Marine : Role.Pirate) as
				| "pirate"
				| "marine";
			me?.setState(PlayerState.Role, nextRole);
			return nextRole;
		});
	};

	const startGame = () => {
		setGameState(GameState.CountDown);
		setTimeout(() => {
			setGameState(GameState.Game);
		}, 4000);
	};

	const inviteFriend = () => {
		navigator.clipboard.writeText(window.location.href);
		setInvited(true);
		setTimeout(() => setInvited(false), 2000);
	};

	if (gameState === GameState.Lobby) {
		if (isShowInfo) {
			return (
				<div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col">
					<motion.div
						animate={{ scale: 1, opacity: 1 }}
						initial={{ scale: 0, opacity: 0 }}
						exit={{ scale: 0, opacity: 0 }}
						className="flex flex-1 flex-col mx-6 my-8 bg-black/50 rounded-2xl backdrop-blur-sm p-8 gap-8"
					>
						<motion.button
							className="w-12 h-12 rounded-full bg-white border-2 border-slate-500 fixed -top-2 -right-2 items-center justify-center flex flex-col text-black text-xl"
							onClick={() => setIsShowInfo(false)}
							whileTap={{ scale: 0.8 }}
						>
							❌
						</motion.button>

						<div className="text-3xl text-center">💡 How to Play</div>

						<div className="gap-4">
							<div className="text-2xl text-yellow-300">💣 The Runner</div>
							<div className="text-lg">
								Survive from enemy attacks until the game ends!
							</div>
						</div>

						<div className="gap-4">
							<div className="text-2xl text-yellow-300">🚀 The Chaser</div>
							<div className="text-lg">
								Sink the enemy ship before the time runs out!
							</div>
						</div>

						<div className="border-b-2 border-dashed border-slate-400" />

						<div className="gap-4">
							<div className="text-2xl text-yellow-300">⏱️ Gameplay time</div>
							<div className="text-lg">03:00 minutes or until a ship sank.</div>
						</div>

						<div className="gap-4">
							<div className="text-2xl text-yellow-300">❤️ Health Bar</div>
							<div className="text-lg">
								Your ship condition. Zero health means your ship will sink.
							</div>
						</div>

						<div className="gap-4">
							<div className="text-2xl text-yellow-300">🔋 Stamina Bar</div>
							<div className="text-lg">
								Moving or doing action costs Stamina. Stay put to regenerate
								faster!
							</div>
						</div>
					</motion.div>
				</div>
			);
		}

		return (
			<div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col">
				<div className="flex flex-col flex-1 items-center justify-between p-8 gap-4">
					<div>
						<div className="text-center text-6xl text-red-700 tracking-tighter font-sans">
							{role === Role.Pirate ? "The Runner" : "The Chaser"}
						</div>

						{enemy && (
							<motion.div
								className="text-lg text-slate-700 p-2 self-center rounded-full"
								initial={{
									backgroundImage:
										"linear-gradient(to right, white, white), linear-gradient(0deg, red, white 40%)",
								}}
								animate={{
									backgroundImage:
										"linear-gradient(to right, white, white), linear-gradient(360deg, red, white 40%)",
								}}
								transition={{
									type: "tween",
									ease: "linear",
									duration: 2,
									repeat: Infinity,
								}}
								style={{
									border: "2px solid transparent",
									backgroundClip: "padding-box, border-box",
									backgroundOrigin: "padding-box, border-box",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								vs
								<div className="text-pink-500 mx-1">
									{enemy.getProfile().name}
								</div>{" "}
								(
								{enemy.getState(PlayerState.Role) === Role.Pirate
									? "The Runner"
									: "The Chaser"}
								)
							</motion.div>
						)}
					</div>

					<div className="flex flex-row w-full max-w-[360px] items-center justify-between">
						<motion.button
							className="flex flex-col w-12 h-12 items-center justify-center"
							onClick={changeRole}
							whileTap={{ scale: 0.8 }}
						>
							<div className="absolute animate-ping opacity-50">
								<Arrow />
							</div>
							<Arrow stroke />
						</motion.button>

						<motion.button
							className="flex flex-col w-12 h-12 items-center justify-center"
							onClick={changeRole}
							whileTap={{ scale: 0.8 }}
						>
							<div className="rotate-180">
								<div className="absolute animate-ping opacity-50">
									<Arrow />
								</div>
								<Arrow stroke />
							</div>
						</motion.button>
					</div>
				</div>

				<div className="flex-1 flex flex-col items-center justify-end p-8 gap-4">
					<motion.div
						layout
						className="flex flex-col w-full max-w-[360px] self-center bg-white/20 rounded-2xl p-4 border-2 border-white/30 backdrop-blur-sm"
					>
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
					</motion.div>

					{isHost() && (
						<>
							<motion.button
								layout
								animate={{ y: 0, opacity: 1 }}
								initial={{ y: 100, opacity: 0 }}
								className="w-full max-w-[360px] bg-red-700 rounded-2xl border-2 border-red-800 h-12 text-2xl"
								onClick={startGame}
								whileTap={{ scale: 0.8 }}
							>
								{players.length > 1 ? "START GAME" : "PLAY SOLO"}
							</motion.button>

							{players.length === 1 && (
								<motion.button
									layout
									animate={{ y: 0, opacity: 1 }}
									initial={{ y: 100, opacity: 0 }}
									className="w-full max-w-[360px] bg-white rounded-2xl border-2 border-slate-100 h-12 text-2xl text-slate-700 disabled:bg-yellow-400 disabled:border-yellow-500"
									onClick={inviteFriend}
									whileTap={!invited ? { scale: 0.8 } : undefined}
									disabled={invited}
								>
									{invited ? "LINK COPIED" : "INVITE FRIEND"}
								</motion.button>
							)}
						</>
					)}

					<motion.button
						layout
						animate={{ y: 0, opacity: 1 }}
						initial={{ y: 100, opacity: 0 }}
						className="bg-black/40 rounded-full px-4 py-1 self-center text-lg"
						onClick={() => setIsShowInfo(true)}
						whileTap={{ scale: 0.8 }}
					>
						💡 How to play?
					</motion.button>
				</div>
			</div>
		);
	}

	if (gameState === GameState.CountDown) {
		return (
			<div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col items-center justify-center">
				<CountdownTimer />
			</div>
		);
	}

	// if (gameState === GameState.Game) {
	// 	return (
	// 		<main className="fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col gap-4 items-stretch justify-between pointer-events-none">
	// 			{/* <div
	// 			ref={atbBarRef}
	// 			className="h-12 rounded-2xl bg-slate-600 border-slate-300 border-2 m-6"
	// 		></div> */}

	// 			<div className="flex-row items-center gap-4">
	// 				<div className="flex-1">
	// 					{players.length > 0 && (
	// 						<div className="bg-white rounded-2xl p-4">
	// 							<div className="flex-row items-center gap-4">
	// 								{/* <img
	// 								src={players[0].state.getProfile().photo}
	// 								alt="p1-avatar"
	// 							/> */}
	// 								<div className="flex-1">
	// 									<h3>{players[0].state.getProfile().name}</h3>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					)}
	// 				</div>

	// 				<Timer />

	// 				<div className="flex-1"></div>
	// 			</div>
	// 		</main>
	// 	);
	// }

	// if (gameState === GameState.Winner) {
	// 	return null;
	// }

	return null;
};
