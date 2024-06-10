import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import type * as THREE from "three";
import { ShipLarge } from "./ship-large";
import { CharacterCaptain } from "./character-captain";
import { Float, GradientTexture, MeshDistortMaterial } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

export const ShipLargeController = (props: JSX.IntrinsicElements["group"]) => {
	const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const ship = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const character = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

	return (
		<group {...props} ref={group}>
			<Float speed={5} rotationIntensity={0.2} floatingRange={[0, 0.3]}>
				<RigidBody colliders={false} lockRotations>
					<group ref={ship}>
						<ShipLarge />
					</group>
					<group ref={character}>
						<CharacterCaptain position={[0, 2, 4.5]} animation="Idle" />
					</group>
					<CapsuleCollider args={[1, 4]} position={[0, 5, -4]} />
				</RigidBody>
			</Float>

			<mesh position={[0, -0.99, 5]} rotation-x={degToRad(-90)}>
				<planeGeometry args={[4.2, 5, 10, 10]} />
				<MeshDistortMaterial speed={3} radius={1}>
					<GradientTexture
						stops={[0, 0.6, 1]}
						colors={["#FFF", "#FFF", "#70E6FD"]}
					/>
				</MeshDistortMaterial>
			</mesh>
		</group>
	);
};
