import { CameraControls, Environment, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Board } from "./board";
import { RigidBody, vec3 } from "@react-three/rapier";
import { ShipLargeController } from "./ship-large-controller";
import { ShipSmallController } from "./ship-small-controller";
import { MissileController } from "./missile-controller";
import { MineController } from "./mine-controller";
import {
	GameState,
	PlayerState,
	Role,
	useGameEngine,
} from "@/hooks/use-game-engine";
import {
	Joystick,
	isHost,
	myPlayer,
	onPlayerJoin,
	type PlayerState as PlayroomPlayerState,
} from "playroomkit";
import { useThree } from "@react-three/fiber";
import { FireHit } from "./FireHit";

type Player = {
	state: PlayroomPlayerState;
	joystick: Joystick;
};

export default function Game() {
	const [piratePlayer, setPiratePlayer] = useState<Player>();
	const [marinePlayer, setMarinePlayer] = useState<Player>();
	const isInitialized = useRef(false);
	const timerInterval = useRef<NodeJS.Timeout>();

	useEffect(() => {
		if (isInitialized.current) return;
		isInitialized.current = true;

		onPlayerJoin((state) => {
			const role = state.getState(PlayerState.Role);
			console.log("player joined as", role);

			if (!role) return;

			const joystick = new Joystick(state, {
				type: "dpad",
				buttons: [
					{
						id: "fire",
						label: role === Role.Pirate ? "💣" : "🚀",
					},
				],
			});

			if (role === Role.Pirate) {
				setPiratePlayer({ state, joystick });
				state.onQuit(() => setPiratePlayer(undefined));
			} else {
				setMarinePlayer({ state, joystick });
				state.onQuit(() => setMarinePlayer(undefined));
			}
		});
	}, []);

	// const {
	// 	piratePlayer,
	// 	marinePlayer,
	// 	mines,
	// 	missiles,
	// 	networkMines,
	// 	networkMissiles,
	// 	hitByMine,
	// 	hitByMissile,
	// 	networkHitByMine,
	// 	networkHitByMissile,
	// 	onHitByMine,
	// 	onHitByMissile,
	// 	onHitByMineEnded,
	// 	onHitByMissileEnded,
	// } = useGameEngine();
	const viewport = useThree((state) => state.viewport);
	const scalingRatio = Math.min(1, viewport.width / 3);

	return (
		<>
			<Board />

			{piratePlayer && (
				<ShipSmallController
					state={piratePlayer.state}
					control={piratePlayer.joystick}
					isPlayer={myPlayer().id === piratePlayer.state.id}
				/>
			)}

			{marinePlayer && (
				<ShipLargeController
					state={marinePlayer.state}
					control={marinePlayer.joystick}
					isPlayer={myPlayer().id === marinePlayer.state.id}
				/>
			)}

			{/* <group scale={scalingRatio}>
				{(isHost() ? mines : networkMines).map((mine) => (
					<MineController
						key={mine.id}
						{...mine}
						onHit={(position) => onHitByMine(mine.id, position)}
					/>
				))}

				{(isHost() ? missiles : networkMissiles).map((missile) => (
					<MissileController
						key={missile.id}
						{...missile}
						onHit={(position) => onHitByMissile(missile.id, position)}
					/>
				))}

				{(isHost() ? hitByMine : networkHitByMine).map((hit) => (
					<FireHit
						key={hit.id}
						{...hit}
						onEnded={() => onHitByMineEnded(hit.id)}
					/>
				))}

				{(isHost() ? hitByMissile : networkHitByMissile).map((hit) => (
					<FireHit
						key={hit.id}
						{...hit}
						onEnded={() => onHitByMissileEnded(hit.id)}
					/>
				))}

				
			</group> */}
		</>
	);
}
