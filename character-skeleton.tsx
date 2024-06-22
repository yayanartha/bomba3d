/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 public/models/Characters_Skeleton.gltf --types 
*/

import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations, Outlines } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import { degToRad } from "three/src/math/MathUtils.js";

type GLTFResult = GLTF & {
	nodes: {
		Weapon_Dagger: THREE.Mesh;
		Skeleton: THREE.SkinnedMesh;
		Root: THREE.Bone;
	};
	materials: {
		Atlas: THREE.MeshStandardMaterial;
	};
	animations: GLTFAction[];
};

export type PirateAnimation =
	| "Death"
	| "Duck"
	| "HitReact"
	| "Idle"
	| "Jump"
	| "Jump_Idle"
	| "Jump_Idlea"
	| "Jump_Land"
	| "No"
	| "Punch"
	| "Run"
	| "Sword"
	| "Walk"
	| "Wave"
	| "Yes";
interface GLTFAction extends THREE.AnimationClip {
	name: PirateAnimation;
}

type Props = {
	color?: string;
	animation: PirateAnimation;
} & JSX.IntrinsicElements["group"];

export const CharacterSkeleton = ({
	color = "red",
	animation = "Idle",
	...props
}: Props) => {
	const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
	const { nodes, materials, animations } = useGLTF(
		"models/Characters_Skeleton.gltf",
	) as GLTFResult;
	const { actions } = useAnimations(animations, group);

	if (actions.Death) {
		actions.Death.loop = THREE.LoopOnce;
		actions.Death.clampWhenFinished = true;
	}

	useEffect(() => {
		actions[animation]?.reset().fadeIn(0.2).play();
		return () => {
			actions[animation]?.fadeOut(0.2);
		};
	}, [actions, animation]);

	return (
		<group ref={group} {...props} dispose={null}>
			<group name="Scene" rotation-y={degToRad(180)}>
				<group name="CharacterArmature">
					<primitive object={nodes.Root} />
					<skinnedMesh
						name="Skeleton"
						geometry={nodes.Skeleton.geometry}
						material={materials.Atlas}
						skeleton={nodes.Skeleton.skeleton}
						castShadow
						receiveShadow
					>
						<Outlines thickness={0.02} color="black" />
					</skinnedMesh>
				</group>
			</group>
		</group>
	);
};

useGLTF.preload("models/Characters_Skeleton.gltf");
