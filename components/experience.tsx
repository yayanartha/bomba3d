import {
	Gltf,
	Sky,
	CameraControls,
	Float,
	Stage,
	MeshReflectorMaterial,
	Environment,
	Cloud,
	CurveModifier,
	CurveModifierRef,
	Trail,
	Box,
	Plane,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { LegacyRef, Suspense, useMemo, useRef } from "react";
import { ShipLight } from "./ship-light";
import * as THREE from "three";
import { Board } from "./board";
import { ShipPirate } from "./ship-pirate";
import { Mine } from "./mine";
import { Missile } from "./missile";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { ShipSmall } from "./ship-small";
import { ShipLarge } from "./ship-large";
import { ShipLargeController } from "./ship-large-controller";
import { ShipSmallController } from "./ship-small-controller";

export const Experience = () => {
	return (
		<>
			<directionalLight
				position={[25, 18, -25]}
				intensity={0.3}
				castShadow
				shadow-camera-near={0}
				shadow-camera-far={80}
				shadow-camera-left={-30}
				shadow-camera-right={30}
				shadow-camera-top={25}
				shadow-camera-bottom={-25}
				shadow-mapSize-width={4096}
				shadow-bias={-0.01}
			/>

			<CameraManager />

			<Environment preset="sunset" />

			<RigidBody type="fixed" colliders="cuboid" position-y={-1} name="ocean">
				<Board />
			</RigidBody>

			{/* <Mine position-x={-4} position-z={12} scale={10} /> */}
			{/* <Mine position-z={12} scale={10} /> */}
			{/* <Mine position-x={4} position-z={12} scale={10} /> */}

			{/* <Missile position-x={-4} position-z={-15} scale={0.3} /> */}
			{/* <Missile position-z={-15} scale={0.3} /> */}
			{/* <Missile position-x={4} position-z={-15} scale={0.3} /> */}

			{/* <ShipPirate position-x={-4} position-y={-0.5} position-z={-5} /> */}
			{/* <ShipPirate position-y={-0.5} position-z={-5} /> */}
			{/* <ShipPirate position-x={4} position-y={-0.5} position-z={-5} /> */}

			{/* <ShipLight position-x={-4} position-y={-1} position-z={5} /> */}
			{/* <ShipLight position-y={-1} position-z={5} /> */}
			{/* <ShipLight position-x={4} position-y={-1} position-z={5} /> */}

			{/* <ShipSmall position-z={-5} /> */}

			{/* <ShipLarge position-z={10} /> */}

			<ShipSmallController position-z={-5} />
			<ShipLargeController position-z={10} />

			{/* <RigidBody type="fixed" colliders="cuboid" position-y={0} name="ocean"> */}
			{/* <CuboidCollider args={[20, 3, 20]} /> */}
			{/* <Plane args={[170, 170]}/> */}
			{/* </RigidBody> */}
		</>
	);
};

const CameraManager = () => {
	const cameraRef = useRef<CameraControls>(null);

	return <CameraControls ref={cameraRef} />;
};
