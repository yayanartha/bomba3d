import { Role } from "@/hooks/use-game-engine";
import {
	CameraControls,
	Clone,
	Float,
	GradientTexture,
	MeshDistortMaterial,
	Outlines,
	useGLTF,
} from "@react-three/drei";
import type { Vector3 } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import { CharacterSkeleton } from "@/character-skeleton";
import { useEffect, useRef } from "react";
import { Mine } from "./mine";
import { CharacterCaptain } from "./character-captain";

export const Ships = [
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

type WaveSize = [
	width?: number | undefined,
	height?: number | undefined,
	widthSegments?: number | undefined,
	heightSegments?: number | undefined,
];

interface Props {
	model?: {
		role: string;
		position: Vector3;
		rotationY: number;
		character: string;
		characterPosition: Vector3;
		characterRotation: number;
		cameraLookAt: {
			positionX: number;
			positionY: number;
			positionZ: number;
			targetX: number;
			targetY: number;
			targetZ: number;
		};
		weapons: {
			id: string;
			position: Vector3;
			rotation: number;
			scale: number;
		}[];
		wave: {
			position: Vector3;
			size: WaveSize;
		};
	};
}

export const Ship = ({ model = Ships[0] }: Props) => {
	const ship = useGLTF(`/models/ships/${model.role}.gltf`);
	const weapon = useGLTF(`/models/weapons/${model.role}.glb`);
	const controls = useRef<CameraControls>(null);

	useEffect(() => {
		controls.current?.setLookAt(
			model.cameraLookAt.positionX,
			model.cameraLookAt.positionY,
			model.cameraLookAt.positionZ,
			model.cameraLookAt.targetX,
			model.cameraLookAt.targetY,
			model.cameraLookAt.targetZ,
			true,
		);
	}, [model]);

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

			<group rotation-y={degToRad(145)} position={[0, -1, 0]}>
				<Float speed={5} rotationIntensity={0.2} floatingRange={[0, 0.3]}>
					<Clone
						key={model.role}
						object={ship.scene}
						rotation-y={model.rotationY}
						receiveShadow
						position={model.position}
						inject={<Outlines thickness={0.015} color="black" />}
					/>

					{model.character === "skeleton" ? (
						<CharacterSkeleton
							position={model.characterPosition}
							rotation-y={model.characterRotation}
							animation="Wave"
							receiveShadow
						/>
					) : (
						<CharacterCaptain
							position={model.characterPosition}
							rotation-y={model.characterRotation}
							animation="Walk"
							receiveShadow
						/>
					)}
				</Float>

				{model.weapons.map((w) => (
					<group key={w.id} position={w.position} rotation-y={w.rotation}>
						<Float speed={5} rotationIntensity={0.2} floatingRange={[-1.1, -1]}>
							<Clone object={weapon.scene} receiveShadow scale={w.scale} />
						</Float>
					</group>
				))}

				<mesh position={model.wave.position} rotation-x={degToRad(-90)}>
					<planeGeometry args={model.wave.size} />
					<MeshDistortMaterial speed={3} radius={1}>
						<GradientTexture stops={[0, 1]} colors={["#FFF", "#70E6FD"]} />
					</MeshDistortMaterial>
				</mesh>
			</group>
		</>
	);
};

useGLTF.preload("/models/ships/pirate.gltf");
useGLTF.preload("/models/ships/marine.gltf");
useGLTF.preload("/models/weapons/pirate.glb");
useGLTF.preload("/models/weapons/marine.glb");
