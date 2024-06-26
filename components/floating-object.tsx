// FloatingObject.js
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

export const FloatingObject = ({ waveHeight, waveFrequency }) => {
	const ref = useRef();

	useFrame(({ clock }) => {
		const time = clock.getElapsedTime() * 0.3; // Reduced speed to match ocean waves
		const position = ref.current.position;

		// Wave functions
		const wave1 = Math.sin(position.x * waveFrequency + time) * waveHeight;
		const wave2 =
			Math.sin(position.y * waveFrequency * 0.7 + time * 0.5) *
			waveHeight *
			0.5;
		const wave3 =
			Math.sin((position.x + position.y) * waveFrequency * 0.5 + time * 1.5) *
			waveHeight *
			0.3;
		const horizontalWave =
			Math.sin((position.x + time * 0.8) * waveFrequency) * waveHeight * 0.6 +
			Math.sin((position.x - time * 0.6) * waveFrequency) * waveHeight * 0.6;

		// Update the vertical position to match the wave
		position.z = wave1 + wave2 + wave3 + horizontalWave;

		// Calculate the normal for rotation (simplified approach)
		const normal = new THREE.Vector3(
			Math.cos(position.x * waveFrequency + time),
			Math.cos(position.y * waveFrequency + time * 0.5),
			1.0,
		).normalize();

		// Align the object's rotation to the wave normal
		ref.current.lookAt(position.x, position.y, position.z + normal.z);
	});

	return (
		<Sphere ref={ref} args={[0.5, 32, 32]} position={[0, 0, 2]} castShadow>
			<meshStandardMaterial color="orange" />
		</Sphere>
	);
};

export default FloatingObject;
