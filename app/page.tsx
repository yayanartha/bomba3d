"use client";
import { Experience } from "@/components/experience";
import { UI } from "@/components/ui";
import { KeyboardControls, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
// import { Leva } from "leva";
import { insertCoin, isHost } from "playroomkit";
import { Suspense, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

const GameEngineProvider = dynamic(() => import("../hooks/use-game-engine"), {
	ssr: false,
});

const DEBUG = true;

export const Controls = {
	left: "left",
	right: "right",
	fire: "fire",
};

export default function Home() {
	const controlMap = useMemo(
		() => [
			{ name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
			{ name: Controls.right, keys: ["ArrowRight", "KeyD"] },
			{ name: Controls.fire, keys: ["Space"] },
		],
		[],
	);

	useEffect(() => {
		(async () => {
			await insertCoin({
				maxPlayersPerRoom: 2,
			});
		})();
	}, []);

	return (
		<main className="w-screen h-screen">
			{/* <Leva hidden={!DEBUG || !isHost()} /> */}

			<KeyboardControls map={controlMap}>
				<GameEngineProvider>
					<Canvas shadows camera={{ position: [0, 16, 10], fov: 42 }}>
						<color attach="background" args={["#FDF4C3"]} />
						<fog attach="fog" args={["#FDF4C3", 19, 40]} />

						<Suspense>
							<Physics>
								<Experience />
							</Physics>
						</Suspense>
					</Canvas>

					<UI />
				</GameEngineProvider>
			</KeyboardControls>

			{/* <Loader /> */}
		</main>
	);
}
