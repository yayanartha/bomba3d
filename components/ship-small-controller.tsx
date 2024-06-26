import {
	CapsuleCollider,
	type RapierRigidBody,
	RigidBody,
	vec3,
} from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShipSmall } from "./ship-small";
import { CharacterSkeleton, type PirateAnimation } from "@/character-skeleton";
import {
	Billboard,
	CameraControls,
	Float,
	GradientTexture,
	MeshDistortMaterial,
	Text,
	useKeyboardControls,
} from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import {
	type Joystick,
	type PlayerState as State,
	isHost,
	usePlayerState,
} from "playroomkit";
import {
	PlayerState,
	type WeaponUserData,
	useGameEngine,
	GameState,
} from "@/hooks/use-game-engine";
import { useFrame } from "@react-three/fiber";
import { Controls } from "@/app/page";

const MOVEMENT_SPEED = 4.2;
const FIRE_RATE = 300;
const MOVE_COST = 5;
const FIRE_COST = 20;
const pirateVelocity = new THREE.Vector3(0, -1, -5);

interface Props {
	state: State;
	control: Joystick;
	isPlayer: boolean;
}

export const ShipSmallController = ({ state, control, isPlayer }: Props) => {
	const rb = useRef<RapierRigidBody>(null);
	const ship = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const character = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const moving = useRef(false);
	const firing = useRef(false);
	const hit = useRef(false);
	const cameraLookAt = useRef<THREE.Vector3>();
	const cameraControlRef = useRef<CameraControls>(null);
	const lastFire = useRef<number>(0);

	const [health, setHealth] = usePlayerState(state, PlayerState.Health, 100);
	const [stamina, setStamina] = usePlayerState(state, PlayerState.Stamina, 100);
	const { gameState, onFireMine } = useGameEngine();
	const [, get] = useKeyboardControls();
	const [animation, setAnimation] = useState<PirateAnimation>("Idle");

	useFrame((_, delta) => {
		if (!isPlayer) {
			return;
		}

		// Camera follow
		if (cameraControlRef.current) {
			if (gameState === GameState.Lobby) {
				const cameraDistanceY = window.innerWidth < 1024 ? 10 : 14;
				const cameraDistanceZ = window.innerWidth < 1024 ? -10 : -14;
				const playerWorldPos = vec3(rb.current?.translation());
				cameraControlRef.current.setLookAt(
					playerWorldPos.x - 5,
					playerWorldPos.y + cameraDistanceY,
					playerWorldPos.z + cameraDistanceZ,
					playerWorldPos.x,
					playerWorldPos.y,
					playerWorldPos.z,
					true,
				);
			} else if (gameState === GameState.Game) {
				const cameraDistanceY = window.innerWidth < 1024 ? 8 : 20;
				const cameraDistanceZ = window.innerWidth < 1024 ? 25 : 34;
				const playerWorldPos = vec3(rb.current?.translation());
				cameraControlRef.current.setLookAt(
					playerWorldPos.x,
					playerWorldPos.y + cameraDistanceY,
					playerWorldPos.z + cameraDistanceZ,
					playerWorldPos.x,
					playerWorldPos.y - 3,
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

		// Firing a mine
		if (control.isPressed("fire")) {
			if (!isHost()) {
				return;
			}
			const position = rb.current?.translation();

			if (!firing.current && stamina >= FIRE_COST && position) {
				setAnimation("Sword");
				firing.current = true;
				onFireMine({
					id: `${state.id}-${new Date()}`,
					position: vec3({ x: 5, y: 1, z: position.z }),
					playerId: state.id,
				});
				setStamina(stamina - FIRE_COST, true);
				setTimeout(() => {
					firing.current = false;
				}, FIRE_RATE);
			} else {
				console.log("BRO", stamina);
				setAnimation("Wave");
			}
		}

		// if (isHost()) {
		// 	piratePlayer?.state.setState(
		// 		PlayerState.Position,
		// 		rb.current?.translation(),
		// 	);
		// } else {
		// 	const pos = piratePlayer?.state.getState(PlayerState.Position);
		// 	if (pos) {
		// 		rb.current?.setTranslation(pos, true);
		// 	}
		// }
	});

	useEffect(() => {
		rb.current?.setTranslation({ x: 0, y: -1, z: -40 }, true);
	}, []);

	// useFrame(({ camera }) => {
	// 	// if (gameState !== GameState.Game) {
	// 	// 	return;
	// 	// }

	// 	if (!isPlayer) {
	// 		// const position = piratePlayer?.state.getState(PlayerState.Position);
	// 		// if (position) {
	// 		// 	rb.current?.setTranslation(position, true);
	// 		// }
	// 		const animation = piratePlayer?.state.getState(PlayerState.Animation);
	// 		setAnimation(animation || "Idle");
	// 		return;
	// 	}

	// 	// Movement
	// 	const joystickX = piratePlayer?.joystick.dpad().x;

	// 	if (!piratePlayer?.joystick.isJoystickPressed()) {
	// 		moving.current = false;
	// 	}
	// 	if (
	// 		get()[Controls.left] ||
	// 		(piratePlayer?.joystick.isJoystickPressed() && joystickX === "left")
	// 	) {
	// 		pirateVelocity.x -= MOVEMENT_SPEED;
	// 		moving.current = true;
	// 	}
	// 	if (
	// 		get()[Controls.right] ||
	// 		(piratePlayer?.joystick.isJoystickPressed() && joystickX === "right")
	// 	) {
	// 		pirateVelocity.x += MOVEMENT_SPEED;
	// 		moving.current = true;
	// 	}

	// 	rb.current?.setLinvel(pirateVelocity, true);
	// 	piratePlayer?.state.setState(
	// 		PlayerState.Position,
	// 		rb.current?.translation(),
	// 	);

	// 	// Camera
	// 	const rbPosition = vec3(rb.current?.translation());
	// 	if (!cameraLookAt.current) {
	// 		cameraLookAt.current = rbPosition;
	// 	}
	// 	cameraLookAt.current.lerp(rbPosition, 0.05);
	// 	camera.lookAt(cameraLookAt.current);

	// 	// Animation
	// 	if (moving.current) {
	// 		setAnimation("Punch");
	// 		piratePlayer?.state.setState(PlayerState.Animation, "Punch");
	// 	} else if (firing.current) {
	// 		setAnimation("Sword");
	// 		piratePlayer?.state.setState(PlayerState.Animation, "Sword");
	// 	} else if (hit.current) {
	// 		setAnimation("HitReact");
	// 		piratePlayer?.state.setState(PlayerState.Animation, "HitReact");
	// 	} else if (piratePlayer?.state.getState(PlayerState.Health) === 0) {
	// 		setAnimation("Death");
	// 		piratePlayer.state.setState(PlayerState.Animation, "Death");
	// 		piratePlayer.state.setState(PlayerState.Winner, false);
	// 		piratePlayer?.state.setState(PlayerState.Winner, true);
	// 	} else if (piratePlayer?.state.getState(PlayerState.Winner)) {
	// 		setAnimation("Wave");
	// 		piratePlayer.state.setState(PlayerState.Animation, "Wave");
	// 	} else {
	// 		setAnimation("Idle");
	// 		piratePlayer?.state.setState(PlayerState.Animation, "Idle");
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
					const weapon = other.rigidBody?.userData as WeaponUserData;
					if (isHost() && weapon.type === "missile" && health > 0) {
						const newHealth = health - weapon.damage;
						if (newHealth <= 0) {
							setHealth(0, true);
							state.setState(PlayerState.Dead, true, true);
							rb.current?.setEnabled(false);
						} else {
							setHealth(newHealth, true);
						}
					}
				}}
			>
				<Float speed={5} rotationIntensity={0.2} floatingRange={[0, 0.3]}>
					<group ref={ship}>
						<ShipSmall />
					</group>
					<group ref={character}>
						<CharacterSkeleton position={[0, 1, 1.8]} animation={animation} />
					</group>
					<CapsuleCollider args={[1, 2]} position={[0, 3.5, 0.8]} />

					{gameState === GameState.Game && (
						<Billboard position={[0, 3, -2]}>
							<Text
								fontSize={0.42}
								font="fonts/Gilroy-ExtraBold.ttf"
								textAlign="center"
							>
								{state.getProfile().name}
								<meshStandardMaterial color="red" />
							</Text>
							<group position-y={-0.5}>
								<mesh position-z={-0.1}>
									<planeGeometry args={[2, 0.2]} />
									<meshBasicMaterial color="black" />
								</mesh>
								<mesh
									scale-x={stamina / 100}
									position-x={-1 * (1 - stamina / 100)}
								>
									<planeGeometry args={[2, 0.2]} />
									<meshBasicMaterial color="green" />
								</mesh>
							</group>
						</Billboard>
					)}
				</Float>
				<mesh position={[0, 0.78, 3]} rotation-x={degToRad(-90)}>
					<planeGeometry args={[2.3, 5, 10, 10]} />
					<MeshDistortMaterial speed={3} radius={1}>
						<GradientTexture stops={[0, 1]} colors={["#FFF", "#70E6FD"]} />
					</MeshDistortMaterial>
				</mesh>
			</RigidBody>
		</>
	);
};
