"use client";
import { GameState, useGameEngine } from "@/hooks/use-game-engine";
import { Environment } from "@react-three/drei";
import dynamic from "next/dynamic";

const Lobby = dynamic(() => import("./lobby"), { ssr: false });
const Podium = dynamic(() => import("./podium"), { ssr: false });
const Game = dynamic(() => import("./game"), { ssr: false });

export const Experience = () => {
	const { gameState } = useGameEngine();

	return (
		<>
			{gameState === GameState.Lobby && <Lobby />}
			{gameState === GameState.Winner && <Podium />}
			{gameState === GameState.Game && <Game />}

			<directionalLight intensity={0.5} position={[5, 15, -5]} castShadow />
			<Environment preset="warehouse" />
			<fog
				attach="fog"
				args={[
					"#FDF4C3",
					gameState === GameState.Game ? 20 : 10,
					gameState === GameState.Game ? 80 : 40,
				]}
			/>
		</>
	);
};
