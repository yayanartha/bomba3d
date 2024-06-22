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
import { Missile } from "./missile";
import { useGameEngine } from "@/hooks/use-game-engine";
import { isHost } from "playroomkit";

const SPEED = 2;
const DAMAGE = 30;

interface Props {
	position: THREE.Vector3;
	onHit(position: THREE.Vector3): void;
}

export const MissileController = ({ position, onHit }: Props) => {
	const { marinePlayer } = useGameEngine();
	const rb = useRef<RapierRigidBody>(null);
	const missile = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

	useEffect(() => {
		rb.current?.setLinvel({ x: 0, y: 1, z: -SPEED }, true);
	}, []);

	return (
		<group position={[position.x, position.y, position.z]}>
			<RigidBody
				colliders={false}
				ref={rb}
				lockRotations
				// sensor
				userData={{
					type: "missile",
					player: marinePlayer,
					damage: DAMAGE,
				}}
				onIntersectionEnter={({ other }) => {
					if (isHost()) {
						rb.current?.setEnabled(false);
						onHit(vec3(rb.current?.translation()));
					}
				}}
			>
				<group ref={missile}>
					<Float speed={5} rotationIntensity={0.1} floatingRange={[-1.3, -1]}>
						<Missile scale={0.3} />
					</Float>
				</group>
				<CapsuleCollider args={[0.5, 0.5]} position={[0, 0, 0.2]} />
				<mesh position={[0, -0.99, 5.5]} rotation-x={degToRad(-90)}>
					<planeGeometry args={[0.6, 4, 10, 10]} />
					<MeshDistortMaterial speed={3} radius={1}>
						<GradientTexture stops={[0, 1]} colors={["#FFF", "#70E6FD"]} />
					</MeshDistortMaterial>
				</mesh>
			</RigidBody>
		</group>
	);
};
