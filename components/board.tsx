import { MeshReflectorMaterial } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export const Board = () => {
	return (
		<RigidBody type="fixed" colliders="cuboid" position-y={-1} name="ocean">
			<mesh rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[170, 170]} />
				<MeshReflectorMaterial
					mirror={0}
					resolution={2048}
					depthScale={2}
					distortion={1}
					color="#70E6FD"
				/>
			</mesh>
		</RigidBody>
	);
};
