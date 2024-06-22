import {
	CapsuleCollider,
	type RapierRigidBody,
	RigidBody,
	vec3,
} from "@react-three/rapier";
import { useEffect, useRef } from "react";
import type * as THREE from "three";
import { Float, GradientTexture, MeshDistortMaterial } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { Mine } from "./mine";
import { useGameEngine } from "@/hooks/use-game-engine";
import { isHost } from "playroomkit";

const SPEED = 1;
const DAMAGE = 20;

interface Props {
	position: THREE.Vector3;
	onHit(position: THREE.Vector3): void;
}

export const MineController = ({ position, onHit }: Props) => {
	const { piratePlayer } = useGameEngine();
	const rb = useRef<RapierRigidBody>(null);
	const mine = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

	useEffect(() => {
		rb.current?.setLinvel({ x: 0, y: 1, z: SPEED }, true);
	}, []);

	return (
		<group position={[position.x, position.y, position.z]}>
			<RigidBody
				colliders={false}
				ref={rb}
				lockRotations
				// sensor
				userData={{
					type: "mine",
					player: piratePlayer,
					damage: DAMAGE,
				}}
				onIntersectionEnter={({ other }) => {
					if (isHost()) {
						rb.current?.setEnabled(false);
						onHit(vec3(rb.current?.translation()));
					}
				}}
			>
				<group ref={mine}>
					<Float speed={5} rotationIntensity={0.2} floatingRange={[-1.3, -1]}>
						<Mine scale={10} />
					</Float>
				</group>
				<CapsuleCollider args={[0.5, 0.5]} position={[0, 0, 0]} />
				<mesh position={[0, -0.99, -1.2]} rotation-x={degToRad(-90)}>
					<planeGeometry args={[1, 2, 10, 10]} />
					<MeshDistortMaterial speed={3} radius={1}>
						<GradientTexture stops={[0, 1]} colors={["#70E6FD", "#FFF"]} />
					</MeshDistortMaterial>
				</mesh>
			</RigidBody>
		</group>
	);
};
