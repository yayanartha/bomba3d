// Ocean.js
import React, { useRef } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import * as THREE from "three";

// Import the custom shader material
import { OceanMaterial } from "../shaders/ocean-shader";

extend({ OceanMaterial });

const Ocean = () => {
	const ref =
		useRef<
			THREE.Mesh<
				THREE.BufferGeometry<THREE.NormalBufferAttributes>,
				THREE.Material | THREE.Material[],
				THREE.Object3DEventMap
			>
		>(null);
	const { camera } = useThree();

	useFrame((state, delta) => {
		ref.current.material.uniforms.time.value += delta;
		ref.current.material.uniforms.cameraPosition.value = camera.position;
	});

	return (
		<Plane
			ref={ref}
			args={[20, 20, 128, 128]}
			rotation={[-Math.PI / 2, 0, 0]}
			position={[0, 0, 0]}
			receiveShadow
		>
			{/* Apply the custom shader material */}
			<oceanMaterial attach="material" />
		</Plane>
	);
};

export default Ocean;
