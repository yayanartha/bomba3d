import { Instance, Instances } from "@react-three/drei";
import { useFrame, type Vector3 } from "@react-three/fiber";
import { isHost } from "playroomkit";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const bulletHitcolor = new THREE.Color("red");
bulletHitcolor.multiplyScalar(12);

interface Props {
	position: THREE.Vector3;
	onEnded(): void;
}

export const FireHit = ({ position, onEnded }: Props) => {
	const boxes = useMemo(
		() =>
			Array.from({ length: 100 }, () => ({
				target: new THREE.Vector3(
					THREE.MathUtils.randFloat(-0.6, 0.6),
					THREE.MathUtils.randFloat(-0.6, 0.6),
					THREE.MathUtils.randFloat(-0.6, 0.6),
				),
				scale: 0.1, //MathUtils.randFloat(0.03, 0.09),
				speed: THREE.MathUtils.randFloat(0.1, 0.3),
			})),
		[],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setTimeout(() => {
			if (isHost()) {
				onEnded();
			}
		}, 500);
	}, []);

	return (
		<group position={[position.x, position.y, position.z]}>
			<Instances>
				<boxGeometry />
				<meshStandardMaterial toneMapped={false} color={bulletHitcolor} />
				{boxes.map((box, index) => (
					<AnimatedBox key={`box-${index}`} {...box} />
				))}
			</Instances>
		</group>
	);
};

interface AnimatedBoxProps {
	target: Vector3;
	scale: number;
	speed: number;
}

const AnimatedBox = ({ scale, target, speed }: AnimatedBoxProps) => {
	const ref = useRef();

	useFrame((_, delta) => {
		if (ref.current.scale.x > 0) {
			ref.current.scale.x =
				ref.current.scale.y =
				ref.current.scale.z -=
					speed * delta;
		}
		ref.current.position.lerp(target, speed);
	});
	return <Instance ref={ref} scale={scale} position={[0, 0, 0]} />;
};
