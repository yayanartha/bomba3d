"use client";
import { Experience } from "@/components/experience";
import { UI } from "@/components/ui";
import { SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Leva } from "leva";
import { Suspense } from "react";

export default function Home() {
	return (
		<main className="w-screen h-screen">
			<Leva />

			<Canvas shadows camera={{ position: [0, 15, 12], fov: 120 }}>
				<color attach="background" args={["#FDF4C3"]} />
				<fog attach="fog" args={["#FDF4C3", 19, 40]} />

				<SoftShadows size={42} />

				<Suspense>
					<Physics debug>
						<Experience />
					</Physics>
				</Suspense>
			</Canvas>

			<UI />
		</main>
	);
}
