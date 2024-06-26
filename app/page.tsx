"use client";
import { Experience } from "@/components/experience";
import { KeyboardControls } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { insertCoin } from "playroomkit";
import { Suspense, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { UI } from "@/components/ui";
import { Perf } from "r3f-perf";
import { Loader } from "@react-three/drei";

const GameEngineProvider = dynamic(() => import("../hooks/use-game-engine"), {
	ssr: false,
});
const DEBUG = false;

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
			try {
				await insertCoin({
					skipLobby: true,
					maxPlayersPerRoom: 2,
				});
			} catch (error) {
				if ((error as any).message === "ROOM_LIMIT_EXCEEDED") {
					// Here you can display a custom error
				}
			}
		})();
	}, []);

	return (
		<main className="w-screen h-screen">
			<Loader />

			<GameEngineProvider>
				<KeyboardControls map={controlMap}>
					<Canvas
						shadows
						camera={{ position: [0, 20, 40], fov: 42 }}
						style={{ touchAction: "none" }}
					>
						<color attach="background" args={["#FDF4C3"]} />
						{DEBUG && <Perf />}

						<Suspense>
							<Physics>
								<Experience />
							</Physics>
						</Suspense>

						<EffectComposer>
							<DepthOfField
								focusDistance={0.02}
								focalLength={0.1}
								bokehScale={2}
								height={480}
							/>
						</EffectComposer>
					</Canvas>
				</KeyboardControls>

				<UI />
			</GameEngineProvider>
		</main>
	);
}
