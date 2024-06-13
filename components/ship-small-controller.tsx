import {
	CapsuleCollider,
	type RapierRigidBody,
	RigidBody,
	vec3,
} from "@react-three/rapier";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ShipSmall } from "./ship-small";
import { CharacterSkeleton, type PirateAnimation } from "@/character-skeleton";
import {
	Float,
	GradientTexture,
	MeshDistortMaterial,
	useKeyboardControls,
} from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { myPlayer, type Joystick } from "playroomkit";
import { GameState, PlayerState, useGameEngine } from "@/hooks/use-game-engine";
import { useFrame } from "@react-three/fiber";
import { Controls } from "@/app/page";

const MOVEMENT_SPEED = 4.2;
const STAMINA_COST = 20;
const pirateVelocity = new THREE.Vector3();

export const ShipSmallController = (props: JSX.IntrinsicElements["group"]) => {
	const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const rb = useRef<RapierRigidBody>(null);
	const ship = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const character = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const moving = useRef(false);
	const firing = useRef(false);
	const hit = useRef(false);
	const cameraLookAt = useRef<THREE.Vector3>();

	const { gameState, piratePlayer, marinePlayer } = useGameEngine();
	const [, get] = useKeyboardControls();

	const [animation, setAnimation] = useState<PirateAnimation>("Idle");

	const isPlayer = useMemo(
		() => myPlayer()?.id === piratePlayer?.state.id,
		[piratePlayer],
	);

	useFrame(({ camera }) => {
		// if (gameState !== GameState.Game) {
		// 	return;
		// }

		if (!isPlayer) {
			const position = piratePlayer?.state.getState(PlayerState.Position);
			if (position) {
				rb.current?.setTranslation(position, true);
			}
			const animation = piratePlayer?.state.getState(PlayerState.Animation);
			setAnimation(animation || "Idle");
			return;
		}

		// Movement
		pirateVelocity.x = 0;
		pirateVelocity.y = -1;
		pirateVelocity.z = 0;
		const joystickX = piratePlayer?.joystick.dpad().x;

		if (!piratePlayer?.joystick.isJoystickPressed()) {
			moving.current = false;
		}
		if (
			get()[Controls.left] ||
			(piratePlayer?.joystick.isJoystickPressed() && joystickX === "left")
		) {
			pirateVelocity.x -= MOVEMENT_SPEED;
			moving.current = true;
		}
		if (
			get()[Controls.right] ||
			(piratePlayer?.joystick.isJoystickPressed() && joystickX === "right")
		) {
			pirateVelocity.x += MOVEMENT_SPEED;
			moving.current = true;
		}

		rb.current?.setLinvel(pirateVelocity, true);
		piratePlayer?.state.setState(
			PlayerState.Position,
			rb.current?.translation(),
		);

		// Camera
		const rbPosition = vec3(rb.current?.translation());
		if (!cameraLookAt.current) {
			cameraLookAt.current = rbPosition;
		}
		cameraLookAt.current.lerp(rbPosition, 0.05);
		camera.lookAt(cameraLookAt.current);

		// Animation
		if (moving.current) {
			setAnimation("Punch");
			piratePlayer?.state.setState(PlayerState.Animation, "Punch");
		} else if (firing.current) {
			setAnimation("Sword");
			piratePlayer?.state.setState(PlayerState.Animation, "Sword");
		} else if (hit.current) {
			setAnimation("HitReact");
			piratePlayer?.state.setState(PlayerState.Animation, "HitReact");
		} else if (piratePlayer?.state.getState(PlayerState.Health) === 0) {
			setAnimation("Death");
			piratePlayer.state.setState(PlayerState.Animation, "Death");
			piratePlayer.state.setState(PlayerState.Winner, false);
			marinePlayer?.state.setState(PlayerState.Winner, true);
		} else if (piratePlayer?.state.getState(PlayerState.Winner)) {
			setAnimation("Wave");
			piratePlayer.state.setState(PlayerState.Animation, "Wave");
		} else {
			setAnimation("Idle");
			piratePlayer?.state.setState(PlayerState.Animation, "Idle");
		}
	});

	return (
		<group {...props} ref={group}>
			<RigidBody
				colliders={false}
				lockRotations
				ref={rb}
				name={isPlayer ? "player" : "other"}
			>
				<Float speed={5} rotationIntensity={0.2} floatingRange={[0, 0.3]}>
					<group ref={ship}>
						<ShipSmall />
					</group>
					<group ref={character}>
						<CharacterSkeleton position={[0, 1, 1.8]} animation={animation} />
					</group>
					<CapsuleCollider args={[1, 2]} position={[0, 3.5, 0.8]} />
				</Float>
				<mesh position={[0, 0.509, 3]} rotation-x={degToRad(-90)}>
					<planeGeometry args={[3, 5, 10, 10]} />
					<MeshDistortMaterial speed={3} radius={1}>
						<GradientTexture stops={[0, 1]} colors={["#FFF", "#70E6FD"]} />
					</MeshDistortMaterial>
				</mesh>
			</RigidBody>
		</group>
	);
};
