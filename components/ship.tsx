import { Role } from "@/hooks/use-game-engine";
import {
	AccumulativeShadows,
	CameraControls,
	Clone,
	Float,
	GradientTexture,
	MeshDistortMaterial,
	Outlines,
	PerspectiveCamera,
	PresentationControls,
	RandomizedLight,
	Shadow,
	SoftShadows,
	useGLTF,
} from "@react-three/drei";
import type { Vector3 } from "@react-three/fiber";
import { degToRad, randInt } from "three/src/math/MathUtils.js";
import { CharacterSkeleton } from "@/character-skeleton";
import { useEffect, useRef } from "react";
import { Mine } from "./mine";

export const Ships = [
	{
		role: Role.Pirate,
		rotationY: degToRad(-90),
		character: "skeleton",
		characterPosition: [0, 0.4, 0] as Vector3,
		characterRotation: degToRad(0),
	},
	{
		role: Role.Marine,
		character: "captain",
		rotationY: degToRad(180),
		characterPosition: [0, 2, 4.5] as Vector3,
		characterRotation: degToRad(0),
	},
];

interface Props {
	model?: {
		role: string;
		rotationY: number;
		character: string;
		characterPosition: Vector3;
		characterRotation: number;
	};
}

export const Ship = ({ model = Ships[0] }: Props) => {
	const ship = useGLTF(`/models/ships/${model.role}.gltf`);
	const controls = useRef<CameraControls>(null);

	useEffect(() => {
		controls.current?.setLookAt(0, 5, 10, 0, 0, 0, true);
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
						object={ship.scene}
						rotation-y={model.rotationY}
						receiveShadow
						position={[0, -0.5, 0]}
						inject={<Outlines thickness={0.015} color="black" />}
					/>

					{model.character === "skeleton" && (
						<CharacterSkeleton
							position={model.characterPosition}
							rotation-y={model.characterRotation}
							animation="Wave"
							receiveShadow
						/>
					)}
				</Float>

				<group position={[-2, 1, -1]}>
					<Float speed={5} rotationIntensity={0.2} floatingRange={[-1.1, -1]}>
						<Mine scale={5} />
					</Float>
				</group>

				<group position={[-1.5, 1, -2.7]}>
					<Float speed={5} rotationIntensity={0.2} floatingRange={[-1.1, -1]}>
						<Mine scale={7} />
					</Float>
				</group>

				<group position={[3, 1, 1]}>
					<Float speed={5} rotationIntensity={0.2} floatingRange={[-1.1, -1]}>
						<Mine scale={4} />
					</Float>
				</group>

				<mesh position={[0, 0.005, 4.5]} rotation-x={degToRad(-90)}>
					<planeGeometry args={[2, 5, 10, 10]} />
					<MeshDistortMaterial speed={3} radius={1}>
						<GradientTexture stops={[0, 1]} colors={["#FFF", "#70E6FD"]} />
					</MeshDistortMaterial>
				</mesh>

				<mesh position={[-4.3, 0.005, 1]} rotation-x={degToRad(-90)}>
					<planeGeometry args={[3, 15, 10, 10]} />
					<MeshDistortMaterial speed={3} radius={1}>
						<GradientTexture stops={[0, 1]} colors={["teal", "white"]} />
					</MeshDistortMaterial>
				</mesh>
			</group>
		</>
	);
};

useGLTF.preload("/models/ships/pirate.gltf");
useGLTF.preload("/models/ships/marine.gltf");
