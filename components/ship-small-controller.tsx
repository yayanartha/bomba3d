import {
	CapsuleCollider,
	type RapierRigidBody,
	RigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import type * as THREE from "three";
import { ShipSmall } from "./ship-small";
import { CharacterSkeleton } from "@/character-skeleton";
import { Float, GradientTexture, MeshDistortMaterial } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

export const ShipSmallController = (props: JSX.IntrinsicElements["group"]) => {
	const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const rb = useRef<RapierRigidBody>(null);
	const ship = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const character = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

	return (
		<group {...props} ref={group}>
			<Float speed={5} rotationIntensity={0.2} floatingRange={[0, 0.3]}>
				<RigidBody colliders={false} ref={rb} lockRotations>
					<group ref={ship}>
						<ShipSmall />
					</group>
					<group ref={character}>
						<CharacterSkeleton position={[0, 1, 1.8]} animation="Idle" />
					</group>
					<CapsuleCollider args={[1, 2]} position={[0, 3.5, 0.8]} />
				</RigidBody>
			</Float>

			<mesh position={[0, -0.99, 3]} rotation-x={degToRad(-90)}>
				<planeGeometry args={[3, 5, 10, 10]} />
				<MeshDistortMaterial speed={3} radius={1}>
					<GradientTexture stops={[0, 1]} colors={["#FFF", "#70E6FD"]} />
				</MeshDistortMaterial>
			</mesh>
		</group>
	);
};
