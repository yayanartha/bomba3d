import {
	CapsuleCollider,
	type RapierRigidBody,
	RigidBody,
} from "@react-three/rapier";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ShipLarge } from "./ship-large";
import { CharacterCaptain, type MarineAnimation } from "./character-captain";
import {
	Float,
	GradientTexture,
	MeshDistortMaterial,
	useKeyboardControls,
} from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { myPlayer, type Joystick } from "playroomkit";
import { useGameEngine } from "@/hooks/use-game-engine";

const MOVEMENT_SPEED = 3;
const STAMINA_COST = 30;
const marineVel = new THREE.Vector3();

export const ShipLargeController = (props: JSX.IntrinsicElements["group"]) => {
	const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const rb = useRef<RapierRigidBody>(null);
	const ship = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const character = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const moving = useRef(false);
	const firing = useRef(false);

	const { gameState, marinePlayer } = useGameEngine();
	const [, get] = useKeyboardControls();

	const [animation, setAnimation] = useState<MarineAnimation>("Idle");

	const isPlayer = useMemo(
		() => myPlayer()?.id === marinePlayer?.state.id,
		[marinePlayer],
	);

	return (
		<group {...props} ref={group}>
			<Float speed={5} rotationIntensity={0.2} floatingRange={[0, 0.3]}>
				<RigidBody
					colliders={false}
					lockRotations
					ref={rb}
					name={isPlayer ? "player" : "other"}
				>
					<group ref={ship}>
						<ShipLarge />
					</group>
					<group ref={character}>
						<CharacterCaptain position={[0, 2, 4.5]} animation={animation} />
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
