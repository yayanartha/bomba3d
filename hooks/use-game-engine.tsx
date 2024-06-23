import { ValueOf } from "next/dist/shared/lib/constants";
import {
	Joystick,
	type PlayerState as PlayroomPlayerState,
	isHost,
	onPlayerJoin,
	useMultiplayerState,
	usePlayersList,
} from "playroomkit";
import {
	useContext,
	createContext,
	type PropsWithChildren,
	useState,
	useRef,
	useEffect,
	useMemo,
} from "react";
import type * as THREE from "three";
import { randInt } from "three/src/math/MathUtils.js";

type Mine = { id: string; position: THREE.Vector3; playerId: string };
type Missile = { id: string; position: THREE.Vector3; playerId: string };
type FirePosition = { id: string; position: THREE.Vector3 };

interface GameEngineContext {
	timer: number;
	gameState: ValueOf<typeof GameState>;
	players: Player[];
	piratePlayer?: Player;
	marinePlayer?: Player;
	mines: Mine[];
	missiles: Missile[];
	selectRole(playerId: string, role: ValueOf<typeof Role>): void;
	startGame(): void;
	networkMines: Mine[];
	networkMissiles: Missile[];
	hitByMine: FirePosition[];
	hitByMissile: FirePosition[];
	networkHitByMine: FirePosition[];
	networkHitByMissile: FirePosition[];
	onFireMine(mine: Mine): void;
	onFireMissile(missile: Missile): void;
	onHitByMine(mineId: string, position: THREE.Vector3): void;
	onHitByMissile(mineId: string, position: THREE.Vector3): void;
	onHitByMineEnded(hitId: string): void;
	onHitByMissileEnded(hitId: string): void;
}

const GameEngineContext = createContext({} as GameEngineContext);

export const Role = {
	Pirate: "pirate",
	Marine: "marine",
};

export const GameState = {
	Lobby: "lobby",
	CountDown: "countDown",
	Game: "game",
	Winner: "winner",
};

export const GlobalState = {
	Timer: "time",
	GameState: "gameState",
	Mines: "mines",
	Missiles: "missiles",
	HitByMine: "hitByMine",
	HitByMissile: "hitByMissile",
	PiratePlayer: "piratePlayer",
	MarinePlayer: "marinePlayer",
};

export const PlayerState = {
	Role: "role",
	Health: "health",
	Stamina: "stamina",
	Dead: "dead",
	Winner: "winner",
	Animation: "animation",
	Position: "position",
};

export type Player = {
	state: PlayroomPlayerState;
	joystick: Joystick;
};

export type WeaponUserData = {
	type: "mine" | "missile";
	damage: number;
	playerId: number;
};

const DEFAULT_COUNTDOWN_TIME = 3;
const DEFAULT_GAME_TIME = 180;
const DEFAULT_HEALTH = 100;
const DEFAULT_STAMINA = 100;

export const playerStats = {
	maxHp: 150,
	maxStamina: 150,
	maxPower: 150,
	maxSpeed: 150,
};

export const playerBaseStats = {
	pirate: {
		hp: 100,
		stamina: 120,
		staminaRegenSpeed: 20,
		power: 40,
		speed: 80,
	},
	marine: {
		hp: 150,
		stamina: 100,
		staminaRegenSpeed: 15,
		power: 50,
		speed: 50,
	},
};

export default function GameEngineProvider({ children }: PropsWithChildren) {
	// const [timer, setTimer] = useMultiplayerState(
	// 	GlobalState.Timer,
	// 	DEFAULT_COUNTDOWN_TIME,
	// );
	const [gameState, setGameState] = useMultiplayerState(
		GlobalState.GameState,
		GameState.Lobby,
	);
	// usePlayersList(true);
	// const [players, setPlayers] = useState<Player[]>([]);

	// const piratePlayer = useMemo(
	// 	() =>
	// 		players.find((p) => p.state.getState(PlayerState.Role) === Role.Pirate),
	// 	[players],
	// );
	// const marinePlayer = useMemo(
	// 	() =>
	// 		players.find((p) => p.state.getState(PlayerState.Role) === Role.Marine),
	// 	[players],
	// );

	const [networkMines, setNetworkMines] = useMultiplayerState(
		GlobalState.Mines,
		[],
	);
	const [networkMissiles, setNetworkMissiles] = useMultiplayerState(
		GlobalState.Missiles,
		[],
	);
	const [mines, setMines] = useState<Mine[]>([]);
	const [missiles, setMissiles] = useState<Missile[]>([]);

	const [networkHitByMine, setNetworkHitByMine] = useMultiplayerState(
		GlobalState.HitByMine,
		[],
	);
	const [networkHitByMissile, setNetworkHitByMissile] = useMultiplayerState(
		GlobalState.HitByMissile,
		[],
	);
	const [hitByMine, setHitByMine] = useState<FirePosition[]>([]);
	const [hitByMissile, setHitByMissile] = useState<FirePosition[]>([]);

	const isInitialized = useRef(false);
	const timerInterval = useRef<NodeJS.Timeout>();

	// useEffect(() => {
	// 	if (isInitialized.current) {
	// 		return;
	// 	}
	// 	isInitialized.current = true;

	// 	onPlayerJoin((state) => {
	// 		console.log("player joined");

	// 		const joystick = new Joystick(state, {
	// 			type: "dpad",
	// 			buttons: [{ id: "fire", label: "Fire" }],
	// 		});
	// 		state.setState(PlayerState.Role, randInt(0, 1), isHost());
	// 		setPlayers((players) => [...players, { state, joystick }]);
	// 		state.onQuit(() => {
	// 			setPlayers((players) => players.filter((p) => p.state.id !== state.id));
	// 		});
	// 	});
	// }, []);

	// const runTimer = () => {
	// 	if (gameState === GameState.CountDown) {
	// 		console.log("start countdown interval");
	// 		timerInterval.current = setInterval(() => {
	// 			let newTime = timer - 1;

	// 			if (newTime <= 0) {
	// 				setGameState(GameState.Game);
	// 				newTime = DEFAULT_GAME_TIME;
	// 			}

	// 			setTimer(newTime);
	// 		}, 1000);
	// 		return;
	// 	}

	// 	if (gameState === GameState.Game) {
	// 		console.log("start timer interval");
	// 		timerInterval.current = setInterval(() => {
	// 			const newTime = timer - 1;

	// 			if (newTime <= 0) {
	// 				setGameState(GameState.Winner);
	// 			} else {
	// 				setTimer(newTime);
	// 			}
	// 		}, 1000);
	// 		return;
	// 	}
	// };

	const clearTimer = () => {
		clearInterval(timerInterval.current);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	// useEffect(() => {
	// 	if (!isHost()) {
	// 		return;
	// 	}

	// 	if ([GameState.Lobby, GameState.Winner].includes(gameState)) {
	// 		return;
	// 	}

	// 	runTimer();
	// 	return clearTimer;
	// }, [gameState]);

	// const selectRole = (playerId: string, role: Role) => {
	// 	const player = players.find((p) => p.state.id === playerId);
	// 	player?.state.setState(PlayerState.Role, role);
	// };

	// const startGame = () => {
	// 	if (!isHost()) {
	// 		return;
	// 	}

	// 	console.log("start game");
	// 	for (const player of players) {
	// 		player.state.setState(PlayerState.Health, DEFAULT_HEALTH, true);
	// 		player.state.setState(PlayerState.Stamina, DEFAULT_STAMINA, true);
	// 		player.state.setState(PlayerState.Winner, false, true);
	// 	}
	// 	setTimer(DEFAULT_COUNTDOWN_TIME, true);
	// 	setGameState(GameState.CountDown);
	// };

	const onFireMine = (mine: Mine) => {
		setMines((prev) => [...prev, mine]);
	};

	const onFireMissile = (missile: Missile) => {
		setMissiles((prev) => [...prev, missile]);
	};

	const onHitByMine = (mineId: string, position: THREE.Vector3) => {
		setMines((prev) => prev.filter((m) => m.id !== mineId));
		setHitByMine((prev) => [...prev, { id: mineId, position }]);
	};

	const onHitByMissile = (missileId: string, position: THREE.Vector3) => {
		setMissiles((prev) => prev.filter((m) => m.id !== missileId));
		setHitByMissile((prev) => [...prev, { id: missileId, position }]);
	};

	const onHitByMineEnded = (hitId: string) => {
		setHitByMine((prev) => prev.filter((h) => h.id !== hitId));
	};

	const onHitByMissileEnded = (hitId: string) => {
		setHitByMissile((prev) => prev.filter((h) => h.id !== hitId));
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setNetworkMines(mines);
	}, [mines]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setNetworkMissiles(missiles);
	}, [missiles]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setNetworkHitByMine(hitByMine);
	}, [hitByMine]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setNetworkHitByMissile(hitByMissile);
	}, [hitByMissile]);

	const contextValue = {
		timer: 0,
		gameState,
		players: [],
		piratePlayer: undefined,
		marinePlayer: undefined,
		mines,
		missiles,
		networkMines,
		networkMissiles,
		hitByMine,
		hitByMissile,
		networkHitByMine,
		networkHitByMissile,
		selectRole: () => null,
		startGame: () => null,
		onFireMine,
		onFireMissile,
		onHitByMine,
		onHitByMissile,
		onHitByMineEnded,
		onHitByMissileEnded,
	};

	return (
		<GameEngineContext.Provider value={{ ...contextValue }}>
			{children}
		</GameEngineContext.Provider>
	);
}

export const useGameEngine = () => {
	const context = useContext(GameEngineContext);

	if (!context) {
		throw new Error("useGameEngine must be used within a GameEngineProvider");
	}

	return context;
};
