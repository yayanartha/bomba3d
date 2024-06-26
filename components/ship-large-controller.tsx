import {
	CapsuleCollider,
	type RapierRigidBody,
	RigidBody,
	vec3,
} from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ShipLarge } from "./ship-large";
import { CharacterCaptain, type MarineAnimation } from "./character-captain";
import {
	CameraControls,
	Float,
	GradientTexture,
	MeshDistortMaterial,
	useKeyboardControls,
} from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { type Joystick, type PlayerState as State, isHost } from "playroomkit";
import {
	PlayerState,
	type WeaponUserData,
	useGameEngine,
	GameState,
} from "@/hooks/use-game-engine";
import { useFrame } from "@react-three/fiber";
import { Controls } from "@/app/page";

const MOVEMENT_SPEED = 3;
const FIRE_RATE = 400;
const MOVE_COST = 10;
const FIRE_COST = 30;
const marineVelocity = new THREE.Vector3(0, -1, 5);

interface Props {
	state: State;
	control: Joystick;
	isPlayer: boolean;
}

export const ShipLargeController = ({ state, control, isPlayer }: Props) => {
	const rb = useRef<RapierRigidBody>(null);
	const ship = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const character = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const moving = useRef(false);
	const firing = useRef(false);
	const hit = useRef(false);
	const cameraLookAt = useRef<THREE.Vector3>();
	const cameraControlRef = useRef<CameraControls>(null);
	const lastFire = useRef<number>(0);

	const { gameState, onFireMissile } = useGameEngine();
	const [, get] = useKeyboardControls();
	const [animation, setAnimation] = useState<MarineAnimation>("Idle");

	useFrame((_, delta) => {
		if (!isPlayer) {
			return;
		}

		// Camera follow
		if (cameraControlRef.current) {
			if (gameState === GameState.Lobby) {
				const cameraDistanceY = window.innerWidth < 1024 ? 16 : 20;
				const cameraDistanceZ = window.innerWidth < 1024 ? 50 : 54;
				const playerWorldPos = vec3(ship.current?.position);
				cameraControlRef.current.setLookAt(
					playerWorldPos.x,
					playerWorldPos.y + cameraDistanceY,
					playerWorldPos.z + cameraDistanceZ,
					playerWorldPos.x,
					playerWorldPos.y,
					playerWorldPos.z,
					true,
				);
			} else if (gameState === GameState.Game) {
				const cameraDistanceY = window.innerWidth < 1024 ? 20 : 24;
				const cameraDistanceZ = window.innerWidth < 1024 ? 40 : 44;
				const playerWorldPos = vec3(ship.current?.position);
				cameraControlRef.current.setLookAt(
					playerWorldPos.x,
					playerWorldPos.y + cameraDistanceY,
					playerWorldPos.z + cameraDistanceZ,
					playerWorldPos.x,
					playerWorldPos.y - 8,
					playerWorldPos.z,
					true,
				);
			}
		}

		if (state.getState(PlayerState.Dead)) {
			setAnimation("Death");
			return;
		}

		// Update position based on joystick
		if (control.isJoystickPressed()) {
			setAnimation("Punch");
			rb.current?.applyImpulse({ x: MOVEMENT_SPEED * delta, y: 0, z: 0 }, true);
		} else {
			setAnimation("Idle");
		}

		// Firing a missile
		if (control.isPressed("fire")) {
			setAnimation("Sword");

			if (isHost()) {
				if (Date.now() - lastFire.current > FIRE_RATE) {
					lastFire.current = Date.now();
					onFireMissile({
						id: `${state.id}-${new Date().getTime()}`,
						position: vec3(rb.current?.translation()),
						playerId: state.id,
					});
				}
			}
		}

		// if (isHost()) {
		// 	marinePlayer?.state.setState(
		// 		PlayerState.Position,
		// 		rb.current?.translation(),
		// 	);
		// } else {
		// 	const pos = marinePlayer?.state.getState(PlayerState.Position);
		// 	if (pos) {
		// 		rb.current?.setTranslation(pos, true);
		// 	}
		// }
	});

	useEffect(() => {
		rb.current?.setTranslation({ x: 0, y: -1, z: 20 }, true);
	}, []);

	// useFrame(({ camera }) => {
	// 	// if (gameState !== GameState.Game) {
	// 	// 	return;
	// 	// }

	// 	if (!isPlayer) {
	// 		// const position = marinePlayer?.state.getState(PlayerState.Position);
	// 		// if (position) {
	// 		// 	rb.current?.setTranslation(position, true);
	// 		// }
	// 		const animation = marinePlayer?.state.getState(PlayerState.Animation);
	// 		setAnimation(animation || "Idle");
	// 		return;
	// 	}

	// 	// Movement
	// 	const joystickX = marinePlayer?.joystick.dpad().x;

	// 	if (!marinePlayer?.joystick.isJoystickPressed()) {
	// 		moving.current = false;
	// 	}
	// 	if (
	// 		get()[Controls.left] ||
	// 		(marinePlayer?.joystick.isJoystickPressed() && joystickX === "left")
	// 	) {
	// 		marineVelocity.x -= MOVEMENT_SPEED;
	// 		moving.current = true;
	// 	}
	// 	if (
	// 		get()[Controls.right] ||
	// 		(marinePlayer?.joystick.isJoystickPressed() && joystickX === "right")
	// 	) {
	// 		marineVelocity.x += MOVEMENT_SPEED;
	// 		moving.current = true;
	// 	}

	// 	rb.current?.setLinvel(marineVelocity, true);
	// 	marinePlayer?.state.setState(
	// 		PlayerState.Position,
	// 		rb.current?.translation(),
	// 	);

	// 	// Camera
	// 	// const rbPosition = vec3(rb.current?.translation());
	// 	// if (!cameraLookAt.current) {
	// 	// 	cameraLookAt.current = rbPosition;
	// 	// }
	// 	// cameraLookAt.current.lerp(rbPosition, 0.05);
	// 	// camera.lookAt(cameraLookAt.current);

	// 	// Animation
	// 	if (moving.current) {
	// 		setAnimation("Punch");
	// 		marinePlayer?.state.setState(PlayerState.Animation, "Punch");
	// 	} else if (firing.current) {
	// 		setAnimation("Sword");
	// 		marinePlayer?.state.setState(PlayerState.Animation, "Sword");
	// 	} else if (hit.current) {
	// 		setAnimation("HitReact");
	// 		marinePlayer?.state.setState(PlayerState.Animation, "HitReact");
	// 	} else if (marinePlayer?.state.getState(PlayerState.Health) === 0) {
	// 		setAnimation("Death");
	// 		marinePlayer.state.setState(PlayerState.Animation, "Death");
	// 		marinePlayer.state.setState(PlayerState.Winner, false);
	// 		marinePlayer?.state.setState(PlayerState.Winner, true);
	// 	} else if (marinePlayer?.state.getState(PlayerState.Winner)) {
	// 		setAnimation("Wave");
	// 		marinePlayer.state.setState(PlayerState.Animation, "Wave");
	// 	} else {
	// 		setAnimation("Idle");
	// 		marinePlayer?.state.setState(PlayerState.Animation, "Idle");
	// 	}
	// });

	return (
		<>
			{isPlayer && <CameraControls ref={cameraControlRef} />}

			<RigidBody
				colliders={false}
				lockRotations
				ref={rb}
				type={isHost() ? "dynamic" : "kinematicPosition"}
				name={isPlayer ? "player" : "other"}
				onIntersectionEnter={({ other }) => {
					const currHealth = state.getState(PlayerState.Health);
					const weapon = other.rigidBody?.userData as WeaponUserData;
					if (isHost() && weapon.type === "mine" && currHealth > 0) {
						const newHealth = currHealth - weapon.damage;

						if (newHealth <= 0) {
							state.setState(PlayerState.Health, 0);
							state.setState(PlayerState.Dead, true);
							rb.current?.setEnabled(false);
						} else {
							state.setState(PlayerState.Health, newHealth);
						}
					}
				}}
			>
				<Float speed={5} rotationIntensity={0.2} floatingRange={[0, 0.3]}>
					<group ref={ship}>
						<ShipLarge />
					</group>
					<group ref={character}>
						<CharacterCaptain position={[0, 2, 4.5]} animation={animation} />
					</group>
					<CapsuleCollider args={[1, 4]} position={[0, 5, -4]} />
				</Float>
				<mesh position={[0, 0.9, 5]} rotation-x={degToRad(-90)}>
					<planeGeometry args={[4.2, 10, 10, 10]} />
					<MeshDistortMaterial speed={3} radius={1}>
						<GradientTexture stops={[0, 1]} colors={["#FFF", "#70E6FD"]} />
					</MeshDistortMaterial>
				</mesh>
			</RigidBody>
		</>
	);
};
