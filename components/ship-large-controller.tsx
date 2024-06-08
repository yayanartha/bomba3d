import { CapsuleCollider, ConeCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";
import { ShipLarge } from "./ship-large";

export const ShipLargeController = (props: JSX.IntrinsicElements["group"]) => {
	const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const ship = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

	return (
		<group {...props} ref={group}>
			<RigidBody colliders={false}>
				<group ref={ship}>
					<ShipLarge />
				</group>
				<CapsuleCollider args={[1, 4]} position={[0, 5, -4]} />
			</RigidBody>
		</group>
	);
};
