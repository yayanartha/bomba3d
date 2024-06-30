import {
	Clone,
	Float,
	GradientTexture,
	MeshDistortMaterial,
	Outlines,
	useGLTF,
} from "@react-three/drei";
import type { GroupProps, Vector3 } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import { CharacterSkeleton } from "./character-skeleton";
import { CharacterCaptain } from "./character-captain";

export type WaveSize = [
	width?: number | undefined,
	height?: number | undefined,
	widthSegments?: number | undefined,
	heightSegments?: number | undefined,
];

type Props = {
	model: {
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
	playerName?: string;
	renderWeapon?: boolean;
} & GroupProps;

export const Ship = ({ model, playerName, renderWeapon, ...props }: Props) => {
	const ship = useGLTF(`/models/ships/${model.role}.gltf`);
	const weapon = useGLTF(`/models/weapons/${model.role}.glb`);

	return (
		<group {...props}>
			<Float speed={5} rotationIntensity={0.2} floatingRange={[0, 0.3]}>
				<Clone
					key={model.role}
					object={ship.scene}
					rotation-y={model.rotationY}
					castShadow
					receiveShadow
					position={model.position}
					inject={<Outlines thickness={0.015} color="black" />}
				/>

				{model.character === "skeleton" ? (
					<CharacterSkeleton
						playerName={playerName}
						position={model.characterPosition}
						rotation-y={model.characterRotation}
						animation="Wave"
						receiveShadow
					/>
				) : (
					<CharacterCaptain
						playerName={playerName}
						position={model.characterPosition}
						rotation-y={model.characterRotation}
						animation="Walk"
						receiveShadow
					/>
				)}
			</Float>

			{renderWeapon &&
				model.weapons.map((w) => (
					<group key={w.id} position={w.position} rotation-y={w.rotation}>
						<Float speed={5} rotationIntensity={0.2} floatingRange={[-1.1, -1]}>
							<Clone
								object={weapon.scene}
								castShadow
								receiveShadow
								scale={w.scale}
							/>
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
	);
};

useGLTF.preload("/models/ships/pirate.gltf");
useGLTF.preload("/models/ships/marine.gltf");
useGLTF.preload("/models/weapons/pirate.glb");
useGLTF.preload("/models/weapons/marine.glb");
