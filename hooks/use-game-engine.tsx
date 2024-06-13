import {
	Joystick,
	type PlayerState as PlayroomPlayerState,
	isHost,
	onPlayerJoin,
	useMultiplayerState,
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

interface GameEngineContext {
	timer: number;
	gameState: GameState;
	players: Player[];
	marinePlayer?: Player;
	piratePlayer?: Player;
	mines: number[];
	missiles: number[];
	selectRole(playerId: string, role: Role): void;
	startGame(): void;
}

const GameEngineContext = createContext({} as GameEngineContext);

export enum Role {
	Pirate = 0,
	Marine = 1,
}

export enum GameState {
	Lobby = 0,
	CountDown = 1,
	Game = 2,
	Winner = 3,
}

export const GlobalState = {
	Timer: "time",
	GameState: "gameState",
	Mines: "mines",
	Missiles: "missiles",
};

export const PlayerState = {
	Role: "role",
	Health: "health",
	Stamina: "stamina",
	Winner: "winner",
	Animation: "animation",
	Position: "position",
};

export type Player = {
	state: PlayroomPlayerState;
	joystick: Joystick;
};

const DEFAULT_COUNTDOWN_TIME = 3;
const DEFAULT_GAME_TIME = 180;
const DEFAULT_HEALTH = 100;
const DEFAULT_STAMINA = 100;

export default function GameEngineProvider({ children }: PropsWithChildren) {
	const [timer, setTimer] = useMultiplayerState(
		GlobalState.Timer,
		DEFAULT_COUNTDOWN_TIME,
	);
	const [gameState, setGameState] = useMultiplayerState(
		GlobalState.GameState,
		GameState.Lobby,
	);
	const [mines, setMines] = useMultiplayerState(GlobalState.Mines, []);
	const [missiles, setMissiles] = useMultiplayerState(GlobalState.Missiles, []);
	const [players, setPlayers] = useState<Player[]>([]);

	const marinePlayer = useMemo(
		() =>
			players.find((p) => p.state.getState(PlayerState.Role) === Role.Marine),
		[players],
	);
	const piratePlayer = useMemo(
		() =>
			players.find((p) => p.state.getState(PlayerState.Role) === Role.Pirate),
		[players],
	);

	const isInitialized = useRef(false);
	const timerInterval = useRef<NodeJS.Timeout>();

	useEffect(() => {
		if (isInitialized.current) {
			return;
		}
		isInitialized.current = true;

		onPlayerJoin((state) => {
			console.log("player joined");

			const joystick = new Joystick(state, {
				type: "dpad",
				buttons: [{ id: "fire", label: "Fire" }],
			});

			setPlayers((players) => {
				const isMarineTaken = players.find(
					(p) => p.state.getState(PlayerState.Role) === Role.Marine,
				);
				const role = isMarineTaken ? Role.Pirate : Role.Pirate;
				state.setState(PlayerState.Role, role, true);
				console.log("player role assigned to ", role);
				return [...players, { state, joystick }];
			});

			state.onQuit(() => {
				setPlayers((players) => players.filter((p) => p.state.id !== state.id));
			});
		});
	}, []);

	const runTimer = () => {
		if (gameState === GameState.CountDown) {
			console.log("start countdown interval");
			timerInterval.current = setInterval(() => {
				let newTime = timer - 1;

				if (newTime <= 0) {
					setGameState(GameState.Game);
					newTime = DEFAULT_GAME_TIME;
				}

				setTimer(newTime);
			}, 1000);
			return;
		}

		if (gameState === GameState.Game) {
			console.log("start timer interval");
			timerInterval.current = setInterval(() => {
				const newTime = timer - 1;

				if (newTime <= 0) {
					marinePlayer?.state.setState(PlayerState.Winner, true, true);
					piratePlayer?.state.setState(PlayerState.Winner, false, true);
					setGameState(GameState.Winner);
				} else {
					setTimer(newTime);
				}
			}, 1000);
			return;
		}
	};

	const clearTimer = () => {
		clearInterval(timerInterval.current);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!isHost()) {
			return;
		}

		if ([GameState.Lobby, GameState.Winner].includes(gameState)) {
			return;
		}

		runTimer();
		return clearTimer;
	}, [gameState]);

	const selectRole = (playerId: string, role: Role) => {
		const player = players.find((p) => p.state.id === playerId);
		player?.state.setState(PlayerState.Role, role);
	};

	const startGame = () => {
		if (!isHost()) {
			return;
		}

		console.log("start game");
		for (const player of players) {
			player.state.setState(PlayerState.Health, DEFAULT_HEALTH, true);
			player.state.setState(PlayerState.Stamina, DEFAULT_STAMINA, true);
			player.state.setState(PlayerState.Winner, false, true);
		}
		setTimer(DEFAULT_COUNTDOWN_TIME, true);
		setGameState(GameState.CountDown);
	};

	const contextValue = {
		timer: 3,
		gameState: GameState.CountDown,
		players,
		marinePlayer,
		piratePlayer,
		mines: [],
		missiles: [],
		selectRole,
		startGame,
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
