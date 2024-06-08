import { CapsuleCollider, ConeCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";
import { ShipSmall } from "./ship-small";

export const ShipSmallController = (props: JSX.IntrinsicElements["group"]) => {
	const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const ship = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

	return (
		<group {...props} ref={group}>
			<RigidBody colliders={false}>
				<group ref={ship}>
					<ShipSmall />
				</group>
				<CapsuleCollider args={[1, 2]} position={[0, 3.5, 0.8]} />
			</RigidBody>
		</group>
	);
};
