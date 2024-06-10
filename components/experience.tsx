import { CameraControls, Environment, SoftShadows } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Board } from "./board";
import { Mine } from "./mine";
import { Missile } from "./missile";
import { RigidBody } from "@react-three/rapier";
import { ShipLargeController } from "./ship-large-controller";
import { ShipSmallController } from "./ship-small-controller";
import {
	Joystick,
	type PlayerState,
	isHost,
	onPlayerJoin,
	useMultiplayerState,
} from "playroomkit";
import { randInt } from "three/src/math/MathUtils.js";
import { MissileController } from "./missile-controller";
import { MineController } from "./mine-controller";

enum Role {
	Pirate = 0,
	Marine = 1,
}

export const Experience = () => {
	// const [countdown, setCountdown] = useMultiplayerState("countdown", 0);
	// const [timer, setTimer] = useMultiplayerState("timer", 0);
	// const [gameState, setGameState] = useMultiplayerState(
	// 	"gameState",
	// 	"chooseRole",
	// );
	// const [players, setPlayers] = useState<
	// 	{
	// 		state: PlayerState;
	// 		joystick: Joystick;
	// 	}[]
	// >([]);

	// const countdownInterval = useRef<NodeJS.Timeout>();
	// const timerInterval = useRef<NodeJS.Timeout>();

	// const marinePlayer = useMemo(
	// 	() =>
	// 		players.find((player) => player.state.getState("role") === Role.Marine),
	// 	[players],
	// );
	// const piratePlayer = useMemo(
	// 	() =>
	// 		players.find((player) => player.state.getState("role") === Role.Pirate),
	// 	[players],
	// );
	// console.log("marinePlayer", marinePlayer);
	// console.log("piratePlayer", piratePlayer);

	// const startGame = () => {
	// 	if (isHost()) {
	// 		console.log("start game");
	// 		for (const player of players) {
	// 			player.state.setState("health", 100, true);
	// 			player.state.setState("stamina", 100, true);
	// 			player.state.setState("winner", false, true);
	// 		}
	// 		setCountdown(3, true);
	// 		setTimer(180, true);
	// 		setGameState("countdown");
	// 	}
	// };

	// useEffect(() => {
	// 	// startGame();

	// 	onPlayerJoin((state) => {
	// 		console.log("player joined");

	// 		const joystick = new Joystick(state, {
	// 			type: "dpad",
	// 			buttons: [{ id: "fire", label: "Fire" }],
	// 		});

	// 		setPlayers((players) => {
	// 			if (players.length > 0) {
	// 				const otherPlayerRole = players[0].state.getState("role");
	// 				const availableRole =
	// 					otherPlayerRole === Role.Pirate ? Role.Marine : Role.Pirate;
	// 				state.setState("role", availableRole, true);
	// 				console.log("player role assigned to ", availableRole);
	// 			} else {
	// 				const randomRole = randInt(0, 1);
	// 				state.setState("role", randomRole, true);
	// 				console.log("player role assigned to ", randomRole);
	// 			}

	// 			return [...players, { state, joystick }];
	// 		});

	// 		state.onQuit(() => {
	// 			setPlayers((players) => players.filter((p) => p.state.id !== state.id));
	// 		});
	// 	});
	// }, []);

	// const runTimer = () => {
	// 	if (gameState === "countdown") {
	// 		console.log("start countdown interval");
	// 		countdownInterval.current = setInterval(() => {
	// 			if (!isHost()) return;

	// 			const newTime = countdown - 1;
	// 			if (newTime <= 0) {
	// 				setGameState("playing");
	// 			} else {
	// 				setCountdown(newTime);
	// 			}
	// 		}, 1000);
	// 	} else if (gameState === "playing") {
	// 		console.log("start timer interval");
	// 		timerInterval.current = setInterval(() => {
	// 			if (!isHost()) return;

	// 			const newTime = timer - 1;
	// 			if (newTime <= 0) {
	// 				for (const player of players) {
	// 					player.state.setState(
	// 						"winner",
	// 						player.state.getState("role") === Role.Marine,
	// 						true,
	// 					);
	// 				}
	// 				setGameState("gameover");
	// 			} else {
	// 				setTimer(newTime);
	// 			}
	// 		}, 1000);
	// 	}
	// };

	// const clearTimer = () => {
	// 	if (countdownInterval.current) clearInterval(countdownInterval.current);
	// 	if (timerInterval.current) clearInterval(timerInterval.current);
	// };

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	// useEffect(() => {
	// 	runTimer();
	// 	return clearTimer;
	// }, [gameState]);

	return (
		<>
			{/* <directionalLight
				position={[25, 18, -25]}
				intensity={0.8}
				castShadow
				shadow-camera-near={0}
				shadow-camera-far={80}
				shadow-camera-left={-30}
				shadow-camera-right={30}
				shadow-camera-top={25}
				shadow-camera-bottom={-25}
				shadow-mapSize-width={4096}
				shadow-bias={-0.01}
			/>
			<SoftShadows size={40} /> */}

			<CameraManager />

			<Environment preset="sunset" />

			<RigidBody type="fixed" colliders="cuboid" position-y={-1} name="ocean">
				<Board />
			</RigidBody>

			<MineController position-x={5} />

			<MissileController position-x={10} />

			{/* <ShipPirate position-x={-4} position-y={-0.5} position-z={-5} /> */}
			{/* <ShipPirate position-y={-0.5} position-z={-5} /> */}
			{/* <ShipPirate position-x={4} position-y={-0.5} position-z={-5} /> */}

			{/* <ShipLight position-x={-4} position-y={-1} position-z={5} /> */}
			{/* <ShipLight position-y={-1} position-z={5} /> */}
			{/* <ShipLight position-x={4} position-y={-1} position-z={5} /> */}

			{/* <ShipSmall position-z={-5} /> */}

			{/* <ShipLarge position-z={10} /> */}

			<ShipSmallController position-z={-5} />
			<ShipLargeController position-z={10} />
		</>
	);
};

const CameraManager = () => {
	const cameraRef = useRef<CameraControls>(null);

	return <CameraControls ref={cameraRef} />;
};
