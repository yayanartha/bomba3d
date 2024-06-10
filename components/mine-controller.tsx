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
import { useFrame } from "@react-three/fiber";

const SPEED = 1;

export const MineController = (props: JSX.IntrinsicElements["group"]) => {
	const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const rb = useRef<RapierRigidBody>(null);
	const mine = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

	// useEffect(() => {
	// 	rb.current?.setLinvel({ x: 0, y: 0, z: 10 }, true);
	// }, []);

	return (
		<group {...props} ref={group}>
			<RigidBody colliders={false} ref={rb} lockRotations>
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
