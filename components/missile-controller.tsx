import {
	CapsuleCollider,
	type RapierRigidBody,
	RigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import type * as THREE from "three";
import { Float, GradientTexture, MeshDistortMaterial } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { Missile } from "./missile";

export const MissileController = (props: JSX.IntrinsicElements["group"]) => {
	const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const rb = useRef<RapierRigidBody>(null);
	const missile = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

	return (
		<group {...props} ref={group}>
			<RigidBody colliders={false} ref={rb} lockRotations>
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
