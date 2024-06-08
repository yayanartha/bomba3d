/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 public/models/Ship_Large.gltf --types 
*/

import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import {
	Billboard,
	Float,
	Text,
	useAnimations,
	useGLTF,
} from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { degToRad } from "three/src/math/MathUtils.js";

type GLTFResult = GLTF & {
	nodes: {
		Ship_Large: THREE.Mesh;
	};
	materials: {
		Atlas: THREE.MeshStandardMaterial;
	};
	animations: GLTFAction[];
};

type ContextType = Record<
	string,
	React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>
>;

export const ShipLarge = (props: JSX.IntrinsicElements["group"]) => {
	const { nodes, materials, animations } = useGLTF(
		"models/Ship_Large.gltf",
	) as GLTFResult;
	const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

	const { actions } = useAnimations(animations, group);

	// console.log("actions", actions);
	return (
		<group {...props} dispose={null} ref={group}>
			<Float speed={5} rotationIntensity={0.2} floatingRange={[0, 0.3]}>
				<Billboard position={[-0.5, 4, 6]}>
					<Text
						fontSize={0.42}
						font="fonts/Gilroy-ExtraBold.ttf"
						textAlign="center"
					>
						Marine
						<meshStandardMaterial color="red" />
					</Text>
				</Billboard>

				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Ship_Large.geometry}
					material={materials.Atlas}
					rotation-y={degToRad(-90)}
				/>
			</Float>
		</group>
	);
};

useGLTF.preload("models/Ship_Large.gltf");