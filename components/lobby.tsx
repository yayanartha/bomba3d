"use client";
import {
	type PlayerState as PlayroomPlayerState,
	myPlayer,
	usePlayersList,
	usePlayerState,
} from "playroomkit";
import { Board } from "./board";
import { Ship, WaveSize } from "./ship";
import { PlayerState, Role } from "@/hooks/use-game-engine";
import type { Vector3 } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import { CameraControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";

export default function Lobby() {
	usePlayersList(true);
	const me = myPlayer();

	return (
		<>
			<Board />
			{me && <RoleSwitcher player={me} />}
		</>
	);
}

const RoleSwitcher = ({ player }: { player: PlayroomPlayerState }) => {
	const players = usePlayersList();
	const [role] = usePlayerState(player, PlayerState.Role, Role.Pirate);
	const model = Ships[role === Role.Pirate ? 0 : 1];
	const controls = useRef<CameraControls>(null);
	const enemy = players.find((p) => p.id !== player.id);
	const isMultiplayer = players.length > 1;

	useEffect(() => {
		// Multiplayer
		// if (isMultiplayer) {
		// 	controls.current?.setLookAt(
		// 		model.cameraLookAt.positionX,
		// 		model.cameraLookAt.positionY,
		// 		model.cameraLookAt.positionZ + 2,
		// 		model.cameraLookAt.targetX - 1,
		// 		model.cameraLookAt.targetY * -0.1,
		// 		model.cameraLookAt.targetZ,
		// 		true,
		// 	);
		// }
		// Solo
		// else {
		controls.current?.setLookAt(
			model.cameraLookAt.positionX,
			model.cameraLookAt.positionY,
			model.cameraLookAt.positionZ,
			model.cameraLookAt.targetX,
			model.cameraLookAt.targetY,
			model.cameraLookAt.targetZ,
			true,
		);
		// }
	}, [model]);

	const renderEnemy = useMemo(() => {
		if (!enemy) return null;

		return (
			<Ship
				model={Ships[enemy.getState(PlayerState.Role) === Role.Pirate ? 0 : 1]}
				rotation-y={degToRad(145)}
				position={role === Role.Pirate ? [-3, -1, -6] : [-6, -1, -3]}
			/>
		);
	}, [enemy]);

	return (
		<>
			<CameraControls
				ref={controls}
				mouseButtons={{
					left: 0,
					middle: 0,
					right: 0,
					wheel: 0,
				}}
				touches={{
					one: 0,
					two: 0,
					three: 0,
				}}
			/>

			<Ship
				model={model}
				// playerName={isMultiplayer ? "You" : undefined}
				rotation-y={degToRad(145)}
				position={[0, -1, 0]}
				renderWeapon={!isMultiplayer}
			/>

			{/* {renderEnemy} */}
		</>
	);
};

const Ships = [
	{
		role: Role.Pirate,
		position: [0, -0.5, 0] as Vector3,
		rotationY: degToRad(-90),
		character: "skeleton",
		characterPosition: [0, 0.4, 0] as Vector3,
		characterRotation: degToRad(0),
		cameraLookAt: {
			positionX: 0,
			positionY: 5,
			positionZ: 10,
			targetX: 0,
			targetY: -0.5,
			targetZ: 0,
		},
		weapons: [
			{
				id: "weapon-mine-1",
				position: [-2, 1, -1] as Vector3,
				rotation: 0,
				scale: 5,
			},
			{
				id: "weapon-mine-2",
				position: [-1.5, 1, -2.7] as Vector3,
				rotation: 0,
				scale: 7,
			},
			{
				id: "weapon-mine-3",
				position: [3.2, 1, 2.2] as Vector3,
				rotation: 0,
				scale: 3,
			},
		],
		wave: {
			position: [0, 0.005, 4.5] as Vector3,
			size: [2, 5, 10, 10] as WaveSize,
		},
	},
	{
		role: Role.Marine,
		position: [0, 0, 0] as Vector3,
		character: "captain",
		rotationY: degToRad(-90),
		characterPosition: [0, 1.6, -4] as Vector3,
		characterRotation: degToRad(0),
		cameraLookAt: {
			positionX: 0,
			positionY: 7,
			positionZ: 15,
			targetX: -4.5,
			targetY: -4,
			targetZ: -7,
		},
		weapons: [
			{
				id: "weapon-missile-1",
				position: [-2.1, 0.9, -6.5] as Vector3,
				rotation: degToRad(80),
				scale: 0.3,
			},
			{
				id: "weapon-missile-2",
				position: [6, 0.9, -6] as Vector3,
				rotation: degToRad(90),
				scale: 0.3,
			},
		],
		wave: {
			position: [0, 0.005, 4.5] as Vector3,
			size: [4.2, 10, 10, 10] as WaveSize,
		},
	},
];
