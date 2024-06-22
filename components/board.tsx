import { MeshDistortMaterial } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export const Board = () => {
	return (
		<RigidBody type="fixed" colliders="cuboid" position-y={-1} name="ocean">
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[170, 170]} />
				<MeshDistortMaterial color="#70E6FD" />
			</mesh>
		</RigidBody>
	);
};
